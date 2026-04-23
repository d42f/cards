'use client';

import { useState } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';

import { QUALITY_AGAIN, QUALITY_GOOD, QUALITY_PASS_THRESHOLD } from '@/lib/spaced-repetition';
import { Button } from '@/shared/components/Button';

const GET_DUE_WORDS = gql`
  query DueWords($id: ID!) {
    wordSet(id: $id) {
      id
      title
    }
    dueWords(wordSetId: $id) {
      id
      word
      translation
    }
  }
`;

const REVIEW_WORD = gql`
  mutation ReviewWord($wordId: ID!, $wordSetId: ID!, $quality: Int!) {
    reviewWord(wordId: $wordId, wordSetId: $wordSetId, quality: $quality) {
      id
    }
  }
`;

const FINISH_SESSION = gql`
  mutation FinishSession($wordSetId: ID!, $totalWords: Int!, $knownWords: Int!) {
    finishSession(wordSetId: $wordSetId, totalWords: $totalWords, knownWords: $knownWords) {
      id
    }
  }
`;

interface Word {
  id: string;
  word: string;
  translation: string;
}

export default function TrainPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState({ known: 0, unknown: 0 });
  const [done, setDone] = useState(false);

  const { data, loading } = useQuery<{
    wordSet: { title: string };
    dueWords: Word[];
  }>(GET_DUE_WORDS, {
    variables: { id },
  });

  const [reviewWord] = useMutation(REVIEW_WORD);
  const [finishSession] = useMutation(FINISH_SESSION);

  const words = data?.dueWords ?? [];
  const word = words[currentIndex];
  const total = words.length;

  const advance = async (quality: number) => {
    await reviewWord({
      variables: { wordId: word.id, wordSetId: id, quality },
    });

    const newResults =
      quality >= QUALITY_PASS_THRESHOLD
        ? { ...results, known: results.known + 1 }
        : { ...results, unknown: results.unknown + 1 };

    setResults(newResults);

    if (currentIndex + 1 >= total) {
      await finishSession({
        variables: { wordSetId: id, totalWords: total, knownWords: newResults.known },
      });
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
        <div className="text-neutral-coal text-lg font-medium">No words due today — come back tomorrow!</div>
        <Button variant="ghost" onClick={() => router.push('/')}>
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
            <div className="text-neutral-black mt-1 text-sm">Got it</div>
          </div>
          <div>
            <div className="text-4xl font-bold">{results.unknown}</div>
            <div className="text-neutral-black mt-1 text-sm">Need practice</div>
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
        <div className="text-neutral-black mb-4 text-center text-sm">
          {currentIndex + 1} / {total}
        </div>
        <div className="bg-neutral-light border-neutral-deep mx-auto w-full max-w-lg rounded-2xl border p-10 text-center shadow-md">
          <div className="text-neutral-black mb-2 text-xs tracking-widest uppercase">Translation</div>
          <div className="text-neutral text-3xl font-bold">{word.translation}</div>
          {flipped && (
            <>
              <div className="border-neutral-deep my-6 border-t" />
              <div className="text-neutral-black mb-2 text-xs tracking-widest uppercase">Word</div>
              <div className="text-neutral-coal text-xl">{word.word}</div>
            </>
          )}
        </div>
      </div>
      <div className="flex gap-4">
        {!flipped ? (
          <Button onClick={() => setFlipped(true)}>Show answer</Button>
        ) : (
          <>
            <Button onClick={() => advance(QUALITY_GOOD)}>Got it</Button>
            <Button variant="ghost" onClick={() => advance(QUALITY_AGAIN)}>
              Need practice
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
