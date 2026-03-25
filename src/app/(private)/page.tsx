import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { UserProgress } from '@/entities/UserProgress';
import { LatestWordSet } from '@/entities/LatestWordSet';

export default async function Home() {
  const session = await auth();
  const userId = session!.user.id!;

  const [totalWords, studiedWords, latestWordSet] = await Promise.all([
    prisma.word.count(),
    prisma.progress.count({ where: { userId } }),
    prisma.wordSet.findFirst({
      orderBy: { createdAt: 'desc' },
      include: { words: { select: { id: true } } },
    }),
  ]);

  return (
    <div className="grid grid-cols-2 gap-8">
      <UserProgress totalWords={totalWords} studiedWords={studiedWords} />
      <LatestWordSet wordSet={latestWordSet} />
    </div>
  );
}
