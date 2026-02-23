import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const { name, email, role } = session.user;

  async function handleSignOut() {
    'use server';
    await signOut({ redirectTo: '/login' });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8 space-y-4">
        <h1 className="text-2xl font-bold">Profile</h1>
        <div className="space-y-2 text-sm text-gray-700">
          <div>
            <span className="font-medium">Name: </span>
            {name ?? '—'}
          </div>
          <div>
            <span className="font-medium">Email: </span>
            {email ?? '—'}
          </div>
          <div>
            <span className="font-medium">Role: </span>
            <span className="capitalize">{role?.toLowerCase() ?? '—'}</span>
          </div>
        </div>
        <button
          className="w-full bg-red-500 text-white rounded-lg py-2 font-medium hover:bg-red-600 transition"
          type="button"
          onClick={handleSignOut}
        >
          Sign out
        </button>
      </div>
    </main>
  );
}
