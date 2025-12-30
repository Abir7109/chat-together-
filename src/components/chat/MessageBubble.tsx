"use client";

import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Smile, Reply, MoreHorizontal, Trash2, Edit2 } from "lucide-react";
import { mockUsers } from "@/lib/mockData";
import { useState } from "react";
import type { Message } from "@/types";

const messageVariants = {
  initial: { opacity: 0, scale: 0.98, y: 6 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.18 } },
};

type MessageBubbleProps = {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
};

export function MessageBubble({ message, isOwn, showAvatar }: MessageBubbleProps) {
  const author = mockUsers.find(u => u.id === message.authorId);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [localReactions, setLocalReactions] = useState(message.reactions || []);

  const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

  const handleReaction = (emoji: string) => {
    const currentUser = localStorage.getItem('user');
    const user = currentUser ? JSON.parse(currentUser) : { id: 'user-1' };
    
    // Toggle reaction
    const existingReaction = localReactions.find(r => r.emoji === emoji && r.userId === user.id);
    if (existingReaction) {
      setLocalReactions(localReactions.filter(r => !(r.emoji === emoji && r.userId === user.id)));
    } else {
      setLocalReactions([...localReactions, { emoji, userId: user.id }]);
    }
    setShowReactionPicker(false);
  };
  return (
    <motion.div
      variants={messageVariants}
      initial="initial"
      animate="animate"
      className={`flex gap-2 group ${isOwn ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div className="w-8 h-8 flex-shrink-0">
        {showAvatar && !isOwn && (
          <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center text-white text-sm font-semibold">
            {author?.displayName.charAt(0) || '?'}
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"} max-w-lg`}>
        <div className="relative">
          {/* Hover Actions */}
          <div
            className={`absolute top-0 ${
              isOwn ? "left-0 -translate-x-full" : "right-0 translate-x-full"
            } opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 px-2`}
          >
            <div className="relative">
              <button 
                onClick={() => setShowReactionPicker(!showReactionPicker)}
                className="p-1.5 hover:bg-tan/20 rounded-lg transition-colors bg-white/80"
              >
                <Smile size={16} />
              </button>
              <AnimatePresence>
                {showReactionPicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 5 }}
                    className="absolute bottom-full mb-2 left-0 bg-white rounded-xl shadow-lg p-2 flex gap-1 border border-tan/20"
                  >
                    {quickReactions.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(emoji)}
                        className="p-2 hover:bg-tan/10 rounded-lg transition-colors text-xl"
                      >
                        {emoji}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button className="p-1.5 hover:bg-blue-1/20 rounded-lg transition-colors bg-white/80">
              <Reply size={16} />
            </button>
            {isOwn && (
              <>
                <button className="p-1.5 hover:bg-blue-1/20 rounded-lg transition-colors bg-white/80">
                  <Edit2 size={16} />
                </button>
                <button className="p-1.5 hover:bg-blue-1/20 rounded-lg transition-colors bg-white/80 text-red-500">
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>

          {/* Bubble */}
          <div
            className={`message-bubble ${
              isOwn ? "message-bubble-own" : "message-bubble-other"
            }`}
          >
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
        </div>

        {/* Timestamp */}
        <span className="text-xs text-text/50 mt-1 px-2">
          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
        </span>

        {/* Reactions */}
        {localReactions.length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {Object.entries(
              localReactions.reduce((acc, r) => {
                acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([emoji, count]) => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className="px-2 py-0.5 bg-white/80 hover:bg-white rounded-full text-sm border border-tan/20 transition-colors"
              >
                {emoji} {count > 1 && count}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
