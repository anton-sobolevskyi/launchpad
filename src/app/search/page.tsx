import { Suspense } from "react";
import { SearchResults } from "./results";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="font-display text-3xl font-bold">Search</h1>
      <form className="mt-4" action="/search">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search launches..."
          className="w-full rounded-card border border-steel bg-panel px-4 py-2.5"
          autoFocus
        />
      </form>

      <div className="mt-6">
        {q ? (
          // Suspense lets the input render immediately while the DB query
          // streams in behind it, instead of blocking the whole page.
          <Suspense
            key={q}
            fallback={<p className="font-mono text-sm text-dim">Searching…</p>}
          >
            <SearchResults query={q} />
          </Suspense>
        ) : (
          <p className="text-sm text-dim">Type to search launches.</p>
        )}
      </div>
    </main>
  );
}
