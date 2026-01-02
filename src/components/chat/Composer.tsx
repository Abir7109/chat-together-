"use client";

import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { Send, Paperclip, Smile, Image as ImageIcon, X } from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { chatService } from "@/services/chatService";
import { useUserStore } from "@/store/userStore";
import { useToastStore } from "@/components/ui/Toast";
import EmojiPicker from "emoji-picker-react";
import type { Message } from "@/types";

export function Composer({ chatId }: { chatId: string }) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sendNewMessage, replyingTo, setReplyingTo } = useChatStore();
  const { getUser } = useUserStore();
  const { addToast } = useToastStore();

  const handleSend = async () => {
    if (!message.trim() && selectedFiles.length === 0) return;
    
    try {
      let mediaAttachments: any[] = [];
      
      if (selectedFiles.length > 0) {
        // Upload files
        const uploadPromises = selectedFiles.map(async (file) => {
          try {
            const url = await chatService.uploadFile(file);
            return {
              id: Math.random().toString(36).substring(7),
              type: file.type.startsWith('image/') ? 'image' : 'file',
              url,
              filename: file.name,
              size: file.size,
              mimeType: file.type
            };
          } catch (e) {
            console.error("Failed to upload file", file.name, e);
            addToast(`Failed to upload ${file.name}`, "error");
            return null;
          }
        });

        const results = await Promise.all(uploadPromises);
        mediaAttachments = results.filter(Boolean);
      }

      await sendNewMessage(chatId, message.trim(), replyingTo?.id, mediaAttachments);
      
      setMessage("");
      setSelectedFiles([]);
      setShowEmojiPicker(false);
      
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error(error);
      addToast("Failed to send message", "error");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onEmojiClick = (emojiData: any) => {
    setMessage(prev => prev + emojiData.emoji);
    textareaRef.current?.focus();
  };

  return (
    <div className="panel border-t border-tan/20 p-4 relative">
      <div className="max-w-4xl mx-auto">
        {/* Reply Preview */}
        {replyingTo && (
          <div className="mb-3 flex items-center justify-between bg-tan/20 rounded-lg p-2 border-l-4 border-sage">
            <div className="flex flex-col text-sm overflow-hidden">
              <span className="font-semibold text-sage-dark">
                Replying to {getUser(replyingTo.authorId)?.displayName || 'Unknown'}
              </span>
              <span className="truncate text-text/60">
                {replyingTo.content || (replyingTo.media?.length ? 'Attachment' : '')}
              </span>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="p-1 hover:bg-tan/30 rounded"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* File Previews */}
        {selectedFiles.length > 0 && (
          <div className="mb-3 flex gap-2 flex-wrap">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="relative bg-tan/20 rounded-lg p-2 pr-8 text-sm">
                <span>{file.name}</span>
                <button
                  onClick={() => removeFile(idx)}
                  className="absolute right-1 top-1 p-1 hover:bg-tan/30 rounded"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-full mb-2 left-4 z-10">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
        <div className="flex items-end gap-3">
          {/* Attachments */}
          <div className="flex gap-1">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-tan/20 rounded-lg transition-colors"
            >
              <Paperclip size={20} className="text-text/60" />
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-blue-1/20 rounded-lg transition-colors"
            >
              <ImageIcon size={20} className="text-text/60" />
            </button>
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 hover:bg-blue-1/20 rounded-lg transition-colors"
            >
              <Smile size={20} className="text-text/60" />
            </button>
          </div>

          {/* Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="w-full resize-none bg-white/60 border border-tan/30 rounded-xl px-4 py-3 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all max-h-[200px] scrollbar-thin"
            />
            <div className="absolute right-3 bottom-3 text-xs text-text/40">
              {message.trim() ? "Enter to send" : "Shift+Enter for newline"}
            </div>
          </div>

          {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!message.trim() && selectedFiles.length === 0}
              className={`p-3 rounded-xl transition-all ${
                message.trim() || selectedFiles.length > 0
                  ? "bg-sage hover:bg-sage-dark text-white"
                  : "bg-tan/20 text-text/40 cursor-not-allowed"
              }`}
            >
              <Send size={20} />
            </button>
        </div>

        <p className="text-xs text-text/50 mt-2 text-center">
          End-to-end encrypted
        </p>
      </div>
    </div>
  );
}
