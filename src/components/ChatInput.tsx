"use client";
import { useState } from "react";
import { supabase } from "@/config/supabase";


export default function ChatInput({ chatId }: { chatId: string }) {
    const [text, setText] = useState("");


    const sendMessage = async () => {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) return;

        const res = await supabase.from("messages").insert({
            chat_id: chatId,
            sender_id: user.id,
            content: text,
        });

        console.log(res);
        
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