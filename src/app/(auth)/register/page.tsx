'use client';
import { useState } from 'react';
import { supabase } from '@/config/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export default function RegisterPage() {
    const router = useRouter();
    const [userName, setUserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);


    const register = async () => {
        const { error, data } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    display_name: userName,
                },
            },
        });

        if (error) return setError(error.message);

        console.log("Signup response:", { error, data });
        if (data.user) {
            const { error: profileError } = await supabase.from('profiles').insert({
                id: data.user.id,
                name: userName,
                avatar_url: '', // optional
            });

            if (profileError) return setError(profileError.message);
        }
        router.push('/login');
    };

    return (
        <div style={{ padding: 40 }} className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <div className="max-w-md w-full space-y-8">
                <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">Register</h2>
                <input placeholder="User Name" onChange={(e) => setUserName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                <button onClick={register} className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">Create Account</button>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <p className='text-center'>Already have an account <Link href='/login' className='hover:underline'> Login </Link></p>
            </div>
        </div>
    );
}