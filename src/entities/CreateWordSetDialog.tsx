'use client';

import { useState } from 'react';

import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

import { cn } from '@/lib/cn';
import { Button } from '@/shared/components/Button';
import { CloseButton } from '@/shared/components/CloseButton';
import { FormInput } from '@/shared/components/FormInput';
import { Input } from '@/shared/components/Input';
import { useDialog } from '@/shared/hooks/useDialog';

const CREATE_WORD_SET = gql`
  mutation CreateWordSet($title: String!) {
    createWordSet(title: $title) {
      id
    }
  }
`;

const ADD_WORD = gql`
  mutation AddWord($wordSetId: ID!, $term: String!, $definition: String!) {
    addWord(wordSetId: $wordSetId, term: $term, definition: $definition) {
      id
    }
  }
`;

interface WordRow {
  term: string;
  definition: string;
}

const emptyRow = (): WordRow => ({ term: '', definition: '' });

function CreateWordSetDialogContent({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [rows, setRows] = useState<WordRow[]>([emptyRow()]);
  const [loading, setLoading] = useState(false);

  const [createWordSet] = useMutation<{ createWordSet: { id: string } }>(CREATE_WORD_SET, {
    refetchQueries: ['WordSets'],
  });
  const [addWord] = useMutation(ADD_WORD);

  const updateRow = (index: number, field: keyof WordRow, value: string) => {
    setRows(prev => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createWordSet({ variables: { title } });
      const wordSetId = result.data?.createWordSet.id;
      if (!wordSetId) return;
      const filledRows = rows.filter(r => r.term.trim() && r.definition.trim());
      await Promise.all(
        filledRows.map(r => addWord({ variables: { wordSetId, term: r.term, definition: r.definition } })),
      );
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Title"
        placeholder="Enter word set title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_1fr_2rem] gap-3 text-sm font-medium">
          <span>Term</span>
          <span>Definition</span>
        </div>
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_2rem] items-center gap-3">
            <Input placeholder="Term" value={row.term} onChange={e => updateRow(i, 'term', e.target.value)} required />
            <Input
              placeholder="Definition"
              value={row.definition}
              onChange={e => updateRow(i, 'definition', e.target.value)}
              required
            />
            <CloseButton disabled={rows.length === 1} onClick={() => setRows(prev => prev.filter((_, j) => j !== i))} />
          </div>
        ))}
      </div>
      <Button variant="ghost" size="sm" type="button" onClick={() => setRows(prev => [...prev, emptyRow()])}>
        + Add word
      </Button>
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating…' : 'Create'}
        </Button>
        <Button variant="secondary" type="button" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function useCreateWordSetDialog() {
  const { show, hide, render } = useDialog();

  return {
    show,
    render: () =>
      render({
        className: cn('max-w-2xl'),
        dismissible: false,
        title: 'New word set',
        children: <CreateWordSetDialogContent onClose={hide} />,
      }),
  };
}
