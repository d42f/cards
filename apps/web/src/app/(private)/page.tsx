'use client';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import { LatestWordSet } from '@/widgets/LatestWordSet';
import { StudentProgress } from '@/widgets/StudentProgress';
import { WordSetList } from '@/widgets/WordSetList';

const DASHBOARD = gql`
  query Dashboard {
    myStats {
      totalWords
      studiedWords
      wordSetCount
      streak
    }
    latestWordSet {
      id
      title
      words {
        id
      }
    }
  }
`;

interface DashboardData {
  myStats: {
    totalWords: number;
    studiedWords: number;
    wordSetCount: number;
    streak: number;
  };
  latestWordSet: { id: string; title: string; words: { id: string }[] } | null;
}

export default function DashboardPage() {
  const { data, loading } = useQuery<DashboardData>(DASHBOARD);

  return (
    <div className="grid grid-cols-2 gap-8">
      {!loading && (
        <>
          <StudentProgress
            className="col-span-2"
            totalWords={data?.myStats.totalWords ?? 0}
            studiedWords={data?.myStats.studiedWords ?? 0}
            wordSetCount={data?.myStats.wordSetCount ?? 0}
            streak={data?.myStats.streak ?? 0}
          />
          <LatestWordSet wordSet={data?.latestWordSet ?? null} />
          <WordSetList className="col-span-2" />
        </>
      )}
    </div>
  );
}
