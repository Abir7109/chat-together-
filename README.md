# Chat Together (CT)

A modern, secure, and beautiful chat application built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🔐 **End-to-end encryption** for secure messaging
- 💬 **Real-time messaging** with typing indicators and presence
- 👥 **Direct and group chats** with rich media support
- 🎨 **Beautiful UI** with smooth animations using Framer Motion
- 📱 **Progressive Web App** - installable on any device
- 🌐 **Multi-language support** (English & Bengali)
- 🔔 **Smart notifications** for messages, mentions, and reactions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom theme
- **Animations**: Framer Motion
- **Backend**: Supabase / Firebase (configurable)
- **State Management**: Zustand
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Supabase or Firebase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chat-together
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase or Firebase credentials.

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── chat/              # Chat pages and layout
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── branding/         # Logo and brand elements
│   └── chat/             # Chat-related components
├── types/                # TypeScript type definitions
└── lib/                  # Utilities and services (to be added)
```

## Design System

### Colors

- **Cream 1**: `#FFF8DE` - Background
- **Cream 2**: `#FFF2C6` - Panels
- **Blue 1**: `#AAC4F5` - Secondary
- **Blue 2**: `#8CA9FF` - Primary
- **Text**: `#1C1C1C` - Main text

### Components

All components follow the design system with:
- Glass-morphism panels with backdrop blur
- Smooth transitions and animations
- Consistent spacing and rounded corners
- Focus states with custom ring colors

## Roadmap

- [x] Project setup with Next.js + TypeScript
- [x] Core UI components (Sidebar, Chat, Composer)
- [x] Design system with Tailwind
- [x] Animation patterns with Framer Motion
- [ ] Authentication (Google, Email)
- [ ] Real-time messaging with WebSockets
- [ ] User search and profiles
- [ ] Group chat creation
- [ ] Reactions and replies
- [ ] E2EE implementation
- [ ] Push notifications
- [ ] Media upload and preview
- [ ] Voice/video calls
- [ ] Internationalization (i18n)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.
