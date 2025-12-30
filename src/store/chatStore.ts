import { create } from 'zustand';
import type { Chat, Message } from '@/types';

type ChatStore = {
  chats: Record<string, Chat>;
  messages: Record<string, Message[]>;
  typing: Record<string, string[]>; // chatId -> userId[]
  
  addChat: (chat: Chat) => void;
  addMessage: (message: Message) => void;
  getMessages: (chatId: string) => Message[];
  setTyping: (chatId: string, userId: string, isTyping: boolean) => void;
  getTypingUsers: (chatId: string) => string[];
};

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: {},
  messages: {},
  typing: {},
  
  addChat: (chat) =>
    set((state) => ({
      chats: { ...state.chats, [chat.id]: chat },
    })),
  
  addMessage: (message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [message.chatId]: [...(state.messages[message.chatId] || []), message],
      },
    })),
  
  getMessages: (chatId) => get().messages[chatId] || [],
  
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
