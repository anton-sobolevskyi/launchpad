"use client";

export default function ProductError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <p className="font-mono text-sm text-signal">
        Couldn't load this launch.
      </p>
      <button
        onClick={reset}
        className="mt-3 rounded-card border border-steel px-3 py-1.5 text-sm hover:border-dim"
      >
        Try again
      </button>
    </main>
  );
}
