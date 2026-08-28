function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;
}

/**
 * A product's launch state is derived, not stored: LAUNCH_WINDOW_MS after
 * launchesAt, it moves from LIVE to LAUNCHED. This keeps the state honest
 * with the underlying timestamp instead of drifting out of sync.
 */
const LAUNCH_WINDOW_MS = 24 * 60 * 60 * 1000;

export function getLaunchState(launchesAt: Date, now: Date = new Date()) {
  const diff = now.getTime() - launchesAt.getTime();
  if (diff < 0) {
    return { status: "UPCOMING" as const, label: `T-${formatCountdown(-diff)}` };
  }
  if (diff < LAUNCH_WINDOW_MS) {
    return {
      status: "LIVE" as const,
      label: `LIVE · ${formatCountdown(LAUNCH_WINDOW_MS - diff)} left`,
    };
  }
  return { status: "LAUNCHED" as const, label: "LAUNCHED" };
}

const DOT_COLOR = {
  UPCOMING: "bg-dim",
  LIVE: "bg-signal animate-pulse-dot",
  LAUNCHED: "bg-vapor",
} as const;

const TEXT_COLOR = {
  UPCOMING: "text-dim",
  LIVE: "text-signal",
  LAUNCHED: "text-vapor",
} as const;

export function StatusStrip({ launchesAt }: { launchesAt: Date }) {
  const { status, label } = getLaunchState(launchesAt);
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs tracking-tight">
      <span className={`h-1.5 w-1.5 rounded-full ${DOT_COLOR[status]}`} />
      <span className={TEXT_COLOR[status]}>{label}</span>
    </span>
  );
}
