export default function DashboardLayout({
  submissions,
  analytics,
  settings,
}: {
  submissions: React.ReactNode;
  analytics: React.ReactNode;
  settings: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="font-display text-3xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-dim">
        Your submissions, performance, and account — loaded independently.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <section className="md:col-span-2">{submissions}</section>
        <div className="flex flex-col gap-6">
          {analytics}
          {settings}
        </div>
      </div>
    </main>
  );
}
