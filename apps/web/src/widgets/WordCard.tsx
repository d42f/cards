'use client';

import { useRef, useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

import { type DueWord } from '@/entities/word';
import { cn } from '@/lib/cn';
import { QUALITY_AGAIN, QUALITY_GOOD, QUALITY_KNOWN, QUALITY_PASS_THRESHOLD } from '@/lib/spaced-repetition';
import { Button } from '@/shared/components/Button';

const REVIEW_WORD = gql`
  mutation ReviewWord($wordId: ID!, $wordSetId: ID!, $quality: Int!) {
    reviewWord(wordId: $wordId, wordSetId: $wordSetId, quality: $quality) {
      id
      repetitions
    }
  }
`;

interface WordCardProps {
  className?: string;
  word: DueWord;
  onNext: (known: boolean) => void;
}

export function WordCard({ className, word, onNext }: WordCardProps) {
  const { wordSetId } = word;
  const [revealed, setRevealed] = useState(false);
  const [answer, setAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [reviewWord] = useMutation<{ reviewWord: { id: string; repetitions: number } }>(REVIEW_WORD, {
    update(cache, { data }, { variables }) {
      if (!data?.reviewWord || !variables?.wordId) return;
      cache.modify({
        id: cache.identify({ __typename: 'DueWord', id: variables.wordId }),
        fields: {
          progress: () =>
            cache.writeFragment({
              data: { __typename: 'Progress', ...data.reviewWord },
              fragment: gql`
                fragment ReviewedProgress on Progress {
                  id
                  repetitions
                }
              `,
            }) ?? null,
        },
      });
    },
  });

  const phase = revealed ? 'revealed' : word.progress === null ? 'intro' : 'typing';

  const advance = async (quality: number) => {
    await reviewWord({ variables: { wordId: word.id, wordSetId, quality } });
    onNext(quality >= QUALITY_PASS_THRESHOLD);
  };

  const markKnown = async () => {
    await reviewWord({ variables: { wordId: word.id, wordSetId, quality: QUALITY_KNOWN } });
    onNext(true);
  };

  const check = () => {
    const correct = answer.trim().toLowerCase() === word.word.trim().toLowerCase();
    if (correct) {
      setRevealed(true);
    } else {
      setAttempts(a => a + 1);
    }
    setIsCorrect(correct);
  };

  const showAnswer = () => {
    setAttempts(a => a + 1);
    setIsCorrect(null);
    setRevealed(true);
  };

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="bg-neutral-light border-neutral-deep rounded-3xl border p-10 shadow-sm">
        {phase === 'typing' && (
          <div className="mb-6 flex justify-end">
            <span className="text-neutral-black text-xs font-semibold tracking-widest uppercase">
              Attempts: {attempts}
            </span>
          </div>
        )}

        {phase === 'intro' && (
          <div className="space-y-6 text-center">
            <div>
              <div className="text-neutral mb-2 font-serif text-5xl leading-tight font-normal italic">{word.word}</div>
              {word.transcription && <div className="text-neutral-black text-sm italic">{word.transcription}</div>}
            </div>
            <div className="border-neutral-deep border-t pt-5">
              <div className="text-neutral-coal text-lg">{word.translation}</div>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <Button onClick={markKnown}>I know this word</Button>
              <Button
                variant="ghost"
                onClick={async () => {
                  await reviewWord({ variables: { wordId: word.id, wordSetId, quality: QUALITY_AGAIN } });
                  setTimeout(() => inputRef.current?.focus(), 0);
                }}
              >
                Train this word
              </Button>
            </div>
          </div>
        )}

        {phase === 'typing' && (
          <>
            <div className="mb-8 text-center">
              <div className="text-neutral font-serif text-5xl leading-tight font-normal italic">
                {word.translation}
              </div>
            </div>
            <div className="space-y-4">
              <input
                ref={inputRef}
                autoFocus
                type="text"
                value={answer}
                onChange={e => {
                  setAnswer(e.target.value);
                  if (isCorrect === false) setIsCorrect(null);
                }}
                onKeyDown={e => e.key === 'Enter' && answer.trim() && check()}
                placeholder="Type the word..."
                className={cn(
                  'w-full rounded-full border px-5 py-3 text-center text-sm transition outline-none',
                  isCorrect === false
                    ? 'border-red bg-red-light text-red placeholder:text-red/50'
                    : 'border-neutral-deep bg-neutral-dark text-neutral placeholder:text-neutral-black focus:border-sage',
                )}
              />
              <div className="flex justify-center gap-3">
                <Button onClick={check} disabled={!answer.trim()}>
                  Check →
                </Button>
                <Button variant="ghost" onClick={showAnswer}>
                  Show Answer
                </Button>
              </div>
            </div>
          </>
        )}

        {phase === 'revealed' && (
          <div className="space-y-4 text-center">
            {isCorrect === true && (
              <div className="text-sage text-xs font-semibold tracking-widest uppercase">Correct!</div>
            )}
            <div className="text-neutral-coal text-lg">{word.word}</div>
            {word.transcription && <div className="text-neutral-black text-sm italic">{word.transcription}</div>}
            <div className="flex justify-center gap-3 pt-2">
              <Button onClick={() => advance(QUALITY_GOOD)}>Got it</Button>
              <Button variant="ghost" onClick={() => advance(QUALITY_AGAIN)}>
                Need practice
              </Button>
              <Button variant="ghost" onClick={markKnown}>
                I know this
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
