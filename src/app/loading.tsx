export default function FeedLoading() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="h-8 w-56 animate-pulse rounded bg-panel" />
      <div className="mt-8 flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-card bg-panel" />
        ))}
      </div>
    </main>
  );
}
