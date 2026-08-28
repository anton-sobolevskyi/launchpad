"use client";

import { useOptimistic, useRef, useTransition } from "react";
import { postComment } from "@/app/actions";

interface CommentItem {
  id: string;
  content: string;
  authorName: string;
}

export function CommentSection({
  productId,
  comments,
}: {
  productId: string;
  comments: CommentItem[];
}) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [optimisticComments, addOptimistic] = useOptimistic(
    comments,
    (state, newComment: CommentItem) => [newComment, ...state]
  );

  const onSubmit = (formData: FormData) => {
    const content = formData.get("content") as string;
    if (!content?.trim()) return;

    startTransition(async () => {
      addOptimistic({ id: `temp-${Date.now()}`, content, authorName: "You" });
      formRef.current?.reset();
      await postComment(productId, content);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-lg font-semibold">
        Discussion ({optimisticComments.length})
      </h2>
      <form ref={formRef} action={onSubmit} className="flex gap-2">
        <input
          name="content"
          placeholder="Ask a question or leave feedback..."
          className="flex-1 rounded-card border border-steel bg-panel px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-card bg-signal px-4 py-2 text-sm font-medium text-ink disabled:opacity-60"
        >
          Post
        </button>
      </form>
      <div className="flex flex-col gap-3">
        {optimisticComments.map((c) => (
          <div key={c.id} className="rounded-card border border-steel p-3 text-sm">
            <div className="mb-1 font-mono text-xs text-dim">{c.authorName}</div>
            {c.content}
          </div>
        ))}
        {optimisticComments.length === 0 && (
          <p className="text-sm text-dim">No comments yet — ask the maker something.</p>
        )}
      </div>
    </div>
  );
}
