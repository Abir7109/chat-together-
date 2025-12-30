"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, Chrome } from "lucide-react";
import { Logo } from "@/components/branding/Logo";

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    setLoading(true);

    // Mock registration - in real app, this would call your auth API
    setTimeout(() => {
      localStorage.setItem("user", JSON.stringify({
        id: "user-1",
        username,
        displayName,
        email,
      }));
      router.push("/chat/1");
    }, 1000);
  };

  const handleGoogleSignup = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("user", JSON.stringify({
        id: "user-1",
        username: "you",
        displayName: "You",
        email: "you@gmail.com",
      }));
      router.push("/chat/1");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="panel rounded-3xl p-8 shadow-xl">
          {/* Logo & Title */}
          <div className="flex flex-col items-center mb-8">
            <Logo size="lg" />
            <h1 className="text-3xl font-bold text-text mt-4">Create Account</h1>
            <p className="text-text/60 mt-2">Join Chat Together today</p>
          </div>

          {/* Google Signup */}
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-tan/30 text-text px-6 py-3 rounded-xl font-medium hover:bg-tan/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            <Chrome size={20} />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-blue-1/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-cream-2 text-text/60">Or sign up with email</span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-text mb-2">
                Display Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" size={18} />
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 bg-white/60 border border-blue-1/30 rounded-xl focus:outline-none focus:border-blue-2 focus:ring-2 focus:ring-blue-2/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text mb-2">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40 text-sm">@</span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  required
                  placeholder="johndoe"
                  className="w-full pl-8 pr-4 py-3 bg-white/60 border border-blue-1/30 rounded-xl focus:outline-none focus:border-blue-2 focus:ring-2 focus:ring-blue-2/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" size={18} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-white/60 border border-blue-1/30 rounded-xl focus:outline-none focus:border-blue-2 focus:ring-2 focus:ring-blue-2/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" size={18} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white/60 border border-blue-1/30 rounded-xl focus:outline-none focus:border-blue-2 focus:ring-2 focus:ring-blue-2/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" size={18} />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white/60 border border-blue-1/30 rounded-xl focus:outline-none focus:border-blue-2 focus:ring-2 focus:ring-blue-2/20 transition-all"
                />
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1 rounded border-blue-1" />
              <label className="text-sm text-text/70">
                I agree to the{" "}
                <Link href="/terms" className="text-sage hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-2 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-text/70 mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-2 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-text/50 mt-6">
          Protected by end-to-end encryption
        </p>
      </motion.div>
    </div>
  );
}
