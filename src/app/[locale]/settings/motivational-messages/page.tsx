"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/PageHeader";
import { useConfirm } from "@/components/ui/DialogProvider";
import { Link } from "@/i18n/navigation";
import {
  createMotivationalMessage,
  deleteMotivationalMessage,
  getAllMotivationalMessages,
  toggleMessageFavorite,
  updateMotivationalMessage,
} from "@/lib/motivationalMessagesService";
import type { MotivationalMessage } from "@/types/motivationalMessage";

export default function MotivationalMessagesPage() {
  const t = useTranslations("motivationalMessages");
  const tc = useTranslations("common");
  const td = useTranslations("dialog");
  const confirm = useConfirm();
  const [messages, setMessages] = useState<MotivationalMessage[]>([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const data = await getAllMotivationalMessages();
    setMessages(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    if (editingId) {
      await updateMotivationalMessage(editingId, { text });
      setEditingId(null);
    } else {
      await createMotivationalMessage({ text });
    }

    setText("");
    await load();
  }

  function startEdit(message: MotivationalMessage) {
    setEditingId(message.id);
    setText(message.text);
  }

  function cancelEdit() {
    setEditingId(null);
    setText("");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <Link
            href="/settings"
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium dark:border-zinc-700"
          >
            {t("backToSettings")}
          </Link>
        }
      />

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="space-y-3 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/80"
      >
        <label htmlFor="message-text" className="block text-start text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {editingId ? t("editMessage") : t("addMessage")}
        </label>
        <textarea
          id="message-text"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          placeholder={t("placeholder")}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
          >
            {editingId ? t("saveChanges") : t("add")}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-xl border border-zinc-200 px-4 py-2 text-sm dark:border-zinc-700"
            >
              {tc("cancel")}
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-center text-sm text-zinc-500">{tc("loading")}</p>
      ) : messages.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
          {t("empty")}
        </p>
      ) : (
        <ul className="space-y-3">
          {messages.map((message) => (
            <li
              key={message.id}
              className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800/80 dark:bg-zinc-900/80"
            >
              <p className="text-start text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                {message.text}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void toggleMessageFavorite(message.id).then(load)}
                  className={`rounded-lg px-2 py-1 text-xs font-medium ${
                    message.isFavorite
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {message.isFavorite ? t("favorited") : t("favorite")}
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(message)}
                  className="rounded-lg bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {tc("edit")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    void (async () => {
                      const confirmed = await confirm({
                        title: td("deleteTitle"),
                        description: t("deleteConfirm"),
                        confirmLabel: tc("delete"),
                        cancelLabel: tc("cancel"),
                        variant: "danger",
                      });
                      if (confirmed) {
                        await deleteMotivationalMessage(message.id);
                        await load();
                      }
                    })();
                  }}
                  className="rounded-lg bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 dark:bg-rose-950/50 dark:text-rose-400"
                >
                  {tc("delete")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
