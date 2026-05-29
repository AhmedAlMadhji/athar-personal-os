import { db } from "@/lib/db";
import type {
  MotivationalMessage,
  MotivationalMessageInput,
} from "@/types/motivationalMessage";

function nowIso(): string {
  return new Date().toISOString();
}

export async function getAllMotivationalMessages(): Promise<
  MotivationalMessage[]
> {
  return db.motivationalMessages.orderBy("createdAt").reverse().toArray();
}

export async function getMotivationalMessageById(
  id: string
): Promise<MotivationalMessage | undefined> {
  return db.motivationalMessages.get(id);
}

export async function createMotivationalMessage(
  input: MotivationalMessageInput
): Promise<MotivationalMessage> {
  const timestamp = nowIso();
  const message: MotivationalMessage = {
    id: crypto.randomUUID(),
    text: input.text.trim(),
    isFavorite: input.isFavorite ?? false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await db.motivationalMessages.add(message);
  return message;
}

export async function updateMotivationalMessage(
  id: string,
  input: MotivationalMessageInput
): Promise<MotivationalMessage | undefined> {
  const existing = await db.motivationalMessages.get(id);
  if (!existing) return undefined;

  const updated: MotivationalMessage = {
    ...existing,
    text: input.text.trim(),
    isFavorite: input.isFavorite ?? existing.isFavorite,
    updatedAt: nowIso(),
  };

  await db.motivationalMessages.put(updated);
  return updated;
}

export async function deleteMotivationalMessage(id: string): Promise<boolean> {
  const existing = await db.motivationalMessages.get(id);
  if (!existing) return false;
  await db.motivationalMessages.delete(id);
  return true;
}

export async function toggleMessageFavorite(
  id: string
): Promise<MotivationalMessage | undefined> {
  const existing = await db.motivationalMessages.get(id);
  if (!existing) return undefined;

  const updated: MotivationalMessage = {
    ...existing,
    isFavorite: !existing.isFavorite,
    updatedAt: nowIso(),
  };

  await db.motivationalMessages.put(updated);
  return updated;
}

export async function getRandomMotivationalMessage(): Promise<string | null> {
  const messages = await getAllMotivationalMessages();
  if (messages.length === 0) return null;

  const favorites = messages.filter((m) => m.isFavorite);
  const pool = favorites.length > 0 ? favorites : messages;
  const picked = pool[Math.floor(Math.random() * pool.length)];
  return picked.text;
}
