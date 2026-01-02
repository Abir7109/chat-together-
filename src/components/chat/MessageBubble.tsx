"use client";

import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Smile, Reply, MoreHorizontal, Trash2, Edit2 } from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
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
  const { getUser } = useUserStore();
  const { addReaction, removeReaction } = useChatStore();
  const author = getUser(message.authorId);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const { currentUser } = useUserStore();

  const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

  const handleReaction = async (emoji: string) => {
    if (!currentUser) return;
    
    const existingReaction = message.reactions?.find(r => r.emoji === emoji && r.userId === currentUser.id);
    
    if (existingReaction) {
      await removeReaction(message.chatId, message.id, emoji);
    } else {
      await addReaction(message.chatId, message.id, emoji);
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
            {/* Replied Message Context */}
            {repliedMessage && (
              <div className={`mb-2 rounded px-2 py-1 text-sm border-l-2 ${
                isOwn ? "bg-black/5 border-black/20" : "bg-white/40 border-sage-dark/50"
              }`}>
                <p className="font-semibold text-xs opacity-70">
                  {repliedAuthor?.displayName || 'Unknown'}
                </p>
                <p className="truncate opacity-60">
                  {repliedMessage.content || (repliedMessage.media?.length ? 'Attachment' : '')}
                </p>
              </div>
            )}

            {/* Media Attachments */}
            {message.media && message.media.length > 0 && (
              <div className="mb-2 space-y-2">
                {message.media.map((item, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden">
                    {item.type === 'image' ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={item.url} 
                        alt="attachment" 
                        className="max-w-full max-h-60 object-cover"
                      />
                    ) : (
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 bg-black/10 rounded hover:bg-black/20 transition-colors"
                      >
                        <span className="text-sm underline">{item.filename || 'File'}</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
        </div>

        {/* Timestamp */}
        <span className="text-xs text-text/50 mt-1 px-2">
          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
        </span>

        {/* Reactions Display */}
        {message.reactions && message.reactions.length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-1 ${isOwn ? "justify-end" : "justify-start"}`}>
            {Array.from(new Set(message.reactions.map(r => r.emoji))).map(emoji => {
              const count = message.reactions!.filter(r => r.emoji === emoji).length;
              const hasReacted = message.reactions!.some(r => r.emoji === emoji && r.userId === currentUser?.id);
              return (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className={`text-xs px-1.5 py-0.5 rounded-full border transition-colors ${
                    hasReacted 
                      ? "bg-blue-100 border-blue-300" 
                      : "bg-white/50 border-gray-200 hover:bg-white"
                  }`}
                >
                  {emoji} <span className="ml-0.5 font-medium">{count}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
