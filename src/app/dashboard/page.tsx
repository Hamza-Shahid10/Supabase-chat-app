'use client';
import { useEffect, useState } from 'react';
import { getUser, supabase } from '@/config/supabase';
import { useRouter } from 'next/navigation';


export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser();
            if (!user) return router.push('/login');
            setUser(user)
        }
        fetchUser();
    }, []);

    const logout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <div style={{ padding: 40 }} className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <div className="max-w-md w-full space-y-8">
                <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
                {user && <p>Welcome, {user.email}</p>}
                <button onClick={logout} className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">Logout</button>
            </div>
        </div>
    );
}