'use client';

import { useState } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';

import { Button } from '@/shared/components/Button';

const GET_WORD_SET = gql`
  query TrainWordSet($id: ID!) {
    wordSet(id: $id) {
      id
      title
      words {
        id
        term
        definition
      }
    }
  }
`;

const UPDATE_PROGRESS = gql`
  mutation UpdateProgress($wordId: ID!, $wordSetId: ID!, $score: Int!) {
    updateProgress(wordId: $wordId, wordSetId: $wordSetId, score: $score) {
      id
    }
  }
`;

interface Word {
  id: string;
  term: string;
  definition: string;
}

export default function TrainPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState({ known: 0, unknown: 0 });
  const [done, setDone] = useState(false);

  const { data, loading } = useQuery<{
    wordSet: { title: string; words: Word[] };
  }>(GET_WORD_SET, {
    variables: { id },
  });

  const [updateProgress] = useMutation(UPDATE_PROGRESS);

  const words = data?.wordSet?.words ?? [];
  const word = words[currentIndex];
  const total = words.length;

  const advance = async (score: number) => {
    await updateProgress({
      variables: { wordId: word.id, wordSetId: id, score },
    });

    const newResults =
      score >= 3 ? { ...results, known: results.known + 1 } : { ...results, unknown: results.unknown + 1 };

    setResults(newResults);

    if (currentIndex + 1 >= total) {
      setDone(true);
    } else {
      setCurrentIndex(i => i + 1);
      setFlipped(false);
    }
  };

  if (loading) {
    return <div className="m-auto flex items-center justify-center text-gray-400">Loading…</div>;
  }

  if (!loading && total === 0) {
    return (
      <div className="m-auto flex flex-col items-center justify-center gap-6">
        <div className="text-lg font-medium text-gray-700">No words in this set yet</div>
        <Button variant="secondary" onClick={() => router.push('/')}>
          Back to dashboard
        </Button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="m-auto flex flex-col items-center justify-center gap-6">
        <div className="text-2xl font-bold">Done!</div>
        <div className="flex gap-12 text-center">
          <div>
            <div className="text-4xl font-bold">{results.known}</div>
            <div className="mt-1 text-sm text-gray-500">Got it</div>
          </div>
          <div>
            <div className="text-4xl font-bold">{results.unknown}</div>
            <div className="mt-1 text-sm text-gray-500">Need practice</div>
          </div>
        </div>
        <Button onClick={() => router.push('/')}>Back to dashboard</Button>
      </div>
    );
  }

  return (
    <div className="m-auto flex w-full flex-col items-center justify-center gap-6">
      <div className="w-full">
        <div className="mb-6 text-center text-2xl font-bold">{data?.wordSet?.title}</div>
        <div className="mb-4 text-center text-sm text-gray-400">
          {currentIndex + 1} / {total}
        </div>
        <div className="mx-auto w-full max-w-lg rounded-2xl border bg-white p-10 text-center shadow-md">
          <div className="mb-2 text-xs tracking-widest text-gray-400 uppercase">Term</div>
          <div className="text-3xl font-bold">{word.term}</div>
          {flipped && (
            <>
              <div className="my-6 border-t" />
              <div className="mb-2 text-xs tracking-widest text-gray-400 uppercase">Definition</div>
              <div className="text-xl text-gray-700">{word.definition}</div>
            </>
          )}
        </div>
      </div>
      <div className="flex gap-4">
        {!flipped ? (
          <Button onClick={() => setFlipped(true)}>Show answer</Button>
        ) : (
          <>
            <Button onClick={() => advance(5)}>Got it</Button>
            <Button variant="secondary" onClick={() => advance(1)}>
              Need practice
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
