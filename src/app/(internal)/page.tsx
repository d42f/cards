import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  const session = await auth();
  const userId = session!.user.id!;

  const [totalWords, studiedWords] = await Promise.all([
    prisma.word.count(),
    prisma.progress.count({ where: { userId } }),
  ]);

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow p-8 space-y-4 text-sm">
      <h1 className="text-2xl font-bold">Your progress</h1>
      <div className="flex gap-4">
        <div className="flex-1 rounded-lg bg-gray-50 p-4 text-center">
          <div className="text-3xl font-bold">{totalWords}</div>
          <div className="mt-1 text-gray-500">total cards</div>
        </div>
        <div className="flex-1 rounded-lg bg-gray-50 p-4 text-center">
          <div className="text-3xl font-bold">{studiedWords}</div>
          <div className="mt-1 text-gray-500">studied</div>
        </div>
      </div>
    </div>
  );
}
