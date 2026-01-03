import { supabase } from '@/lib/supabase';
import type { User } from '@/types';

export const authService = {
  async signUp(email: string, password: string, username: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: fullName,
        },
        emailRedirectTo: typeof window !== 'undefined' 
          ? `${window.location.origin}/auth/login` 
          : undefined,
      },
    });

    if (error) throw error;

    if (data.user && !data.session) {
      // Email verification required, we can't insert profile yet (RLS)
      // The trigger should handle it on the server side
    } else if (data.user) {
      // We have a session (or RLS allows insert for own ID), try to ensure profile exists
      // This is a fallback in case the database trigger fails or hasn't run
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        username,
        display_name: fullName,
      }).select().single();

      // If error is duplicate key, it means profile already exists (trigger worked), so we ignore it
      if (profileError && profileError.code !== '23505') {
        console.warn('Manual profile creation failed:', profileError);
      }
    }

    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) return null;

    // Fetch profile
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      // If profile is missing, try to create it from user metadata
      if (profileError.code === 'PGRST116') { // Row not found
         console.log('Profile not found, attempting to create...');
         const metadata = user.user_metadata;
         const { data: newProfile, error: createError } = await supabase
           .from('profiles')
           .insert({
             id: user.id,
             username: metadata.username || user.email?.split('@')[0] || 'user',
             display_name: metadata.full_name || 'User',
             avatar_url: metadata.avatar_url,
           })
           .select()
           .single();
           
         if (createError) {
            console.error('Error creating profile:', createError);
            return null;
         }
         profile = newProfile;
      } else {
        console.error('Error fetching profile:', profileError);
        return null;
      }
    }

    return {
      id: user.id,
      username: profile.username || user.email?.split('@')[0] || 'user',
      displayName: profile.display_name || 'User',
      avatarUrl: profile.avatar_url,
      bio: profile.bio,
      createdAt: user.created_at,
    };
  },

  async updateProfile(userId: string, updates: { displayName?: string; bio?: string; avatarUrl?: string }) {
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: updates.displayName,
        bio: updates.bio,
        avatar_url: updates.avatarUrl,
      })
      .eq('id', userId);

    if (error) throw error;
  },
};
