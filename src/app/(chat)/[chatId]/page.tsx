"use client";
import { useParams } from 'next/navigation';
import ChatInput from '@/components/ChatInput';
import MessageList from '@/components/MessageList';


export default function ChatRoomPage() {
    const params = useParams();
    const chatId = params.chatId as string;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <MessageList chatId={chatId} />
            <ChatInput chatId={chatId} />
        </div>
    );
}