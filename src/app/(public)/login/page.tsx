'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { FormInput } from '@/shared/components/FormInput';
import { Link } from '@/shared/components/Link';

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
    <Card className="w-full max-w-md" title="Sign in">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormInput
          size="lg"
          type="email"
          label="Email"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
        <FormInput
          size="lg"
          type="password"
          label="Password"
          error={errors.password?.message}
          {...register('password', { required: 'Password is required' })}
        />
        <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
          Sign in
        </Button>
      </form>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <p className="mt-4 text-center text-sm">
        No account? <Link href="/register">Register</Link>
      </p>
    </Card>
  );
}
