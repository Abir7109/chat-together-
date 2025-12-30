import type { User, Chat, Message } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    username: 'you',
    displayName: 'You',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-2',
    username: 'alice',
    displayName: 'Alice Smith',
    bio: 'Product Designer • Coffee lover ☕',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'user-3',
    username: 'bob',
    displayName: 'Bob Johnson',
    bio: 'Software Engineer 💻',
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
  {
    id: 'user-4',
    username: 'carol',
    displayName: 'Carol Williams',
    bio: 'Marketing Manager 📈',
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
  },
  {
    id: 'user-5',
    username: 'david',
    displayName: 'David Brown',
    bio: 'DevOps Engineer 🚀',
    createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
  },
];

export const mockChats: Chat[] = [
  {
    id: '1',
    type: 'direct',
    members: ['user-1', 'user-2'],
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    e2ee: true,
  },
  {
    id: '2',
    type: 'group',
    name: 'Team Project',
    members: ['user-1', 'user-2', 'user-3', 'user-4'],
    createdBy: 'user-1',
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    e2ee: true,
  },
  {
    id: '3',
    type: 'direct',
    members: ['user-1', 'user-3'],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    e2ee: true,
  },
  {
    id: '4',
    type: 'group',
    name: 'Design Team',
    members: ['user-1', 'user-2', 'user-4'],
    createdBy: 'user-2',
    createdAt: new Date(Date.now() - 86400000 * 21).toISOString(),
    e2ee: true,
  },
  {
    id: '5',
    type: 'direct',
    members: ['user-1', 'user-5'],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    e2ee: true,
  },
];

export const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'msg-1',
      chatId: '1',
      authorId: 'user-2',
      content: 'Hey! How are you doing? 👋',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'msg-2',
      chatId: '1',
      authorId: 'user-1',
      content: 'Hey Alice! I\'m good, thanks! Just working on the new chat app.',
      createdAt: new Date(Date.now() - 6600000).toISOString(),
    },
    {
      id: 'msg-3',
      chatId: '1',
      authorId: 'user-2',
      content: 'That sounds exciting! What technologies are you using?',
      createdAt: new Date(Date.now() - 6000000).toISOString(),
    },
    {
      id: 'msg-4',
      chatId: '1',
      authorId: 'user-1',
      content: 'Next.js 14, TypeScript, Tailwind CSS, and Framer Motion for animations. The UI looks amazing! 🎨',
      createdAt: new Date(Date.now() - 5400000).toISOString(),
    },
    {
      id: 'msg-5',
      chatId: '1',
      authorId: 'user-2',
      content: 'Nice stack! Can\'t wait to see it. Are you adding E2EE?',
      createdAt: new Date(Date.now() - 4800000).toISOString(),
    },
    {
      id: 'msg-6',
      chatId: '1',
      authorId: 'user-1',
      content: 'Yes! End-to-end encryption is planned for the next phase. Security first! 🔒',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      reactions: [{ emoji: '🔥', userId: 'user-2' }],
    },
  ],
  '2': [
    {
      id: 'msg-7',
      chatId: '2',
      authorId: 'user-2',
      content: 'Good morning team! 🌅',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'msg-8',
      chatId: '2',
      authorId: 'user-3',
      content: 'Morning! Ready for the standup?',
      createdAt: new Date(Date.now() - 3000000).toISOString(),
    },
    {
      id: 'msg-9',
      chatId: '2',
      authorId: 'user-4',
      content: 'I\'ll join in 5 minutes',
      createdAt: new Date(Date.now() - 2400000).toISOString(),
    },
    {
      id: 'msg-10',
      chatId: '2',
      authorId: 'user-1',
      content: 'Let\'s meet in the usual room',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      reactions: [
        { emoji: '👍', userId: 'user-2' },
        { emoji: '👍', userId: 'user-3' },
      ],
    },
  ],
  '3': [
    {
      id: 'msg-11',
      chatId: '3',
      authorId: 'user-3',
      content: 'Did you see the latest PR?',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: 'msg-12',
      chatId: '3',
      authorId: 'user-1',
      content: 'Yeah, looks good! Just left some comments.',
      createdAt: new Date(Date.now() - 1200000).toISOString(),
    },
  ],
  '4': [
    {
      id: 'msg-13',
      chatId: '4',
      authorId: 'user-2',
      content: 'New designs are ready for review! 🎨',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'msg-14',
      chatId: '4',
      authorId: 'user-4',
      content: 'They look amazing! Love the color palette.',
      createdAt: new Date(Date.now() - 6000000).toISOString(),
      reactions: [{ emoji: '❤️', userId: 'user-2' }],
    },
  ],
  '5': [
    {
      id: 'msg-15',
      chatId: '5',
      authorId: 'user-5',
      content: 'Hey! Can you help me with the deployment?',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: 'msg-16',
      chatId: '5',
      authorId: 'user-1',
      content: 'Sure! What\'s the issue?',
      createdAt: new Date(Date.now() - 1200000).toISOString(),
    },
    {
      id: 'msg-17',
      chatId: '5',
      authorId: 'user-5',
      content: 'The build is failing on production. Getting a weird error.',
      createdAt: new Date(Date.now() - 600000).toISOString(),
    },
  ],
};

export function getChatName(chat: Chat, users: User[], currentUserId: string): string {
  if (chat.type === 'group') {
    return chat.name || 'Group Chat';
  }
  
  const otherUserId = chat.members.find(id => id !== currentUserId);
  const otherUser = users.find(u => u.id === otherUserId);
  return otherUser?.displayName || 'Unknown User';
}

export function getLastMessage(chatId: string): Message | undefined {
  const messages = mockMessages[chatId];
  return messages?.[messages.length - 1];
}
