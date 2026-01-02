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
  sendNewMessage: (chatId: string, content: string) => Promise<void>;
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

  sendNewMessage: async (chatId, content) => {
    const message = await chatService.sendMessage(chatId, content);
    // Optimistic update or wait for real-time? 
    // For now, let's add it directly. Real-time subscription should handle deduplication if needed.
    get().addMessage(message);
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
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages' 
      }, (payload) => {
        const newMessage = payload.new as any;
        addMessage({
          id: newMessage.id,
          chatId: newMessage.chat_id,
          authorId: newMessage.sender_id,
          content: newMessage.content,
          type: newMessage.type,
          createdAt: newMessage.created_at,
          status: 'sent'
        });
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
