"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";

export default function MessageList({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const loadMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at");
      console.log(chatId)
      console.log(data)
      setMessages(data || []);
    };

    loadMessages();

    const channel = supabase
      .channel(`chat-${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  return (
    <div style={{ flex: 1, padding: 10, overflowY: "auto" }}>
      {messages.map((m) => (
        <div key={m.id} style={{ marginBottom: 8 }}>
          <b>{m.sender_id.slice(0, 6)}:</b> {m.content}
        </div>
      ))}
    </div>
  );
}
