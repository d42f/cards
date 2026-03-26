import { WordSet } from '@/entities/WordSet';
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
        <WordSet id={wordSet.id} title={wordSet.title} wordCount={wordSet.words.length} />
      ) : (
        <div className="text-gray-500">No word sets yet</div>
      )}
    </Card>
  );
}
