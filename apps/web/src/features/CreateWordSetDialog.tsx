'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

import { cn } from '@/lib/cn';
import { Button } from '@/shared/components/Button';
import { CloseButton } from '@/shared/components/CloseButton';
import { DialogProps } from '@/shared/components/Dialog';
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

interface FormValues {
  title: string;
  rows: WordRow[];
}

function CreateWordSetDialogContent({ onClose }: Pick<DialogProps, 'onClose'>) {
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { title: '', rows: [{ term: '', definition: '' }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'rows' });

  const [createWordSet] = useMutation<{ createWordSet: { id: string } }>(CREATE_WORD_SET, {
    refetchQueries: ['WordSets'],
  });
  const [addWord] = useMutation(ADD_WORD);

  const onSubmit = async (values: FormValues) => {
    const result = await createWordSet({ variables: { title: values.title } });
    const wordSetId = result.data?.createWordSet.id;
    if (!wordSetId) return;
    const filledRows = values.rows.filter(r => r.term.trim() && r.definition.trim());
    await Promise.all(
      filledRows.map(r =>
        addWord({
          variables: { wordSetId, term: r.term, definition: r.definition },
        }),
      ),
    );
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput label="Title" placeholder="Enter word set title" {...register('title', { required: true })} />
      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_1fr_2rem] gap-3 text-sm font-medium">
          <span>Term</span>
          <span>Definition</span>
        </div>
        {fields.map((field, i) => (
          <div key={field.id} className="grid grid-cols-[1fr_1fr_2rem] items-center gap-3">
            <Input placeholder="Term" {...register(`rows.${i}.term`, { required: true })} />
            <Input placeholder="Definition" {...register(`rows.${i}.definition`, { required: true })} />
            <CloseButton disabled={fields.length === 1} onClick={() => remove(i)} />
          </div>
        ))}
      </div>
      <Button variant="ghost" size="sm" type="button" onClick={() => append({ term: '', definition: '' })}>
        + Add word
      </Button>
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Create'}
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
        title: 'New word set',
        children: <CreateWordSetDialogContent onClose={hide} />,
      }),
  };
}
