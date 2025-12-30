import { create } from 'zustand';
import type { User, Presence } from '@/types';

type UserStore = {
  currentUser: User | null;
  users: Record<string, User>;
  presence: Record<string, Presence>;
  setCurrentUser: (user: User | null) => void;
  addUser: (user: User) => void;
  updatePresence: (userId: string, presence: Presence) => void;
  getUser: (userId: string) => User | undefined;
};

export const useUserStore = create<UserStore>((set, get) => ({
  currentUser: null,
  users: {},
  presence: {},
  
  setCurrentUser: (user) => set({ currentUser: user }),
  
  addUser: (user) =>
    set((state) => ({
      users: { ...state.users, [user.id]: user },
    })),
  
  updatePresence: (userId, presence) =>
    set((state) => ({
      presence: { ...state.presence, [userId]: presence },
    })),
  
  getUser: (userId) => get().users[userId],
}));
