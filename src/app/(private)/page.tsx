import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { LatestWordSet } from '@/widgets/LatestWordSet';
import { StudentProgress } from '@/widgets/StudentProgress';
import { WordSetList } from '@/widgets/WordSetList';

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id!;

  const [totalWords, studiedWords, lastTrainedProgress, lastAddedWordSet] = await Promise.all([
    prisma.word.count(),
    prisma.progress.count({ where: { userId } }),
    prisma.progress.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: { wordSet: { include: { words: { select: { id: true } } } } },
    }),
    prisma.wordSet.findFirst({
      orderBy: { createdAt: 'desc' },
      include: { words: { select: { id: true } } },
    }),
  ]);

  const latestWordSet = lastTrainedProgress?.wordSet ?? lastAddedWordSet;
  const latestWordSetTitle = lastTrainedProgress ? 'Last trained set' : 'Latest word set';

  return (
    <div className="grid grid-cols-2 gap-8">
      <StudentProgress totalWords={totalWords} studiedWords={studiedWords} />
      <LatestWordSet title={latestWordSetTitle} wordSet={latestWordSet} />
      <WordSetList className="col-span-2" />
    </div>
  );
}
