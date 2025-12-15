"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import { startChat } from "@/hooks/Chats";
import { useRouter } from "next/navigation";
import Link from "next/link";


interface ChatSidebarProps {
    user: {
        email: string,
        user_metadata: {
            display_name: string
        }
    }
}

export default function ChatSidebar({ user }: ChatSidebarProps) {
    const [chats, setChats] = useState<any | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchChats = async () => {
            const { data } = await supabase
                .from("chat_participants")
                .select("chat_id")
                .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

            setChats(data || []);
        };
        fetchChats();
    }, []);

    return (
        <div style={{ width: 250, padding: 20, borderRight: "1px solid #ccc" }}>
            <h2>{user?.user_metadata?.display_name} Chats</h2>
            {chats && chats.map((c: any) => (
                <div key={c.chat_id} style={{ marginTop: 10 }}>
                    <Link href={`/chat/${c.chat_id}`}>Chat {c.chat_id.slice(0, 6)}</Link>
                </div>
            ))}
            <button
                onClick={async () => {
                    const chatId = await startChat('OTHER_USER_ID_HERE');
                    router.push(`/${chatId}`);
                }}
            >
                Start Chat
            </button>
        </div>
    );
}