"use client";

import { useState } from "react";

export function TaglineSuggester({
  getName,
  getDescription,
  onSuggestion,
}: {
  getName: () => string;
  getDescription: () => string;
  onSuggestion: (tagline: string) => void;
}) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggest = async () => {
    const name = getName();
    const description = getDescription();
    if (!name || description.length < 20) {
      setError("Fill in the name and a description (20+ chars) first.");
      return;
    }
    setError(null);
    setIsStreaming(true);
    onSuggestion("");

    try {
      const res = await fetch("/api/suggest-tagline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) {
        setError(await res.text());
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          onSuggestion(acc);
        }
      }
    } catch {
      setError("Couldn't reach the AI suggestion service.");
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={suggest}
        disabled={isStreaming}
        className="w-fit rounded-card border border-steel px-3 py-1.5 font-mono text-xs text-vapor hover:border-vapor disabled:opacity-60"
      >
        {isStreaming ? "generating…" : "✨ suggest tagline with AI"}
      </button>
      {error && <span className="text-xs text-signal">{error}</span>}
    </div>
  );
}
