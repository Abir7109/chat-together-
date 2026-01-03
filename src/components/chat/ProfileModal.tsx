"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Calendar, Shield } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useUserStore } from "@/store/userStore";

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
};

export function ProfileModal({ isOpen, onClose, userId }: ProfileModalProps) {
  const { users, currentUser } = useUserStore();
  
  const user = (currentUser?.id === userId ? currentUser : users[userId]);
  
  if (!user) return null;

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
            initial={{ opacity: 0, scale: 0.95, x: "100%" }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: "100%" }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-50"
          >
            <div className="panel h-full rounded-l-3xl shadow-2xl p-6 overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text">Profile</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-blue-1/20 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Avatar & Name */}
              <div className="text-center mb-8">
                <div className="w-32 h-32 rounded-full bg-sage flex items-center justify-center text-white text-5xl font-bold mx-auto mb-4">
                  {user.displayName.charAt(0)}
                </div>
                <h3 className="text-2xl font-bold text-text">{user.displayName}</h3>
                <p className="text-text/60">@{user.username}</p>
              </div>

              {/* Bio */}
              {user.bio && (
                <div className="mb-6 p-4 bg-tan/10 rounded-xl">
                  <p className="text-text/80">{user.bio}</p>
                </div>
              )}

              {/* Info */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-white/60 rounded-xl">
                  <Calendar className="text-sage flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-text">Joined</p>
                    <p className="text-sm text-text/60">
                      {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white/60 rounded-xl">
                  <Shield className="text-sage flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-text">Security</p>
                    <p className="text-sm text-text/60">
                      End-to-end encrypted chats
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 space-y-3">
                <button className="w-full btn-primary py-3 rounded-xl font-semibold">
                  Send Message
                </button>
                <button className="w-full btn-secondary py-3 rounded-xl font-semibold">
                  Block User
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
