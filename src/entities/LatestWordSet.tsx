import { Card } from '@/shared/components/Card';

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
    <Card className={className} title="Latest word set">
      {wordSet ? (
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="font-medium">{wordSet.title}</div>
          <div className="mt-1 text-gray-500">{wordSet.words.length} words</div>
        </div>
      ) : (
        <div className="text-gray-500">No word sets yet</div>
      )}
    </Card>
  );
}
