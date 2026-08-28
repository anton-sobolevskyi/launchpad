"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.back();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) router.back();
      }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 py-16 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg rounded-card border border-steel bg-panel p-6 shadow-2xl">
        {children}
        <button
          onClick={() => router.back()}
          className="mt-4 font-mono text-xs text-dim hover:text-paper"
        >
          esc to close · or view full page
        </button>
      </div>
    </div>
  );
}
