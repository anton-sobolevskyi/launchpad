import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { callbackUrl, error } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: callbackUrl || "/",
      });
    } catch (err) {
      if (err instanceof AuthError) {
        redirect(`/auth/login?error=CredentialsSignin`);
      }
      throw err;
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <form
        action={login}
        className="flex w-full max-w-sm flex-col gap-3 rounded-card border border-steel bg-panel p-6"
      >
        <h1 className="font-display text-xl font-semibold">Log in</h1>
        <p className="text-xs text-dim">
          Demo account: alice@example.com / password123
        </p>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="rounded-card border border-steel bg-ink px-3 py-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="rounded-card border border-steel bg-ink px-3 py-2"
        />
        {error && (
          <p className="font-mono text-xs text-signal">
            Invalid email or password.
          </p>
        )}
        <button
          type="submit"
          className="rounded-card bg-signal px-4 py-2 font-medium text-ink"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
