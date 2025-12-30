import Link from "next/link";
import { Logo } from "@/components/branding/Logo";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-text">Chat Together</h1>
          <p className="text-text/70 text-lg">
            Connect, communicate, collaborate
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <Link href="/auth/login" className="btn-primary block w-full">
            Sign In
          </Link>
          <Link href="/auth/register" className="btn-secondary block w-full">
            Create Account
          </Link>
        </div>

        <p className="text-sm text-text/60 pt-4">
          End-to-end encrypted • Open source • Privacy-first
        </p>
      </div>
    </main>
  );
}
