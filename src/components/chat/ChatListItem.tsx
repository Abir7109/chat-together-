"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

type Chat = {
  id: string;
  name: string;
  avatarUrl?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  type: "direct" | "group";
};

export function ChatListItem({ chat }: { chat: Chat }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={`/chat/${chat.id}`}
        className="block px-4 py-3 hover:bg-tan/10 transition-colors border-b border-tan/10"
      >
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-sage flex items-center justify-center text-white font-semibold flex-shrink-0">
            {chat.type === "group" ? (
              <Users size={20} />
            ) : (
              (chat.name || '?').charAt(0).toUpperCase()
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between mb-1">
              <h3 className="font-semibold text-text truncate">
                {chat.name || 'Unnamed Chat'}
              </h3>
              <span className="text-xs text-text/60 ml-2 flex-shrink-0">
                {chat.timestamp ? new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-text/70 truncate">{chat.lastMessage || 'No messages yet'}</p>
              {/* unreadCount is not yet implemented in backend, keeping logic for future */}
              {chat.unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-sage text-white text-xs rounded-full flex-shrink-0">
                  {chat.unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
