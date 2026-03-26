import { auth } from '@/auth';
import { LatestWordSet } from '@/entities/LatestWordSet';
import { StudentProgress } from '@/entities/StudentProgress';
import { WordSetList } from '@/entities/WordSetList';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
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
      <StudentProgress totalWords={totalWords} studiedWords={studiedWords} />
      <LatestWordSet wordSet={latestWordSet} />
      <WordSetList className="col-span-2" />
    </div>
  );
}
