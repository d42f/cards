import { Card } from '@/shared/components/Card';

interface Props {
  className?: string;
  totalWords: number;
  studiedWords: number;
}

export function StudentProgress({ className, totalWords, studiedWords }: Props) {
  const sections = [
    { value: totalWords, label: 'total cards' },
    { value: studiedWords, label: 'studied' },
  ];

  return (
    <Card className={className}>
      <div className="flex gap-4">
        {sections.map((section, index) => (
          <div key={index} className="flex-1 rounded-lg bg-gray-50 p-4 text-center">
            <div className="text-3xl font-bold">{section.value}</div>
            <div className="mt-1 text-gray-500">{section.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
