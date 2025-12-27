"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import { startChat } from "@/hooks/Chats";
import { useRouter } from "next/navigation";

export default function UsersList() {
  const [users, setUsers] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadUsers = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data } = await supabase
        .from("profiles")
        .select("id, name")
        .neq("id", user?.id);

      setUsers(data || []);
    };

    loadUsers();
  }, []);

  return (
    <div>
      <h3>Start Chat</h3>
      {users.map((u) => (
        <div
          key={u.id}
          style={{ cursor: "pointer", padding: 6 }}
          onClick={async () => {
            const chatId = await startChat(u.id);
            router.push(`/${chatId}`);
          }}
        >
          {u.name}
        </div>
      ))}
    </div>
  );
}
