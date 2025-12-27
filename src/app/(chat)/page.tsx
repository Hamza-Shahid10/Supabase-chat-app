"use client";
import { useEffect, useState } from "react";
import { supabase, getUser } from "@/config/supabase";
import { useRouter } from "next/navigation";

export default function ChatHomePage() {
  const [chats, setChats] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    let userId: string;

    const fetchUser = async () => {
      const user = await getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      userId = user.id;
    };

    fetchUser();

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
      <h1>Click on the left to open to chat.
        or Click here to Start a New Chat </h1>
    </div>
  );
}
