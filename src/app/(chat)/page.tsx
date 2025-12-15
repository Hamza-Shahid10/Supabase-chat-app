"use client";
import { useEffect, useState } from "react";
import { supabase, getUser } from "@/config/supabase";
import { useRouter } from "next/navigation";

export default function ChatHomePage() {
  const [chats, setChats] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    let userId: string;

    const loadChats = async () => {
      const user = await getUser();
      if (!user) {
        router.replace("/login");
        return;
      }

      userId = user.id;

      const { data, error } = await supabase
        .from("chat_participants")
        .select("chat_id")
        .eq("user_id", user.id);

      if (!error) setChats(data || []);
    };

    loadChats();

    // ✅ OPTIONAL: realtime for NEW chats
    const channel = supabase
      .channel("chat-list")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_participants",
        },
        (payload) => {
          if (payload.new.user_id === userId) {
            setChats((prev) => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return (
    <div style={{ padding: 20 }}>
      <h1>All Conversations</h1>

      {chats.length === 0 && <p>No chats yet</p>}

      {chats.map((c) => (
        <div
          key={c.chat_id}
          style={{ marginTop: 10, cursor: "pointer" }}
          onClick={() => router.push(`/chat/${c.chat_id}`)}
        >
          Chat {c.chat_id.slice(0, 6)}
        </div>
      ))}
    </div>
  );
}
