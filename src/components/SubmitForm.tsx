"use client";

import { useActionState, useRef } from "react";
import { submitProduct, type SubmitFormState } from "@/app/actions";
import { TaglineSuggester } from "@/components/TaglineSuggester";

const initialState: SubmitFormState = {};

export function SubmitForm() {
  const [state, formAction, isPending] = useActionState(
    submitProduct,
    initialState
  );
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const taglineRef = useRef<HTMLInputElement>(null);

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-lg">
      <label className="flex flex-col gap-1 text-sm">
        Product name
        <input
          ref={nameRef}
          name="name"
          className="rounded-card border border-steel bg-panel px-3 py-2"
        />
        {state.fieldErrors?.name && (
          <span className="text-xs text-signal">{state.fieldErrors.name}</span>
        )}
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Description
        <textarea
          ref={descriptionRef}
          name="description"
          rows={4}
          className="rounded-card border border-steel bg-panel px-3 py-2"
        />
        {state.fieldErrors?.description && (
          <span className="text-xs text-signal">
            {state.fieldErrors.description}
          </span>
        )}
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Tagline
        <input
          ref={taglineRef}
          name="tagline"
          className="rounded-card border border-steel bg-panel px-3 py-2"
        />
        {state.fieldErrors?.tagline && (
          <span className="text-xs text-signal">{state.fieldErrors.tagline}</span>
        )}
      </label>

      <TaglineSuggester
        getName={() => nameRef.current?.value ?? ""}
        getDescription={() => descriptionRef.current?.value ?? ""}
        onSuggestion={(text) => {
          if (taglineRef.current) taglineRef.current.value = text;
        }}
      />

      <label className="flex flex-col gap-1 text-sm">
        Website URL
        <input
          name="websiteUrl"
          placeholder="https://"
          className="rounded-card border border-steel bg-panel px-3 py-2"
        />
        {state.fieldErrors?.websiteUrl && (
          <span className="text-xs text-signal">
            {state.fieldErrors.websiteUrl}
          </span>
        )}
      </label>

      {state.error && <span className="text-sm text-signal">{state.error}</span>}

      <button
        type="submit"
        disabled={isPending}
        className="w-fit rounded-card bg-signal px-5 py-2 font-medium text-ink disabled:opacity-60"
      >
        {isPending ? "Launching…" : "Launch it"}
      </button>
    </form>
  );
}
