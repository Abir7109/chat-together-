"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Chrome } from "lucide-react";
import { authService } from "@/services/authService";
import { useToastStore } from "@/components/ui/Toast";
import { Logo } from "@/components/branding/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToastStore();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.signIn(email, password);
      router.push("/chat");
    } catch (error: any) {
      addToast(error.message || "Failed to login", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google login with Supabase
    addToast("Google login not implemented yet", "info");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="panel rounded-3xl p-8 shadow-xl">
          {/* Logo & Title */}
          <div className="flex flex-col items-center mb-8">
            <Logo size="lg" />
            <h1 className="text-3xl font-bold text-text mt-4">Welcome Back</h1>
            <p className="text-text/60 mt-2">Sign in to continue to Chat Together</p>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-tan/30 text-text px-6 py-3 rounded-xl font-medium hover:bg-tan/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            <Chrome size={20} />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-tan/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-beige text-text/60">Or continue with email</span>
            </div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
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
                  className="w-full pl-10 pr-4 py-3 bg-white/60 border border-tan/30 rounded-xl focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all"
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
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white/60 border border-blue-1/30 rounded-xl focus:outline-none focus:border-blue-2 focus:ring-2 focus:ring-blue-2/20 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-blue-1" />
                <span className="text-text/70">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-blue-2 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-text/70 mt-6">
            Don't have an account?{" "}
              <Link href="/auth/register" className="text-sage font-medium hover:underline">
              Sign up
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
