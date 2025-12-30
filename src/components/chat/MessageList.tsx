"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { mockMessages } from "@/lib/mockData";
import { useChatStore } from "@/store/chatStore";
import type { Message } from "@/types";

export function MessageList({ chatId }: { chatId: string }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const storeMessages = useChatStore(state => state.messages[chatId] || []);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // Combine mock messages with store messages
  const allMessages = [...(mockMessages[chatId] || []), ...storeMessages];
  const currentUserId = currentUser?.id || "user-1";

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages.length]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {allMessages.map((message, index) => {
          const isOwn = message.authorId === currentUserId;
          const showAvatar =
            index === allMessages.length - 1 ||
            allMessages[index + 1].authorId !== message.authorId;

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
