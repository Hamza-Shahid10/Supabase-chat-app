'use client';
import ChatSidebar from '@/components/ChatSidebar';
import Navbar from '@/components/Navbar';
import { ReactNode } from 'react';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/hooks/UseAuth';

export default function ChatLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  console.log(user , "user")

  if (loading) return null;

  return (
    <>
      <Navbar logout={() => supabase.auth.signOut()} user={user} />
      <div style={{ display: 'flex', height: '100vh' }}>
        <ChatSidebar user={user} />
        <div style={{ flex: 1 }}>{children}</div>
      </div>
    </>
  );
}
