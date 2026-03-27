'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

import { Role } from '@/generated/prisma/enums';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { FormInput } from '@/shared/components/FormInput';
import { FormSelect } from '@/shared/components/FormSelect';
import { Link } from '@/shared/components/Link';

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
      setError('root', { message: err instanceof Error ? err.message : 'Registration failed' });
    }
  }

  return (
    <Card className="w-full max-w-md" title="Register">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormInput
          size="lg"
          type="text"
          label="Name"
          error={errors.name?.message}
          {...field('name', { required: 'Name is required' })}
        />
        <FormInput
          size="lg"
          type="email"
          label="Email"
          error={errors.email?.message}
          {...field('email', { required: 'Email is required' })}
        />
        <FormInput
          size="lg"
          type="password"
          label="Password"
          error={errors.password?.message ?? errors.root?.message}
          {...field('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Minimum 6 characters' },
          })}
        />
        <FormSelect
          size="lg"
          label="Role"
          options={[
            { value: Role.STUDENT, label: 'Student' },
            { value: Role.TEACHER, label: 'Teacher' },
          ]}
          {...field('role')}
        />
        <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
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
