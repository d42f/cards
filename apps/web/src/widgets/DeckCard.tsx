'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';

import { type WordSet } from '@/entities/wordSet';
import { cn } from '@/lib/cn';
import { CircularProgress } from '@/shared/components/CircularProgress';

export enum DeckCardVariant {
  Sage = 'sage',
  Terra = 'terra',
  Steel = 'steel',
  Neutral = 'neutral',
}

const VARIANT_CLASSES: Record<DeckCardVariant, string> = {
  [DeckCardVariant.Sage]: 'bg-sage-bright border-sage-light',
  [DeckCardVariant.Terra]: 'bg-terra-bright border-terra-light',
  [DeckCardVariant.Steel]: 'bg-steel-light/50 border-steel-light',
  [DeckCardVariant.Neutral]: 'bg-neutral-mid border-neutral-dark',
};

export interface DeckCardProps extends ComponentPropsWithoutRef<'div'> {
  wordSet: WordSet;
  variant?: DeckCardVariant;
}

export const DeckCard = forwardRef<HTMLDivElement, DeckCardProps>(function DeckCard(
  { wordSet, variant = DeckCardVariant.Neutral, className, ...rest },
  ref,
) {
  const { title, words, studiedCount, dueCount } = wordSet;
  const wordCount = words.length;
  const percent = wordCount > 0 ? Math.round((studiedCount / wordCount) * 100) : 0;

  return (
    <div
      ref={ref}
      className={cn(
        'cursor-pointer rounded-2xl border p-4 transition hover:opacity-90',
        VARIANT_CLASSES[variant],
        className,
      )}
      {...rest}
    >
      <div className="mb-4 flex items-start justify-between">
        <span className="text-neutral-coal text-xs font-semibold tracking-widest uppercase">{title}</span>
        {dueCount > 0 && (
          <span className="bg-sage rounded-full px-2.5 py-0.5 text-xs font-medium text-white">{dueCount} due</span>
        )}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-neutral font-medium">{title}</div>
          <div className="text-neutral-black mt-0.5 text-sm">{wordCount} entries</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <CircularProgress percent={percent} className="size-11" />
            <span className="text-neutral absolute text-[10px] font-semibold">{percent}%</span>
          </div>
          <span className="text-neutral-coal text-lg">›</span>
        </div>
      </div>
    </div>
  );
});
