"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { HiOutlineTrash } from "react-icons/hi2";
import { useEntryTypes } from "@/hooks/useEntryTypes";
import {
  addCustomEntryType,
  removeCustomEntryType,
} from "@/lib/entryTypesService";
import { CUSTOM_TYPE_COLOR_KEYS, MAX_CUSTOM_ENTRY_TYPES } from "@/types/customEntryType";
import type { CustomTypeColorKey } from "@/types/customEntryType";
import { resolveTypeBadgeClasses } from "@/lib/entryTypesService";

export function CustomEntryTypesCard() {
  const t = useTranslations("settings.customTypes");
  const tc = useTranslations("common");
  const { customTypes, reload, ready } = useEntryTypes();
  const [label, setLabel] = useState("");
  const [colorKey, setColorKey] = useState<CustomTypeColorKey>("violet");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleAdd() {
    setError(null);
    setBusy(true);
    const result = await addCustomEntryType(label, colorKey);
    setBusy(false);
    if ("error" in result) {
      setError(
        result.error === "limit"
          ? t("limitReached", { max: MAX_CUSTOM_ENTRY_TYPES })
          : t("invalidLabel")
      );
      return;
    }
    setLabel("");
    await reload();
  }

  async function handleRemove(id: string) {
    setBusy(true);
    await removeCustomEntryType(id);
    setBusy(false);
    await reload();
  }

  return (
    <section className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/80">
      <h2 className="text-start text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {t("title")}
      </h2>
      <p className="mt-1 text-start text-sm text-zinc-500 dark:text-zinc-400">
        {t("description", { max: MAX_CUSTOM_ENTRY_TYPES })}
      </p>

      <ul className="mt-4 space-y-2">
        {customTypes.map((item) => {
          const colors = resolveTypeBadgeClasses(item.id, customTypes);
          return (
            <li
              key={item.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-zinc-200/80 px-3 py-2 dark:border-zinc-700/80"
            >
              <span
                className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors.bg} ${colors.text} ${colors.border}`}
              >
                {item.label}
              </span>
              <button
                type="button"
                disabled={busy}
                onClick={() => void handleRemove(item.id)}
                className="rounded-md p-1.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-rose-600 dark:hover:bg-zinc-800"
                aria-label={tc("delete")}
              >
                <HiOutlineTrash className="h-4 w-4" />
              </button>
            </li>
          );
        })}
        {ready && customTypes.length === 0 && (
          <li className="text-start text-sm text-zinc-500 dark:text-zinc-400">
            {t("empty")}
          </li>
        )}
      </ul>

      {customTypes.length < MAX_CUSTOM_ENTRY_TYPES && (
        <div className="mt-4 space-y-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <div>
            <label
              htmlFor="custom-type-label"
              className="mb-1 block text-start text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              {t("labelField")}
            </label>
            <input
              id="custom-type-label"
              type="text"
              maxLength={32}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={t("labelPlaceholder")}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950"
            />
          </div>
          <div>
            <span className="mb-1 block text-start text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {t("colorField")}
            </span>
            <div className="flex flex-wrap gap-2">
              {CUSTOM_TYPE_COLOR_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setColorKey(key)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition ${
                    colorKey === key
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                      : "border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
                  }`}
                >
                  {t(`colors.${key}`)}
                </button>
              ))}
            </div>
          </div>
          {error && (
            <p className="text-start text-xs text-rose-600 dark:text-rose-400">
              {error}
            </p>
          )}
          <button
            type="button"
            disabled={busy || !label.trim()}
            onClick={() => void handleAdd()}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {t("addButton")}
          </button>
        </div>
      )}
    </section>
  );
}
