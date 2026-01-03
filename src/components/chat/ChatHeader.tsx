"use client";

import { Phone, Video, Search, MoreVertical, Pin, Users } from "lucide-react";
import { mockChats, mockUsers, getChatName } from "@/lib/mockData";
import { useEffect, useState } from "react";
import { CallModal } from "./CallModal";
import { SearchModal } from "./SearchModal";
import { ProfileModal } from "./ProfileModal";
import { useUserStore } from "@/store/userStore";

export function ChatHeader({ chatId }: { chatId: string }) {
  const { currentUser } = useUserStore();
  const [callType, setCallType] = useState<"voice" | "video" | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const chat = mockChats.find(c => c.id === chatId);
  const chatName = chat ? getChatName(chat, mockUsers, currentUser?.id || 'user-1') : 'Chat';
  const isGroup = chat?.type === 'group';
  const memberCount = chat?.members.length || 0;

  return (
    <header className="panel border-b border-tan/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <button
            onClick={() => !isGroup && setShowProfile(true)}
            className={`w-10 h-10 rounded-full bg-sage flex items-center justify-center text-white font-semibold ${
              !isGroup && 'hover:bg-sage-light cursor-pointer transition-colors'
            }`}
          >
            {isGroup ? <Users size={20} /> : chatName.charAt(0)}
          </button>

          {/* Info */}
          <div>
            <h2 className="font-semibold text-text">{chatName}</h2>
            <p className="text-sm text-text/60">
              {isGroup ? `${memberCount} members` : 'online'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCallType("voice")}
            className="p-2 hover:bg-tan/20 rounded-lg transition-colors"
          >
            <Phone size={20} />
          </button>
          <button 
            onClick={() => setCallType("video")}
            className="p-2 hover:bg-blue-1/20 rounded-lg transition-colors"
          >
            <Video size={20} />
          </button>
          <button 
            onClick={() => setShowSearch(true)}
            className="p-2 hover:bg-blue-1/20 rounded-lg transition-colors"
          >
            <Search size={20} />
          </button>
          <button className="p-2 hover:bg-blue-1/20 rounded-lg transition-colors">
            <Pin size={20} />
          </button>
          <button className="p-2 hover:bg-blue-1/20 rounded-lg transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      <CallModal
        isOpen={callType !== null}
        onClose={() => setCallType(null)}
        type={callType || "voice"}
        userName={chatName}
      />

      <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        chatId={chatId}
      />

      {!isGroup && chat && (
        <ProfileModal
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
          userId={chat.members.find(id => id !== (currentUser?.id || 'user-1')) || ''}
        />
      )}
    </header>
  );
}
