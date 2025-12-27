"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import { startChat } from "@/hooks/Chats";
import { useRouter } from "next/navigation";
import UsersList from '@/components/UserLists';
import Link from "next/link";


interface ChatSidebarProps {
    user: {
        id: string,
        avatar_url: string,
        name: string
    }
}

export default function ChatSidebar({ user }: ChatSidebarProps) {
    const [chats, setChats] = useState<any | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchChats = async () => {
            const { data } = await supabase.from("chats").select("*")
            setChats(data || []);
        };
        fetchChats();
    }, []);

    return (
        <div style={{ width: 250, padding: 20, borderRight: "1px solid #ccc" }}>
            <h2>{user?.name} Chats</h2>
            {chats && chats.map((c: any) => (
                <div key={c.id} style={{ marginTop: 10 }}>
                    <Link href={`/${c.id}`}>{c.chat_name}</Link>
                </div>
            ))}
            
            <br />
            <UsersList />
        </div>
    );
}