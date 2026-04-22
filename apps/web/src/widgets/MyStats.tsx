'use client';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import { CircularProgress } from '@/shared/components/CircularProgress';

const STATS = gql`
  query DashboardStats {
    me {
      dailyGoal
    }
    myStats {
      totalWords
      streak
      todayCount
      weekActivity
    }
  }
`;

interface StatsData {
  me: { dailyGoal: number } | null;
  myStats: {
    totalWords: number;
    streak: number;
    todayCount: number;
    weekActivity: boolean[];
  };
}

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function DailyGoalCircle({ done, goal }: { done: number; goal: number }) {
  const percent = Math.min(100, goal > 0 ? Math.round((done / goal) * 100) : 0);

  return (
    <div className="bg-neutral-light flex flex-col gap-3 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative flex shrink-0 items-center justify-center">
          <CircularProgress percent={percent} strokeWidth={6} className="size-22" />
          <span className="text-neutral absolute text-base font-bold">{percent}%</span>
        </div>
        <div>
          <div className="text-neutral font-semibold">Daily goal: {percent}%</div>
          <div className="text-neutral-coal mt-0.5 text-sm">
            {done} of {goal} cards reviewed
          </div>
          <div className="text-neutral-black mt-0.5 text-sm">{Math.max(0, goal - done)} remaining today</div>
        </div>
      </div>
    </div>
  );
}

function ThisWeek({ weekActivity }: { weekActivity: boolean[] }) {
  return (
    <div className="bg-neutral-light flex flex-col gap-3 rounded-2xl p-5 shadow-sm">
      <div className="text-neutral-black text-xs font-semibold tracking-widest uppercase">This week</div>
      <div className="flex justify-between">
        {WEEK_DAYS.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <span className="text-neutral-black text-xs">{day}</span>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                weekActivity[i] ? 'bg-sage text-white' : 'bg-neutral-mid text-neutral-deep'
              }`}
            >
              {weekActivity[i] ? '✓' : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Statistics({ totalCards, streak }: { totalCards: number; streak: number }) {
  return (
    <div className="bg-neutral-light flex flex-col gap-2 rounded-2xl p-5 shadow-sm">
      <div className="text-neutral-black text-xs font-semibold tracking-widest uppercase">Statistics</div>
      <div className="border-neutral-dark flex items-center justify-between border-b py-3">
        <span className="text-neutral-coal text-sm">Total cards</span>
        <span className="text-neutral font-semibold">{totalCards}</span>
      </div>
      <div className="flex items-center justify-between py-2">
        <span className="text-neutral-coal text-sm">Day streak</span>
        <span className="text-neutral font-semibold">{streak}</span>
      </div>
    </div>
  );
}

export function MyStats() {
  const { data } = useQuery<StatsData>(STATS);

  const dailyGoal = data?.me?.dailyGoal ?? 20;
  const stats = data?.myStats;

  return (
    <div className="flex flex-col gap-4">
      <DailyGoalCircle done={stats?.todayCount ?? 0} goal={dailyGoal} />
      <ThisWeek weekActivity={stats?.weekActivity ?? Array(7).fill(false)} />
      <Statistics totalCards={stats?.totalWords ?? 0} streak={stats?.streak ?? 0} />
    </div>
  );
}
