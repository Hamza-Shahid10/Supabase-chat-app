"use client";
import { useParams } from "next/navigation";
import ChatInput from "@/components/ChatInput";
import MessageList from "@/components/MessageList";
import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";

export default function ChatRoomPage() {
  const params = useParams();
  const chatId = params.chatId as string;

  const [messages, setMessages] = useState<any[]>([]);

  // 🔹 Load existing messages
  useEffect(() => {
    const loadMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at");

      setMessages(data || []);
    };

    loadMessages();
  }, [chatId]);

  // 🔹 Realtime broadcast listener
  useEffect(() => {
    const channel = supabase
      .channel(`chat:${chatId}`)
      .on("broadcast", { event: "new_message" }, (payload) => {
        setMessages((prev) => [...prev, payload.payload]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  return (
    <>
      <MessageList messages={messages} />
      <ChatInput
        chatId={chatId}
        onNewMessage={(msg) =>
          setMessages((prev) => [...prev, msg])
        }
      />
    </>
  );
}
