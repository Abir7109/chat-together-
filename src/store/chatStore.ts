import { create } from 'zustand';
import type { Chat, Message } from '@/types';
import { chatService } from '@/services/chatService';
import { useUserStore } from './userStore';
import { supabase } from '@/lib/supabase';

type ChatStore = {
  chats: Record<string, Chat>;
  messages: Record<string, Message[]>;
  typing: Record<string, string[]>;
  
  // Actions
  fetchChats: () => Promise<void>;
  fetchMessages: (chatId: string) => Promise<void>;
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
    const { addMessage } = get();
    
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

    // Subscribe to new chats (via chat_members for the current user)
    // Note: RLS policies should filter this, but client-side filtering is also good
    // However, Supabase realtime with RLS works best when subscribing to specific rows or using "postgres_changes" with filter
    // For simplicity, we might just refresh chats on certain events or listen to everything if traffic is low.
    // Better approach: Listen to 'chat_members' insertions where user_id = current_user
    // But we need the current user ID.
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
