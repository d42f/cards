'use client';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import { useCreateWordSetDialog } from '@/entities/CreateWordSetDialog';
import { WordSet } from '@/entities/WordSet';
import { cn } from '@/lib/cn';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';

const WORD_SETS = gql`
  query WordSets {
    wordSets {
      id
      title
      words {
        id
      }
    }
  }
`;

export function WordSetList({ className }: { className?: string }) {
  const { data, loading } = useQuery<{ wordSets: { id: string; title: string; words: { id: string }[] }[] }>(WORD_SETS);
  const { show, render } = useCreateWordSetDialog();

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Word sets</h3>
        <Button variant="secondary" size="small" onClick={show}>
          + New
        </Button>
      </div>
      {loading && <div className="text-gray-400">Loading…</div>}
      {!loading && data?.wordSets.length === 0 ? (
        <div className="text-gray-500">No word sets yet</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.wordSets.map(ws => (
            <Card key={ws.id}>
              <WordSet key={ws.id} id={ws.id} title={ws.title} wordCount={ws.words.length} />
            </Card>
          ))}
        </div>
      )}

      {render()}
    </div>
  );
}
