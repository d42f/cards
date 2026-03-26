import { redirect } from 'next/navigation';

import { metadata } from '@/app/layout';
import { auth } from '@/auth';
import { Header } from '@/entities/Header';

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return (
    <div className="flex min-h-screen flex-col">
      <Header title={metadata.title} />
      <main className="flex w-full flex-1 flex-col overflow-auto p-6">
        <div className="mx-auto w-full max-w-5xl flex-1">{children}</div>
      </main>
    </div>
  );
}
