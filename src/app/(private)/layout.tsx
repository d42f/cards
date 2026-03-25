import { redirect } from 'next/navigation';

import { metadata } from '@/app/layout';
import { auth } from '@/auth';
import { Header } from '@/shared/components/Header';

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return (
    <div className="min-h-screen">
      <Header title={metadata.title} />
      <main className="mx-auto max-w-5xl px-6 py-6">{children}</main>
    </div>
  );
}
