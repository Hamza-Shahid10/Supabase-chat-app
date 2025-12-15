import { supabase } from '@/config/supabase';

export const startChat = async (otherUserId: string) => {
  const { data: chat, error: chatError } = await supabase
    .from('chats')
    .insert({})
    .select()
    .single();

  if (chatError) throw chatError;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  await supabase.from('chat_participants').insert([
    { chat_id: chat.id, user_id: user.id },
    { chat_id: chat.id, user_id: otherUserId },
  ]);

  return chat.id;
};
