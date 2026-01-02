"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import type { Message } from "@/types";

export function MessageList({ chatId }: { chatId: string }) {
  const { currentUser } = useUserStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, fetchMessages } = useChatStore();
  
  const chatMessages = messages[chatId] || [];

  useEffect(() => {
    fetchMessages(chatId);
  }, [chatId, fetchMessages]);

  const currentUserId = currentUser?.id;

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages.length]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {chatMessages.map((message, index) => {
          const isOwn = message.authorId === currentUserId;
          const showAvatar =
            index === chatMessages.length - 1 ||
            chatMessages[index + 1]?.authorId !== message.authorId;

          return (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={isOwn}
              showAvatar={showAvatar}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
