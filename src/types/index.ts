export type User = {
  id: string;
  email?: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  publicKey?: string;
  createdAt: string;
};

export type Chat = {
  id: string;
  type: 'direct' | 'group';
  members: string[];
  createdBy?: string;
  name?: string;
  avatarUrl?: string;
  createdAt: string;
  pinnedMessageId?: string;
  e2ee?: boolean;
  lastMessage?: Message;
  unreadCount?: number;
};

export type Message = {
  id: string;
  chatId: string;
  authorId: string;
  content?: string;
  e2eePayload?: string;
  embeds?: Embed[];
  media?: Media[];
  replyToId?: string;
  reactions?: { emoji: string; userId: string }[];
  createdAt: string;
  editedAt?: string;
  deletedAt?: string;
};

export type Embed = {
  type: 'link' | 'image' | 'video';
  url: string;
  title?: string;
  description?: string;
  thumbnail?: string;
};

export type Media = {
  id: string;
  type: 'image' | 'video' | 'audio' | 'file';
  url: string;
  thumbnailUrl?: string;
  filename: string;
  size: number;
  mimeType: string;
};

export type Presence = {
  userId: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  lastSeenAt?: string;
};

export type Notification = {
  id: string;
  userId: string;
  type: 'message' | 'mention' | 'reaction' | 'invite';
  chatId: string;
  messageId?: string;
  read: boolean;
  createdAt: string;
};

export type TypingIndicator = {
  chatId: string;
  userId: string;
  timestamp: string;
};
