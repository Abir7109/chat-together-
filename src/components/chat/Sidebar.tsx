"use client";

import { useState, useEffect } from "react";
import { Search, Settings, Plus, Users } from "lucide-react";
import { Logo } from "@/components/branding/Logo";
import { ChatListItem } from "./ChatListItem";
import { UserSearchModal } from "./UserSearchModal";
import { CreateGroupModal } from "./CreateGroupModal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import type { Chat, User } from "@/types";

type FilterType = "all" | "unread" | "groups" | "mentions";

export function Sidebar() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserSearchOpen, setIsUserSearchOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  
  const { chats, fetchChats } = useChatStore();
  const { currentUser, users } = useUserStore();

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // Subscribe to real-time updates
  useEffect(() => {
    const { subscribeToUpdates, unsubscribeFromUpdates } = useChatStore.getState();
    subscribeToUpdates();
    return () => unsubscribeFromUpdates();
  }, []);

  const getChatName = (chat: Chat) => {
    if (chat.type === 'group') {
      return chat.name || 'Group Chat';
    }
    const otherMemberId = chat.members.find(id => id !== currentUser?.id);
    if (!otherMemberId) return 'Unknown User';
    const otherUser = users[otherMemberId];
    return otherUser ? (otherUser.displayName || otherUser.username) : 'Unknown User';
  };

  const chatList = Object.values(chats)
    .map((chat) => ({
      id: chat.id,
      name: getChatName(chat),
      avatarUrl: undefined, // TODO: Chat avatar
      lastMessage: 'No messages yet', // TODO: Fetch last message
      timestamp: '',
      unreadCount: 0,
      type: chat.type,
    }))
    .filter((chat) => {
      if (filter === "groups") return chat.type === "group";
      if (filter === "unread") return chat.unreadCount > 0;
      return true;
    })
    .filter((chat) => 
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const totalUnread = chatList.reduce((acc, chat) => acc + chat.unreadCount, 0);
  const totalGroups = Object.values(chats).filter(c => c.type === "group").length;

  const filters: { key: FilterType; label: string; count?: number }[] = [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread", count: totalUnread },
    { key: "groups", label: "Groups", count: totalGroups },
    { key: "mentions", label: "Mentions", count: 0 },
  ];

  return (
    <aside className="w-80 panel border-r border-tan/20 flex flex-col">
      {/* Profile Strip */}
      <div className="p-4 border-b border-tan/20">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-text truncate">{currentUser?.displayName || 'User'}</h2>
            <div className="flex items-center gap-2 text-sm text-text/60">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span>Online</span>
            </div>
          </div>
          <Link href="/settings" className="p-2 hover:bg-tan/20 rounded-lg transition-colors">
            <Settings size={18} />
          </Link>
        </div>
      </div>

      {/* Search & New Chat */}
      <div className="p-3 border-b border-tan/20 space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" size={18} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/60 border border-tan/30 rounded-lg focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsUserSearchOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-sage text-white px-4 py-2 rounded-lg font-medium hover:bg-sage-dark transition-colors"
          >
            <Plus size={18} />
            Chat
          </button>
          <button
            onClick={() => setIsGroupModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-sage-light text-white px-4 py-2 rounded-lg font-medium hover:bg-sage transition-colors"
          >
            <Users size={18} />
            Group
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-3 border-b border-tan/20">
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === f.key
                  ? "bg-sage text-white"
                  : "bg-white/60 text-text hover:bg-tan/30"
              }`}
            >
              {f.label}
              {f.count !== undefined && f.count > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {chatList.length === 0 ? (
           <div className="p-4 text-center text-text/60 text-sm">
             No chats yet. Start a conversation!
           </div>
        ) : (
          <div>
            {chatList.map((chat) => (
              <ChatListItem key={chat.id} chat={chat} />
            ))}
          </div>
        )}
      </div>

      <UserSearchModal
        isOpen={isUserSearchOpen}
        onClose={() => setIsUserSearchOpen(false)}
        onSelectUser={async (userId) => {
          const existingChat = Object.values(chats).find(c => 
            c.type === 'direct' && c.members.includes(userId)
          );
          if (existingChat) {
            router.push(`/chat/${existingChat.id}`);
          } else {
             try {
               const { createDirectChat } = useChatStore.getState();
               const newChatId = await createDirectChat(userId);
               router.push(`/chat/${newChatId}`);
             } catch (error) {
               console.error("Failed to create chat", error);
             }
          }
          setIsUserSearchOpen(false);
        }}
      />

      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
      />
    </aside>
  );
}
