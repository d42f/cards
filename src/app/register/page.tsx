'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

const REGISTER = gql`
  mutation Register($email: String!, $password: String!, $name: String!, $role: Role) {
    register(email: $email, password: $password, name: $name, role: $role) {
      id
      email
    }
  }
`;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [register] = useMutation(REGISTER);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      await register({
        variables: {
          email: form.get('email'),
          password: form.get('password'),
          name: form.get('name'),
          role: form.get('role'),
        },
      });
      router.push('/login');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput name="name" type="text" label="Name" required />
          <FormInput name="email" type="email" label="Email" required />
          <FormInput name="password" type="password" label="Password" required minLength={6} />
          <FormSelect
            name="role"
            label="Role"
            options={[
              { value: 'STUDENT', label: 'Student' },
              { value: 'TEACHER', label: 'Teacher' },
            ]}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full">
            Create account
          </Button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
