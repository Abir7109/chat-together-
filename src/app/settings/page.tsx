"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, User, Bell, Lock, Palette, Globe, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/branding/Logo";
import { useUserStore } from "@/store/userStore";
import { authService } from "@/services/authService";

export default function SettingsPage() {
  const router = useRouter();
  const { currentUser } = useUserStore();

  const handleLogout = async () => {
    try {
      await authService.signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Fallback redirect
      router.push('/auth/login');
    }
  };

  const sections = [
    {
      title: "Account",
      icon: User,
      items: [
        { label: "Profile", description: "Edit your display name and bio" },
        { label: "Username", description: `@${currentUser?.username || 'username'}` },
        { label: "Email", description: currentUser?.email || 'email@example.com' },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      items: [
        { label: "Push notifications", description: "Get notified about new messages" },
        { label: "Message sounds", description: "Play sound for new messages" },
        { label: "Desktop notifications", description: "Show notifications on desktop" },
      ],
    },
    {
      title: "Privacy & Security",
      icon: Lock,
      items: [
        { label: "End-to-end encryption", description: "Enabled for all chats" },
        { label: "Read receipts", description: "Let others know you've read their messages" },
        { label: "Last seen", description: "Show when you were last online" },
        { label: "Blocked users", description: "Manage blocked users" },
      ],
    },
    {
      title: "Appearance",
      icon: Palette,
      items: [
        { label: "Theme", description: "Light mode" },
        { label: "Chat density", description: "Comfortable" },
        { label: "Font size", description: "Medium" },
      ],
    },
    {
      title: "Language & Region",
      icon: Globe,
      items: [
        { label: "Language", description: "English" },
        { label: "Time format", description: "12-hour" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-app p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 text-text/70 hover:text-text mb-4"
          >
            <ArrowLeft size={20} />
            Back to chats
          </Link>
          
          <div className="flex items-center gap-4">
            <Logo size="md" />
            <div>
              <h1 className="text-3xl font-bold text-text">Settings</h1>
              <p className="text-text/60">Manage your account and preferences</p>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-sage flex items-center justify-center text-white text-2xl font-bold">
              {currentUser?.displayName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-text">{currentUser?.displayName || 'User'}</h2>
              <p className="text-text/60">@{currentUser?.username || 'username'}</p>
            </div>
            <button className="btn-primary">Edit Profile</button>
          </div>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="panel rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-sage/20 rounded-lg">
                  <section.icon className="text-sage" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-text">{section.title}</h3>
              </div>

              <div className="space-y-3">
                {section.items.map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center justify-between p-3 hover:bg-tan/10 rounded-lg transition-colors text-left"
                  >
                    <div>
                      <p className="font-medium text-text">{item.label}</p>
                      <p className="text-sm text-text/60">{item.description}</p>
                    </div>
                    <div className="text-text/40">›</div>
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 panel rounded-2xl p-4 text-red-600 font-medium hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Log out
          </button>
        </motion.div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-text/50">
          <p>Chat Together v0.1.0</p>
          <p className="mt-2">
            <Link href="/terms" className="hover:underline">Terms</Link>
            {" · "}
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            {" · "}
            <Link href="/help" className="hover:underline">Help</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
