'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/userStore';
import { authService } from '@/services/authService';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setCurrentUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error checking user:', error);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        router.push('/auth/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setCurrentUser, router]);

  return <>{children}</>;
}
