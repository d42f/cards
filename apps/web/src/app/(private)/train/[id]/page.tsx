'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';

import ChevronLeft from '@/shared/icons/ChevronLeft.svg';

import { type DueWord } from '@/entities/word';
import { Button } from '@/shared/components/Button';
import { WordCard } from '@/widgets/WordCard';

const GET_DUE_WORDS = gql`
  query DueWords($id: ID!) {
    wordSet(id: $id) {
      id
      title
      studiedCount
      wordsCount
    }
    dueWords(wordSetId: $id) {
      id
      wordSetId
      word
      translation
      transcription
      progress {
        id
        repetitions
      }
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

export default function TrainPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState({ known: 0, unknown: 0 });
  const [done, setDone] = useState(false);

  const { data, loading } = useQuery<{
    wordSet: { title: string; studiedCount: number; wordsCount: number };
    dueWords: DueWord[];
  }>(GET_DUE_WORDS, { variables: { id } });

  const [finishSession] = useMutation(FINISH_SESSION);

  const words = (data?.dueWords ?? []) as DueWord[];
  const word = words[currentIndex];
  const total = words.length;

  const goNext = async (known: boolean) => {
    const newResults = known ? { ...results, known: results.known + 1 } : { ...results, unknown: results.unknown + 1 };
    setResults(newResults);

    const nextIndex = currentIndex + 1;
    if (nextIndex >= total) {
      await finishSession({ variables: { wordSetId: id, totalWords: total, knownWords: newResults.known } });
      setDone(true);
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  const { studiedCount = 0, wordsCount = 0 } = data?.wordSet ?? {};
  const mastery = wordsCount > 0 ? Math.round((studiedCount / wordsCount) * 100) : 0;
  const progressPercent = total > 0 ? Math.round((currentIndex / total) * 100) : 0;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8">
      <div className="flex items-center gap-4">
        {loading ? (
          <>
            <div className="bg-neutral-deep h-4 w-4 animate-pulse rounded" />
            <div className="bg-neutral-deep h-3 w-32 animate-pulse rounded-full" />
            <div className="bg-neutral-deep h-6 w-20 animate-pulse rounded-full" />
            <div className="bg-neutral-deep h-1 flex-1 animate-pulse rounded-full" />
            <div className="bg-neutral-deep h-3 w-8 animate-pulse rounded-full" />
          </>
        ) : (
          <>
            <Button className="shrink-0" variant="inline" size="inline" onClick={() => router.push('/')}>
              <ChevronLeft />
            </Button>
            <span className="text-terra shrink-0 text-xs font-semibold tracking-widest uppercase">
              {data?.wordSet?.title}
            </span>
            <span className="bg-sage-light text-sage shrink-0 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
              Mastery {mastery}%
            </span>
            <div className="bg-neutral-deep h-1 flex-1 overflow-hidden rounded-full">
              <div
                className="bg-sage h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-neutral-black shrink-0 text-xs font-semibold tabular-nums">
              {currentIndex + 1} / {total}
            </span>
          </>
        )}
      </div>

      <div className="mx-auto w-full max-w-xl">
        {loading ? (
          <></>
        ) : !word || total === 0 ? (
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="text-neutral-coal text-lg font-medium">No words due today — come back tomorrow!</div>
            <Button variant="ghost" onClick={() => router.push('/')}>
              Back to dashboard
            </Button>
          </div>
        ) : done ? (
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="text-neutral text-2xl font-semibold">Session complete</div>
            <div className="flex gap-12 text-center">
              <div>
                <div className="text-neutral text-4xl font-bold">{results.known}</div>
                <div className="text-neutral-black mt-1 text-sm">Got it</div>
              </div>
              <div>
                <div className="text-neutral text-4xl font-bold">{results.unknown}</div>
                <div className="text-neutral-black mt-1 text-sm">Need practice</div>
              </div>
            </div>
            <Button onClick={() => router.push('/')}>Back to dashboard</Button>
          </div>
        ) : (
          <WordCard key={word.id} word={word} onNext={goNext} />
        )}
      </div>
    </div>
  );
}
