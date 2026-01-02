"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Check, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/chatStore";
import { useToastStore } from "@/components/ui/Toast";
import { chatService } from "@/services/chatService";
import type { User } from "@/types";

type CreateGroupModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { createGroupChat } = useChatStore();
  const { addToast } = useToastStore();

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const users = await chatService.searchUsers(value);
      setSearchResults(users);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleUser = (user: User) => {
    setSelectedUsers(prev =>
      prev.find(u => u.id === user.id)
        ? prev.filter(u => u.id !== user.id)
        : [...prev, user]
    );
  };

  const handleCreate = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) {
        addToast("Please enter a group name and select at least one member", "error");
        return;
    }
    
    try {
        const chatId = await createGroupChat(groupName, selectedUsers.map(u => u.id));
        addToast("Group created successfully!", "success");
        onClose();
        router.push(`/chat/${chatId}`);
    } catch (error: any) {
        addToast(error.message || "Failed to create group", "error");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="panel rounded-2xl shadow-2xl p-6 m-4 max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sage/20 rounded-lg">
                    <Users className="text-sage" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-text">Create Group</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-blue-1/20 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto min-h-0">
                {/* Group Name */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-text mb-2">
                    Group Name
                    </label>
                    <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="My Awesome Group"
                    className="w-full px-4 py-3 bg-white/60 border border-tan/30 rounded-xl focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20"
                    />
                </div>

                {/* Member Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-text mb-2">
                    Add Members ({selectedUsers.length})
                    </label>
                    
                    {/* Search Input */}
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" size={16} />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search users to add..."
                            className="w-full pl-9 pr-4 py-2 bg-white/60 border border-tan/30 rounded-lg text-sm focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20"
                        />
                    </div>

                    {/* Selected Users Pills */}
                    {selectedUsers.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {selectedUsers.map(user => (
                                <div key={user.id} className="flex items-center gap-1 bg-sage/10 text-sage-dark px-2 py-1 rounded-full text-xs font-medium">
                                    <span>{user.displayName}</span>
                                    <button onClick={() => toggleUser(user)} className="hover:text-red-500">
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin border border-tan/20 rounded-xl p-2 bg-white/30">
                    {query ? (
                        isSearching ? (
                            <div className="text-center py-4 text-text/60 text-sm">Searching...</div>
                        ) : searchResults.length === 0 ? (
                            <div className="text-center py-4 text-text/60 text-sm">No users found</div>
                        ) : (
                            searchResults.map((user) => {
                                const isSelected = selectedUsers.some(u => u.id === user.id);
                                return (
                                <button
                                    key={user.id}
                                    onClick={() => toggleUser(user)}
                                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left ${
                                    isSelected ? 'bg-sage/10' : 'hover:bg-tan/10'
                                    }`}
                                >
                                    <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                                    {user.displayName.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                    <p className="font-medium text-text truncate text-sm">{user.displayName}</p>
                                    <p className="text-xs text-text/60 truncate">@{user.username}</p>
                                    </div>
                                    {isSelected && <Check size={16} className="text-sage" />}
                                </button>
                                );
                            })
                        )
                    ) : (
                        <div className="text-center py-4 text-text/60 text-sm">Type to search users</div>
                    )}
                    </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-tan/20 flex justify-end gap-3 flex-shrink-0">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-text/60 hover:text-text font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!groupName.trim() || selectedUsers.length === 0}
                  className="px-6 py-2 bg-sage text-white rounded-xl font-medium hover:bg-sage-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Group
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
