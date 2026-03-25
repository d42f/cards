'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/Button';
import { Link } from '@/shared/ui/Link';
import { FormInput } from '@/shared/ui/FormInput';
import { FormSelect } from '@/shared/ui/FormSelect';
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
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
      <h1 className="mb-6 text-2xl font-bold">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput name="name" type="text" label="Name" required />
        <FormInput name="email" type="email" label="Email" required />
        <FormInput name="password" type="password" label="Password" required minLength={6} error={error ?? undefined} />
        <FormSelect
          name="role"
          label="Role"
          options={[
            { value: 'STUDENT', label: 'Student' },
            { value: 'TEACHER', label: 'Teacher' },
          ]}
        />
        <Button type="submit" className="w-full">
          Create account
        </Button>
      </form>
      <p className="mt-4 text-center text-sm">
        Already have an account? <Link href="/login">Sign in</Link>
      </p>
    </div>
  );
}
