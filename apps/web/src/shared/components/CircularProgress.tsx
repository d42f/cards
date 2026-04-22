export interface Props {
  className?: string;
  percent: number;
  strokeWidth?: number;
}

export function CircularProgress({ className, percent, strokeWidth = 4 }: Props) {
  const size = 100;
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const cx = size / 2;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={className}>
      <circle
        cx={cx}
        cy={cx}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-neutral-dark"
      />
      <circle
        cx={cx}
        cy={cx}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={c}
        strokeDashoffset={c * (1 - percent / 100)}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cx})`}
        className="text-sage"
      />
    </svg>
  );
}
