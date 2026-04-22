'use client';

import { useRouter } from 'next/navigation';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import { type WordSet } from '@/entities/wordSet';
import { useCreateWordSetDialog } from '@/features/CreateWordSetDialog';
import { Button } from '@/shared/components/Button';
import { DeckCard, DeckCardVariant } from '@/widgets/DeckCard';

const WORD_SETS = gql`
  query DeckGrid {
    wordSets {
      id
      title
      words {
        id
      }
      studiedCount
      dueCount
    }
  }
`;

const VARIANTS = Object.values(DeckCardVariant);

export function MyDecks() {
  const router = useRouter();
  const { data, loading } = useQuery<{ wordSets: WordSet[] }>(WORD_SETS);
  const { show, render } = useCreateWordSetDialog();
  const wordSets = data?.wordSets ?? [];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-neutral-black text-xs font-semibold tracking-widest uppercase">My decks</h2>
        <Button variant="ghost" size="sm" onClick={show}>
          + New deck
        </Button>
      </div>

      {loading && <div className="text-neutral-black text-sm">Loading…</div>}

      {!loading && wordSets.length === 0 && (
        <div className="border-neutral-deep text-neutral-black rounded-2xl border border-dashed py-12 text-center text-sm">
          No decks yet. Create your first one!
        </div>
      )}

      {!!wordSets.length && (
        <div className="grid grid-cols-2 gap-4">
          {wordSets.map((ws, i) => (
            <DeckCard
              key={ws.id}
              wordSet={ws}
              variant={VARIANTS[i % VARIANTS.length]}
              onClick={() => router.push(`/train/${ws.id}`)}
            />
          ))}
        </div>
      )}

      {render()}
    </div>
  );
}
