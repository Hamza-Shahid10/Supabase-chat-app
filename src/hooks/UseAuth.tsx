"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/config/supabase";

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<any|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login"); // redirect if no session
        return;
      }

      setUser(session.user);
      setLoading(false);
    };

    init();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        router.replace("/login");
      } else {
        setUser(session.user);
      }
    });

    // cleanup listener
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return { user, loading };
};
