import { auth } from '@/auth';
import { formatDate, greeting } from '@/lib/date';
import { MyDecks } from '@/widgets/MyDecks';
import { MyStats } from '@/widgets/MyStats';

export default async function DashboardPage() {
  const session = await auth();
  const name = session?.user?.name ?? '';

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 flex flex-col gap-8">
        <div>
          <p className="text-neutral-black text-xs font-semibold tracking-widest uppercase">Today&apos;s focus</p>
          <h1 className="text-neutral mt-1 font-serif text-4xl font-bold italic">
            {name ? `${greeting(name)}.` : ' '}
          </h1>
          <p className="text-neutral-coal mt-1 text-sm">{formatDate(new Date())}</p>
        </div>

        <MyDecks />
      </div>

      <MyStats />
    </div>
  );
}
