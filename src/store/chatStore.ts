import { create } from 'zustand';
import type { Chat, Message } from '@/types';
import { chatService } from '@/services/chatService';
import { useUserStore } from './userStore';
import { supabase } from '@/lib/supabase';

type ChatStore = {
  chats: Record<string, Chat>;
  messages: Record<string, Message[]>;
  typing: Record<string, string[]>;
  replyingTo: Message | null;
  
  // Actions
  fetchChats: () => Promise<void>;
  fetchMessages: (chatId: string) => Promise<void>;
  setReplyingTo: (message: Message | null) => void;
  sendNewMessage: (chatId: string, content: string, replyToId?: string, media?: any[]) => Promise<void>;
  addReaction: (chatId: string, messageId: string, emoji: string) => Promise<void>;
  removeReaction: (chatId: string, messageId: string, emoji: string) => Promise<void>;
  createDirectChat: (otherUserId: string) => Promise<string>;
  createGroupChat: (name: string, memberIds: string[]) => Promise<string>;
  
  subscribeToUpdates: () => void;
  unsubscribeFromUpdates: () => void;

  // Realtime handlers (to be called by subscription listeners)
  addChat: (chat: Chat) => void;
  addMessage: (message: Message) => void;
  setTyping: (chatId: string, userId: string, isTyping: boolean) => void;
  getTypingUsers: (chatId: string) => string[];
};

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: {},
  messages: {},
  typing: {},
  replyingTo: null,
  
  fetchChats: async () => {
    const data = await chatService.getChats();
    const chatsMap: Record<string, Chat> = {};
    
    data.forEach(({ chat, members }) => {
      chatsMap[chat.id] = chat;
      // Add users to user store
      members.forEach(member => {
        useUserStore.getState().addUser(member);
      });
    });

    set({ chats: chatsMap });
  },

  fetchMessages: async (chatId) => {
    const messages = await chatService.getMessages(chatId);
    set((state) => ({
      messages: { ...state.messages, [chatId]: messages }
    }));
  },

  setReplyingTo: (message) => set({ replyingTo: message }),

  sendNewMessage: async (chatId, content, replyToId, media) => {
    const message = await chatService.sendMessage(chatId, content, replyToId, media);
    // Optimistic update or wait for real-time? 
    // For now, let's add it directly. Real-time subscription should handle deduplication if needed.
    get().addMessage(message);
    set({ replyingTo: null });
  },

  addReaction: async (chatId, messageId, emoji) => {
    // Optimistic update
    const { messages } = get();
    const chatMessages = messages[chatId] || [];
    const currentUser = useUserStore.getState().currentUser;
    if (!currentUser) return;

    const updatedMessages = chatMessages.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        if (!reactions.some(r => r.emoji === emoji && r.userId === currentUser.id)) {
          return { ...msg, reactions: [...reactions, { emoji, userId: currentUser.id }] };
        }
      }
      return msg;
    });

    set({ messages: { ...messages, [chatId]: updatedMessages } });

    await chatService.addReaction(messageId, emoji);
  },

  removeReaction: async (chatId, messageId, emoji) => {
    // Optimistic update
    const { messages } = get();
    const chatMessages = messages[chatId] || [];
    const currentUser = useUserStore.getState().currentUser;
    if (!currentUser) return;

    const updatedMessages = chatMessages.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        return { 
          ...msg, 
          reactions: reactions.filter(r => !(r.emoji === emoji && r.userId === currentUser.id)) 
        };
      }
      return msg;
    });

    set({ messages: { ...messages, [chatId]: updatedMessages } });

    await chatService.removeReaction(messageId, emoji);
  },

  createDirectChat: async (otherUserId) => {
    const chat = await chatService.createDirectChat(otherUserId);
    get().addChat(chat);
    return chat.id;
  },

  createGroupChat: async (name, memberIds) => {
    const chat = await chatService.createGroupChat(name, memberIds);
    get().addChat(chat);
    return chat.id;
  },

  // Realtime subscriptions
  subscribeToUpdates: () => {
    const { addMessage, addChat } = get();
    const currentUser = useUserStore.getState().currentUser;

    if (!currentUser) return;
    
    // Subscribe to new messages
    const messageSubscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'messages' 
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newMessage = payload.new as any;
          // Only add message if we have the chat locally or if it's relevant?
          // For now, we add it. The UI filters by chatId anyway.
          addMessage({
            id: newMessage.id,
            chatId: newMessage.chat_id,
            authorId: newMessage.author_id,
            content: newMessage.content,
            replyToId: newMessage.reply_to_id,
            media: newMessage.media,
            reactions: newMessage.reactions,
            createdAt: newMessage.created_at,
          });
        } else if (payload.eventType === 'UPDATE') {
          const updatedMessage = payload.new as any;
          const { messages } = get();
          const chatMessages = messages[updatedMessage.chat_id] || [];
          const newMessages = chatMessages.map(m => 
            m.id === updatedMessage.id 
              ? {
                  ...m,
                  content: updatedMessage.content,
                  reactions: updatedMessage.reactions,
                  media: updatedMessage.media,
                  replyToId: updatedMessage.reply_to_id
                }
              : m
          );
          set({ messages: { ...messages, [updatedMessage.chat_id]: newMessages } });
        }
      })
      .subscribe();

    // Subscribe to chat_members to detect new chats
    const chatSubscription = supabase
      .channel(`public:chat_members:${currentUser.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_members',
        filter: `user_id=eq.${currentUser.id}`
      }, async (payload) => {
        // New chat added for this user
        const newMember = payload.new as any;
        // Fetch the full chat details
        const { data: chatData, error } = await supabase
            .from('chats')
            .select(`
                *,
                members:chat_members(
                    user_id,
                    profile:profiles(*)
                )
            `)
            .eq('id', newMember.chat_id)
            .single();
            
        if (!error && chatData) {
            const members = chatData.members.map((m: any) => ({
                id: m.profile.id,
                username: m.profile.username,
                displayName: m.profile.display_name,
                avatarUrl: m.profile.avatar_url,
                bio: m.profile.bio,
                createdAt: m.profile.created_at,
            }));

            // Add users to store
            members.forEach((member: any) => {
                useUserStore.getState().addUser(member);
            });

            addChat({
                id: chatData.id,
                type: chatData.type,
                name: chatData.name,
                members: members.map((u: any) => u.id),
                createdAt: chatData.created_at,
                createdBy: chatData.created_by,
                e2ee: chatData.e2ee,
            });
        }
      })
      .subscribe();
  },

  unsubscribeFromUpdates: () => {
    supabase.removeAllChannels();
  },

  addChat: (chat) =>
    set((state) => ({
      chats: { ...state.chats, [chat.id]: chat },
    })),
  
  addMessage: (message) =>
    set((state) => {
      const chatMessages = state.messages[message.chatId] || [];
      // Prevent duplicates
      if (chatMessages.some(m => m.id === message.id)) return state;
      
      return {
        messages: {
          ...state.messages,
          [message.chatId]: [...chatMessages, message],
        },
      };
    }),
  
  setTyping: (chatId, userId, isTyping) =>
    set((state) => {
      const currentTyping = state.typing[chatId] || [];
      const newTyping = isTyping
        ? [...currentTyping.filter(id => id !== userId), userId]
        : currentTyping.filter(id => id !== userId);
      
      return {
        typing: { ...state.typing, [chatId]: newTyping },
      };
    }),
  
  getTypingUsers: (chatId) => get().typing[chatId] || [],
}));
