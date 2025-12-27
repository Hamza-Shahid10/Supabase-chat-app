import { supabase } from "@/config/supabase";

export const startChat = async (otherUserId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  // 1️⃣ Check if chat already exists
  const { data: existing } = await supabase
    .from("chat_participants")
    .select("chat_id")
    .eq("user_id", user.id);

  if (existing) {
    for (const row of existing) {
      const { data: match } = await supabase
        .from("chat_participants")
        .select("*")
        .eq("chat_id", row.chat_id)
        .eq("user_id", otherUserId)
        .single();

      if (match) return row.chat_id;
    }
  }

  // 2️⃣ Create new chat
  const { data: chat } = await supabase
    .from("chats")
    .insert({ chat_name: "Direct Chat" })
    .select()
    .single();

  // 3️⃣ Add participants
  await supabase.from("chat_participants").insert([
    { chat_id: chat.id, user_id: user.id },
    { chat_id: chat.id, user_id: otherUserId },
  ]);

  return chat.id;
};
