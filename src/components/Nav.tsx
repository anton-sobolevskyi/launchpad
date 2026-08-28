import Link from "next/link";
import { auth, signOut } from "@/auth";

export async function Nav() {
  const session = await auth();

  return (
    <nav className="flex items-center justify-between border-b border-steel px-6 py-4">
      <Link href="/" className="font-display text-lg font-semibold text-paper">
        Launch<span className="text-signal">pad</span>
      </Link>
      <div className="flex items-center gap-5 font-mono text-sm">
        <Link href="/" className="text-dim hover:text-paper">
          feed
        </Link>
        <Link href="/search" className="text-dim hover:text-paper">
          search
        </Link>
        {session ? (
          <>
            <Link href="/submit" className="text-dim hover:text-paper">
              submit
            </Link>
            <Link href="/dashboard" className="text-dim hover:text-paper">
              dashboard
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button className="text-dim hover:text-signal">log out</button>
            </form>
          </>
        ) : (
          <Link
            href="/auth/login"
            className="rounded-card bg-signal px-3 py-1.5 text-ink"
          >
            log in
          </Link>
        )}
      </div>
    </nav>
  );
}
