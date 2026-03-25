import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Header } from '@/components/Header';

export default async function Home() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const { name, email, role } = session.user;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow p-8 space-y-2 text-sm text-gray-700">
          <h1 className="text-2xl font-bold mb-4">Profile</h1>
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
      </main>
    </div>
  );
}
