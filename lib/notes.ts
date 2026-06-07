import "server-only";

import { database } from "@/lib/database";
export { extractTipTapText } from "@/lib/note-text";

export type NoteListItem = {
  id: string;
  title: string;
  contentJson: string;
  shareEnabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NoteRecord = NoteListItem & {
  userId: string;
};

export type CreateNoteInput = {
  title: string;
  contentJson: string;
};

const listNotesStatement = database.query(
  `SELECT id, title, content_json as contentJson, share_enabled as shareEnabled, created_at as createdAt, updated_at as updatedAt
   FROM note
   WHERE user_id = ?
   ORDER BY updated_at DESC;`,
);

const getNoteStatement = database.query(
  `SELECT id, user_id as userId, title, content_json as contentJson, share_enabled as shareEnabled, created_at as createdAt, updated_at as updatedAt
   FROM note
   WHERE id = ? AND user_id = ?;`,
);

const createNoteStatement = database.query(
  `INSERT INTO note (id, user_id, title, content_json, share_enabled, created_at, updated_at)
   VALUES (?, ?, ?, ?, 0, ?, ?);`,
);

const updateNoteStatement = database.query(
  `UPDATE note
   SET title = COALESCE(?, title),
       content_json = COALESCE(?, content_json),
       updated_at = ?
   WHERE id = ? AND user_id = ?;`,
);

export function listNotes(userId: string): NoteListItem[] {
  return listNotesStatement.all(userId) as NoteListItem[];
}

export function getNote(userId: string, id: string): NoteRecord | null {
  return (getNoteStatement.get(id, userId) as NoteRecord | null) ?? null;
}

export function createNote(userId: string, input: CreateNoteInput): string {
  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  createNoteStatement.run(id, userId, input.title, input.contentJson, now, now);

  return id;
}

export function updateNote(userId: string, id: string, input: Partial<CreateNoteInput>): boolean {
  const now = new Date().toISOString();
  const result = updateNoteStatement.run(
    input.title ?? null,
    input.contentJson ?? null,
    now,
    id,
    userId,
  );

  return result.changes > 0;
}
