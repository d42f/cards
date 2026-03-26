'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/shared/components/Button';

export interface WordSetProps {
  id: string;
  title: string;
  wordCount: number;
}

export function WordSet({ id, title, wordCount }: WordSetProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-gray-500">{wordCount} words</div>
      </div>
      <Button variant="secondary" size="small" onClick={() => router.push(`/train/${id}`)}>
        Train
      </Button>
    </div>
  );
}
