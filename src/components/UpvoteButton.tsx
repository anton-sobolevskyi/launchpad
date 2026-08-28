"use client";

import { useOptimistic, useTransition } from "react";
import { toggleUpvote } from "@/app/actions";

export function UpvoteButton({
  productId,
  initialCount,
  initialUpvoted,
}: {
  productId: string;
  initialCount: number;
  initialUpvoted: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [state, setOptimistic] = useOptimistic(
    { count: initialCount, upvoted: initialUpvoted },
    (current, upvoted: boolean) => ({
      count: current.count + (upvoted ? 1 : -1),
      upvoted,
    })
  );

  const onClick = () => {
    startTransition(async () => {
      setOptimistic(!state.upvoted);
      await toggleUpvote(productId);
    });
  };

  return (
    <button
      onClick={onClick}
      disabled={isPending}
      aria-pressed={state.upvoted}
      className={`flex flex-col items-center rounded-card border px-3 py-2 font-mono text-sm transition-colors ${
        state.upvoted
          ? "border-signal bg-signal/10 text-signal"
          : "border-steel text-dim hover:border-dim hover:text-paper"
      }`}
    >
      <span aria-hidden>▲</span>
      <span>{state.count}</span>
    </button>
  );
}
