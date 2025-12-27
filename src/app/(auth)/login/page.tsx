'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@/hooks/validators/authValidators';
import { supabase } from '@/config/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type LoginForm = {
    email: string;
    password: string;
};

export default function LoginPage() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<LoginForm>({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) {
            setError('root', { message: error.message });
            return;
        }

        router.push('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-md w-full space-y-4"
            >
                <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
                    Login
                </h2>

                <div>
                    <input
                        {...register('email')}
                        placeholder="Email"
                        className="w-full p-2 border rounded-md dark:bg-gray-800"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <input
                        type="password"
                        {...register('password')}
                        placeholder="Password"
                        className="w-full p-2 border rounded-md dark:bg-gray-800"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm">{errors.password.message}</p>
                    )}
                </div>

                {errors.root && (
                    <p className="text-red-500 text-center">
                        {errors.root.message}
                    </p>
                )}

                <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white rounded-md"
                >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>

                <p className="text-center">
                    Don’t have an account?{' '}
                    <Link href="/register" className="hover:underline">
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
}
