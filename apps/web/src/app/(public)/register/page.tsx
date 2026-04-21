'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { FormInput } from '@/shared/components/FormInput';
import { Link } from '@/shared/components/Link';
import { Logo } from '@/shared/components/Logo';
import { Role } from '@/types/prisma';

const REGISTER = gql`
  mutation Register($email: String!, $password: String!, $name: String!, $role: Role) {
    register(email: $email, password: $password, name: $name, role: $role) {
      id
      email
    }
  }
`;

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export default function RegisterPage() {
  const router = useRouter();
  const [register] = useMutation(REGISTER);
  const {
    register: field,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ defaultValues: { role: Role.STUDENT } });

  async function onSubmit(data: RegisterFormValues) {
    try {
      await register({ variables: data });
      router.push('/login');
    } catch (err: unknown) {
      setError('root', {
        message: err instanceof Error ? err.message : 'Registration failed',
      });
    }
  }

  return (
    <Card className="flex w-full max-w-md flex-col gap-4">
      <Logo className="mx-auto h-12 p-3 shadow-sm" />
      <h1 className="text-center font-serif text-4xl italic">Create your archive</h1>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormInput
          type="text"
          label="Name"
          placeholder="Enter your email"
          error={errors.name?.message}
          {...field('name', { required: 'Name is required' })}
        />
        <FormInput
          type="email"
          label="Email"
          placeholder="Enter your name"
          error={errors.email?.message}
          {...field('email', { required: 'Email is required' })}
        />
        <FormInput
          type="password"
          label="Password"
          placeholder="Enter your password"
          error={errors.password?.message ?? errors.root?.message}
          {...field('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Minimum 6 characters' },
          })}
        />
        <Button className="w-full" type="submit" disabled={isSubmitting}>
          Create account
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <p className="text-center text-sm">
        Already have an account? <Link href="/login">Sign in</Link>
      </p>
    </Card>
  );
}
