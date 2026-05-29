"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { isChunkLoadError, reloadForStaleChunks } from "@/lib/chunkError";

interface RouteErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function RouteError({ error, reset }: RouteErrorProps) {
  const t = useTranslations("errors");
  const chunkError = isChunkLoadError(error);

  useEffect(() => {
    console.error("[route-error]", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[40vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {chunkError ? t("chunkTitle") : t("title")}
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {chunkError ? t("chunkDescription") : t("genericDescription")}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {chunkError ? (
          <button
            type="button"
            onClick={reloadForStaleChunks}
            className="rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-indigo-700"
          >
            {t("reload")}
          </button>
        ) : (
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-indigo-700"
          >
            {t("retry")}
          </button>
        )}
      </div>
    </div>
  );
}
