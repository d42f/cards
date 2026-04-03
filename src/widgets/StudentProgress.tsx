interface Props {
  className?: string;
  totalWords: number;
  studiedWords: number;
  wordSetCount: number;
  streak: number;
}

export function StudentProgress({ className, totalWords, studiedWords, wordSetCount, streak }: Props) {
  const percent = totalWords > 0 ? Math.round((studiedWords / totalWords) * 100) : 0;

  const sections = [
    { label: 'Total cards', value: totalWords, sub: `across ${wordSetCount} deck${wordSetCount !== 1 ? 's' : ''}` },
    { label: 'Learned', value: studiedWords, sub: `${percent}% done` },
    { label: 'Streak', value: streak, sub: 'days in a row' },
  ];

  return (
    <div className={`flex gap-4 ${className ?? ''}`}>
      {sections.map(section => (
        <div key={section.label} className="flex-1 rounded-xl bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">{section.label}</div>
          <div className="mt-1 text-4xl font-bold text-gray-900">{section.value}</div>
          <div className="mt-1 text-sm text-gray-400">{section.sub}</div>
        </div>
      ))}
    </div>
  );
}
