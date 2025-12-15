'use client';
import { useState } from 'react';
import { supabase } from '@/config/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);


    const login = async () => {
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        console.log("Login response:", { error, data });
        if (error) return setError(error.message);
        router.push('/');
    };

    return (
        <div style={{ padding: 40 }} className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <div className="max-w-md w-full space-y-8">
                <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">Login</h2>
                <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                <button onClick={login} className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">Login</button>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <p className='text-center'>Already have an account <Link className='hover:underline' href='/register'> Sign In </Link></p>

            </div>
        </div>
    );
}