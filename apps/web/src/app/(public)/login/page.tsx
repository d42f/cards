'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { FormInput } from '@/shared/components/FormInput';
import { Link } from '@/shared/components/Link';
import { Logo } from '@/shared/components/Logo';

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  async function onSubmit(data: LoginFormValues) {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (result?.error) {
      setError('password', { message: 'Invalid email or password' });
    } else {
      router.push('/');
      router.refresh();
    }
  }

  return (
    <Card className="flex w-full max-w-md flex-col gap-4">
      <Logo className="mx-auto h-12 p-3 shadow-sm" />
      <h1 className="text-center font-serif text-4xl italic">Sign in to Cards</h1>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormInput
          type="email"
          label="Email"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
        <FormInput
          type="password"
          label="Password"
          error={errors.password?.message}
          {...register('password', { required: 'Password is required' })}
        />
        <Button className="w-full" type="submit" disabled={isSubmitting}>
          Sign in
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <p className="text-center text-sm">
        No account? <Link href="/register">Register</Link>
      </p>
    </Card>
  );
}
