export const INITIAL_EASE_FACTOR = 2.5;
export const QUALITY_GOOD = 4;
export const QUALITY_AGAIN = 1;
export const QUALITY_PASS_THRESHOLD = 3;
const MIN_EASE_FACTOR = 1.3;
const MAX_QUALITY = 5;
const EASE_FACTOR_BASE_BONUS = 0.1;
const EASE_FACTOR_PENALTY_A = 0.08;
const EASE_FACTOR_PENALTY_B = 0.02;
const FIRST_INTERVAL = 1;
const SECOND_INTERVAL = 6;

export function sm2(
  prev: { easeFactor: number; interval: number; repetitions: number },
  quality: number,
): { easeFactor: number; interval: number; repetitions: number } {
  const delta = MAX_QUALITY - quality;
  const ef = Math.max(
    MIN_EASE_FACTOR,
    prev.easeFactor + EASE_FACTOR_BASE_BONUS - delta * (EASE_FACTOR_PENALTY_A + delta * EASE_FACTOR_PENALTY_B),
  );
  if (quality < 3) return { easeFactor: ef, interval: FIRST_INTERVAL, repetitions: 0 };
  const repetitions = prev.repetitions + 1;
  const interval =
    prev.repetitions === 0 ? FIRST_INTERVAL : prev.repetitions === 1 ? SECOND_INTERVAL : Math.round(prev.interval * ef);
  return { easeFactor: ef, interval, repetitions };
}
