import { cn } from '@/lib/cn';

interface Props {
  className?: string;
  totalWords: number;
  studiedWords: number;
}

export function UserProgress({ className, totalWords, studiedWords }: Props) {
  const sections = [
    { value: totalWords, label: 'total cards' },
    { value: studiedWords, label: 'studied' },
  ];

  return (
    <div className={cn('space-y-4 rounded-xl bg-white p-8 text-sm shadow', className)}>
      <h1 className="text-2xl font-bold">Your progress</h1>
      <div className="flex gap-4">
        {sections.map((section, index) => (
          <div key={index} className="flex-1 rounded-lg bg-gray-50 p-4 text-center">
            <div className="text-3xl font-bold">{section.value}</div>
            <div className="mt-1 text-gray-500">{section.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
