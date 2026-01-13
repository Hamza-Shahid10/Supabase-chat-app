'use client';
import ChatSidebar from '@/components/ChatSidebar';
import Navbar from '@/components/Navbar';
import { ReactNode } from 'react';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/hooks/UseAuth';

export default function ChatLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "grid", placeItems: "center" }}>
        Loading...
      </div>
    );
  }

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
