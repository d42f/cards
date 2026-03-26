'use client';

import { SubmitEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { FormInput } from '@/shared/components/FormInput';
import { Link } from '@/shared/components/Link';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const result = await signIn('credentials', {
      email: form.get('email'),
      password: form.get('password'),
      redirect: false,
    });
    if (result?.error) {
      setError('Invalid email or password');
    } else {
      router.push('/');
      router.refresh();
    }
  }

  return (
    <Card className="w-full max-w-md" title="Sign in">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormInput name="email" type="email" label="Email" required />
        <FormInput name="password" type="password" label="Password" required error={error ?? undefined} />
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>
      <p className="text-center text-sm">
        No account? <Link href="/register">Register</Link>
      </p>
    </Card>
  );
}
