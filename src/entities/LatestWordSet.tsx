import { cn } from '@/lib/cn';

interface Props {
  className?: string;
  wordSet: {
    id: string;
    title: string;
    words: { id: string }[];
  } | null;
}

export function LatestWordSet({ className, wordSet }: Props) {
  return (
    <div className={cn('space-y-4 rounded-xl bg-white p-8 text-sm shadow', className)}>
      <h2 className="text-2xl font-bold">Latest word set</h2>
      {wordSet ? (
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="font-medium">{wordSet.title}</div>
          <div className="mt-1 text-gray-500">{wordSet.words.length} words</div>
        </div>
      ) : (
        <div className="text-gray-500">No word sets yet</div>
      )}
    </div>
  );
}
