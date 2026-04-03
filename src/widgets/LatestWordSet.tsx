import { Card } from '@/shared/components/Card';
import { WordSet } from '@/widgets/WordSet';

interface Props {
  className?: string;
  title?: string;
  wordSet: {
    id: string;
    title: string;
    words: { id: string }[];
  } | null;
}

export function LatestWordSet({ className, title = 'Latest word set', wordSet }: Props) {
  return (
    <Card className={className}>
      {wordSet ? (
        <WordSet id={wordSet.id} title={wordSet.title} wordCount={wordSet.words.length} />
      ) : (
        <div className="text-gray-500">No word sets yet</div>
      )}
    </Card>
  );
}
