"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

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
          email: form.get("email"),
          password: form.get("password"),
          name: form.get("name"),
          role: form.get("role"),
        },
      });
      router.push("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold mb-6">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              name="name"
              type="text"
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              name="role"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition"
          >
            Create account
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
