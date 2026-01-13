"use client";
import { useState } from "react";
import { supabase } from "@/config/supabase";


export default function ChatInput({
    chatId,
    onNewMessage,
}: {
    chatId: string;
    onNewMessage: (msg: any) => void;
}) {
    const [text, setText] = useState("");

    const sendMessage = async () => {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user || !text.trim()) return;

        const { data, error } = await supabase
            .from("messages")
            .insert({
                chat_id: chatId,
                sender_id: user.id,
                content: text,
            })
            .select()
            .single();

        if (error) return;

        // ✅ ADD MESSAGE LOCALLY FOR SENDER
        onNewMessage(data);

        // 🔔 Broadcast for others
        await supabase.channel(`chat:${chatId}`).send({
            type: "broadcast",
            event: "new_message",
            payload: data,
        });

        setText("");
    };

    return (
        
        <div style={{ display: "flex", padding: 10 }}>
            <input
                style={{ flex: 1, padding: 10 }}
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button onClick={sendMessage} style={{ marginLeft: 10 }}>
                Send
            </button>
        </div>
    );
}