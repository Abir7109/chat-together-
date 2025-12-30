"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Settings, Plus, Users } from "lucide-react";
import { Logo } from "@/components/branding/Logo";
import { ChatListItem } from "./ChatListItem";
import { UserSearchModal } from "./UserSearchModal";
import { CreateGroupModal } from "./CreateGroupModal";
import { mockChats, mockUsers, mockMessages, getChatName, getLastMessage } from "@/lib/mockData";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Chat } from "@/types";

type FilterType = "all" | "unread" | "groups" | "mentions";

export function Sidebar() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isUserSearchOpen, setIsUserSearchOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const chats = mockChats
    .map((chat) => {
      const lastMessage = getLastMessage(chat.id);
      return {
        id: chat.id,
        name: getChatName(chat, mockUsers, currentUser?.id || 'user-1'),
        avatarUrl: undefined,
        lastMessage: lastMessage?.content || 'No messages yet',
        timestamp: lastMessage ? formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: true }) : '',
        unreadCount: Math.random() > 0.5 ? Math.floor(Math.random() * 3) : 0,
        type: chat.type,
      };
    })
    .filter((chat) => {
      if (filter === "groups") return chat.type === "group";
      if (filter === "unread") return chat.unreadCount > 0;
      return true;
    })
    .filter((chat) => 
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const totalUnread = chats.reduce((acc, chat) => acc + chat.unreadCount, 0);
  const totalGroups = mockChats.filter(c => c.type === "group").length;

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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
        >
          {chats.map((chat) => (
            <ChatListItem key={chat.id} chat={chat} />
          ))}
        </motion.div>
      </div>

      <UserSearchModal
        isOpen={isUserSearchOpen}
        onClose={() => setIsUserSearchOpen(false)}
        onSelectUser={(userId) => {
          const existingChat = mockChats.find(c => 
            c.type === 'direct' && c.members.includes(userId)
          );
          if (existingChat) {
            router.push(`/chat/${existingChat.id}`);
          }
        }}
      />

      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
      />
    </aside>
  );
}
