import { SubmitForm } from "@/components/SubmitForm";

export default function SubmitPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="font-display text-3xl font-bold">Launch a product</h1>
      <p className="mt-1 text-sm text-dim">
        It'll appear in the feed immediately, with a 24-hour live window.
      </p>
      <div className="mt-6">
        <SubmitForm />
      </div>
    </main>
  );
}
