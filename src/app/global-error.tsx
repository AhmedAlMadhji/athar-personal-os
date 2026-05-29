"use client";

import { tajawal } from "@/lib/fonts";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const message =
    error?.message?.includes("Loading chunk") ||
    error?.name === "ChunkLoadError"
      ? "The app was updated. Please reload the page."
      : "Something went wrong.";

  return (
    <html lang="en" className={`${tajawal.variable} ${tajawal.className}`}>
      <body className="flex min-h-screen items-center justify-center bg-zinc-50 p-6 font-sans text-zinc-900">
        <div className="max-w-md space-y-4 text-center">
          <h1 className="text-lg font-semibold">Application error</h1>
          <p className="text-sm text-zinc-600">{message}</p>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white"
            >
              Reload page
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-md border border-zinc-300 px-3.5 py-2 text-sm"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
