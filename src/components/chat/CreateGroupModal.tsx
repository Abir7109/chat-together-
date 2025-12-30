"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Check } from "lucide-react";
import { mockUsers } from "@/lib/mockData";
import { useRouter } from "next/navigation";

type CreateGroupModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreate = () => {
    if (!groupName.trim() || selectedUsers.length === 0) return;
    
    // In real app, would create group via API
    console.log("Creating group:", { name: groupName, members: selectedUsers });
    onClose();
    // Navigate to new group (mock)
    router.push("/chat/2");
  };

  const availableUsers = mockUsers.filter(u => u.id !== 'user-1');

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
            <div className="panel rounded-2xl shadow-2xl p-6 m-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
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
                <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                  {availableUsers.map((user) => {
                    const isSelected = selectedUsers.includes(user.id);
                    return (
                      <button
                        key={user.id}
                        onClick={() => toggleUser(user.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                          isSelected
                            ? "bg-sage/20 border-2 border-sage"
                            : "hover:bg-tan/10 border-2 border-transparent"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-sage flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {user.displayName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="font-semibold text-text truncate">{user.displayName}</p>
                          <p className="text-sm text-text/60 truncate">@{user.username}</p>
                        </div>
                        {isSelected && (
                          <div className="p-1 bg-sage rounded-full">
                            <Check size={16} className="text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-white/60 border border-tan/30 rounded-xl font-medium hover:bg-tan/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!groupName.trim() || selectedUsers.length === 0}
                  className="flex-1 btn-primary py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
