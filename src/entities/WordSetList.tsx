'use client';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import { useCreateWordSetDialog } from '@/entities/CreateWordSetDialog';
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

interface WordSet {
  id: string;
  title: string;
  words: { id: string }[];
}

export function WordSetList({ className }: { className?: string }) {
  const { data, loading } = useQuery<{ wordSets: WordSet[] }>(WORD_SETS);
  const { show, render } = useCreateWordSetDialog();

  return (
    <>
      <Card
        className={className}
        title="Word sets"
        action={
          <Button variant="secondary" onClick={show}>
            + New
          </Button>
        }
      >
        {loading && <div className="text-gray-400">Loading…</div>}
        {!loading && data?.wordSets.length === 0 && <div className="text-gray-500">No word sets yet</div>}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data?.wordSets.map(ws => (
            <div key={ws.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
              <span className="font-medium">{ws.title}</span>
              <span className="text-sm text-gray-500">{ws.words.length} words</span>
            </div>
          ))}
        </div>
      </Card>
      {render()}
    </>
  );
}
