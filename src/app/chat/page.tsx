"use client";

import { motion } from "framer-motion";
import { MessageCircle, Users, Lock } from "lucide-react";
import { Logo } from "@/components/branding/Logo";

export default function ChatEmptyPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md text-center space-y-6"
      >
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-text">Chat Together</h2>
          <p className="text-text/60 text-lg">
            Select a conversation to start messaging
          </p>
        </div>

        <div className="grid gap-4 pt-4">
          <div className="panel rounded-xl p-4 text-left">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-sage/20 rounded-lg">
                <MessageCircle className="text-sage" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-text mb-1">Direct Messages</h3>
                <p className="text-sm text-text/60">
                  Start private conversations with your contacts
                </p>
              </div>
            </div>
          </div>

          <div className="panel rounded-xl p-4 text-left">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-sage/20 rounded-lg">
                <Users className="text-sage" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-text mb-1">Group Chats</h3>
                <p className="text-sm text-text/60">
                  Create groups and collaborate with teams
                </p>
              </div>
            </div>
          </div>

          <div className="panel rounded-xl p-4 text-left">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-sage/20 rounded-lg">
                <Lock className="text-sage" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-text mb-1">Encrypted</h3>
                <p className="text-sm text-text/60">
                  All messages are end-to-end encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
