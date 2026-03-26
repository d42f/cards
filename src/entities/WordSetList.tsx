'use client';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import { useCreateWordSetDialog } from '@/entities/CreateWordSetDialog';
import { WordSet } from '@/entities/WordSet';
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
    <>
      <Card
        className={className}
        title="Word sets"
        action={
          <Button variant="secondary" size="small" onClick={show}>
            + New
          </Button>
        }
      >
        {loading && <div className="text-gray-400">Loading…</div>}
        {!loading && data?.wordSets.length === 0 && <div className="text-gray-500">No word sets yet</div>}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data?.wordSets.map(ws => (
            <WordSet key={ws.id} id={ws.id} title={ws.title} wordCount={ws.words.length} />
          ))}
        </div>
      </Card>
      {render()}
    </>
  );
}
