import { supabase } from '@/lib/supabase';
import type { Chat, Message, User } from '@/types';

export const chatService = {
  async getChats(): Promise<{ chat: Chat, members: User[] }[]> {
    const { data: chats, error } = await supabase
      .from('chats')
      .select(`
        *,
        members:chat_members(
          user_id,
          profile:profiles(*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return chats.map((chat: any) => {
      const members = chat.members.map((m: any) => ({
        id: m.profile.id,
        username: m.profile.username,
        displayName: m.profile.display_name,
        avatarUrl: m.profile.avatar_url,
        bio: m.profile.bio,
        createdAt: m.profile.created_at,
      }));

      return {
        chat: {
          id: chat.id,
          type: chat.type,
          name: chat.name,
          members: members.map((u: User) => u.id),
          createdAt: chat.created_at,
          createdBy: chat.created_by,
          e2ee: chat.e2ee,
        },
        members,
      };
    });
  },

  async createDirectChat(otherUserId: string): Promise<Chat> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if chat already exists
    // Note: This is a simplified check. In a real app, you'd want a more robust query
    // to find if a direct chat between these two users already exists.
    
    const { data: chat, error } = await supabase
      .from('chats')
      .insert({
        type: 'direct',
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    // Add members
    const { error: membersError } = await supabase
      .from('chat_members')
      .insert([
        { chat_id: chat.id, user_id: user.id },
        { chat_id: chat.id, user_id: otherUserId },
      ]);

    if (membersError) throw membersError;

    return {
      id: chat.id,
      type: 'direct',
      members: [user.id, otherUserId],
      createdAt: chat.created_at,
      createdBy: user.id,
      e2ee: chat.e2ee,
    };
  },

  async createGroupChat(name: string, memberIds: string[]): Promise<Chat> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: chat, error } = await supabase
      .from('chats')
      .insert({
        type: 'group',
        name,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    const members = [...memberIds, user.id];
    const { error: membersError } = await supabase
      .from('chat_members')
      .insert(members.map(id => ({
        chat_id: chat.id,
        user_id: id,
      })));

    if (membersError) throw membersError;

    return {
      id: chat.id,
      type: 'group',
      name: chat.name,
      members,
      createdAt: chat.created_at,
      createdBy: user.id,
      e2ee: chat.e2ee,
    };
  },

  async getMessages(chatId: string): Promise<Message[]> {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return messages.map((msg: any) => ({
      id: msg.id,
      chatId: msg.chat_id,
      authorId: msg.author_id,
      content: msg.content,
      replyToId: msg.reply_to_id,
      media: msg.media,
      reactions: msg.reactions,
      createdAt: msg.created_at,
    }));
  },

  async sendMessage(chatId: string, content: string, replyToId?: string, media: any[] = []): Promise<Message> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        author_id: user.id,
        content,
        reply_to_id: replyToId,
        media,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: message.id,
      chatId: message.chat_id,
      authorId: message.author_id,
      content: message.content,
      replyToId: message.reply_to_id,
      media: message.media,
      reactions: message.reactions,
      createdAt: message.created_at,
    };
  },

  async addReaction(messageId: string, emoji: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Fetch current reactions
    const { data: message, error: fetchError } = await supabase
      .from('messages')
      .select('reactions')
      .eq('id', messageId)
      .single();

    if (fetchError) throw fetchError;

    const reactions = message.reactions || [];
    // Check if already reacted
    const existing = reactions.find((r: any) => r.userId === user.id && r.emoji === emoji);
    if (existing) return;

    const newReactions = [...reactions, { emoji, userId: user.id }];

    const { error: updateError } = await supabase
      .from('messages')
      .update({ reactions: newReactions })
      .eq('id', messageId);

    if (updateError) throw updateError;
  },

  async removeReaction(messageId: string, emoji: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: message, error: fetchError } = await supabase
      .from('messages')
      .select('reactions')
      .eq('id', messageId)
      .single();

    if (fetchError) throw fetchError;

    const reactions = message.reactions || [];
    const newReactions = reactions.filter((r: any) => !(r.userId === user.id && r.emoji === emoji));

    const { error: updateError } = await supabase
      .from('messages')
      .update({ reactions: newReactions })
      .eq('id', messageId);

    if (updateError) throw updateError;
  },
  
  async searchUsers(query: string): Promise<User[]> {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('username', `%${query}%`)
      .limit(10);
      
    if (error) throw error;
    
    return profiles.map((p: any) => ({
      id: p.id,
      username: p.username,
      displayName: p.display_name,
      avatarUrl: p.avatar_url,
      bio: p.bio,
      createdAt: p.created_at,
    }));
  },

  async uploadFile(file: File): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('chat-media')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('chat-media')
      .getPublicUrl(fileName);

    return publicUrl;
  }
};
