import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { Composer } from "@/components/chat/Composer";

export default function ChatPage({ params }: { params: { chatId: string } }) {
  return (
    <div className="flex flex-col h-full">
      <ChatHeader chatId={params.chatId} />
      <MessageList chatId={params.chatId} />
      <Composer chatId={params.chatId} />
    </div>
  );
}
