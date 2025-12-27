'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '@/hooks/validators/authValidators';
import { supabase } from '@/config/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type RegisterForm = {
  userName: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterForm>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    const avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
      data.userName || data.email
    )}`;

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          display_name: data.userName,
        },
      },
    });

    if (error) {
      setError('root', { message: error.message });
      return;
    }

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: data.userName,
          avatar_url: avatarUrl,
        });

      if (profileError) {
        setError('root', { message: profileError.message });
        return;
      }
    }

    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md w-full space-y-4"
      >
        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
          Register
        </h2>

        <div>
          <input
            {...register('userName')}
            placeholder="User Name"
            className="w-full p-2 border rounded-md dark:bg-gray-800"
          />
          {errors.userName && (
            <p className="text-red-500 text-sm">
              {errors.userName.message}
            </p>
          )}
        </div>

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
            <p className="text-red-500 text-sm">
              {errors.password.message}
            </p>
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
          {isSubmitting ? 'Creating...' : 'Create Account'}
        </button>

        <p className="text-center">
          Already have an account?{' '}
          <Link href="/login" className="hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
