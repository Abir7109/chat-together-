"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, UserPlus } from "lucide-react";
import { chatService } from "@/services/chatService";
import type { User } from "@/types";

type UserSearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (userId: string) => void;
};

export function UserSearchModal({ isOpen, onClose, onSelectUser }: UserSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const search = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const users = await chatService.searchUsers(query);
        setResults(users);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [query]);

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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-text">Start a conversation</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-blue-1/20 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" size={18} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search users..."
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 bg-white/60 border border-tan/30 rounded-xl focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20"
                />
              </div>

              {/* User List */}
              <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
                {loading ? (
                   <div className="text-center py-8 text-text/60">Searching...</div>
                ) : results.length === 0 ? (
                  <div className="text-center py-8 text-text/60">
                    {query ? "No users found" : "Type to search users"}
                  </div>
                ) : (
                  results.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        onSelectUser(user.id);
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-tan/10 rounded-xl transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-sage flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {user.displayName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text truncate">{user.displayName}</p>
                        <p className="text-sm text-text/60 truncate">@{user.username}</p>
                      </div>
                      <UserPlus size={18} className="text-sage flex-shrink-0" />
                    </button>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
