import { auth } from "@/auth";

export default async function SettingsSlot() {
  const session = await auth();
  if (!session?.user) return null;

  return (
    <div className="rounded-card border border-steel bg-panel p-4">
      <h2 className="font-mono text-xs uppercase tracking-wide text-dim">
        Account
      </h2>
      <p className="mt-3 text-sm">{session.user.name}</p>
      <p className="text-xs text-dim">{session.user.email}</p>
    </div>
  );
}
