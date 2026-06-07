import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { database } from "@/lib/database";
export { extractTipTapText } from "@/lib/note-text";

export type NoteListItem = {
  id: string;
  title: string;
  contentJson: string;
  shareEnabled: boolean;
  shareToken: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NoteRecord = NoteListItem & { userId: string };
export type PublicNote = Pick<NoteRecord, "title" | "contentJson" | "updatedAt">;
export type CreateNoteInput = { title: string; contentJson: string };

const noteSelect = `SELECT note.id, note.title, note.content_json as contentJson,
  note.share_enabled as shareEnabled, note_share.token as shareToken,
  note.created_at as createdAt, note.updated_at as updatedAt`;

const listNotesStatement = database.query(
  `${noteSelect}
   FROM note
   LEFT JOIN note_share ON note_share.note_id = note.id AND note_share.enabled = 1
   WHERE note.user_id = ?
   ORDER BY note.updated_at DESC;`,
);
const getNoteStatement = database.query(
  `${noteSelect}, note.user_id as userId
   FROM note
   LEFT JOIN note_share ON note_share.note_id = note.id AND note_share.enabled = 1
   WHERE note.id = ? AND note.user_id = ?;`,
);
const createNoteStatement = database.query(
  `INSERT INTO note (id, user_id, title, content_json, share_enabled, created_at, updated_at)
   VALUES (?, ?, ?, ?, 0, ?, ?);`,
);
const updateNoteStatement = database.query(
  `UPDATE note SET title = COALESCE(?, title), content_json = COALESCE(?, content_json), updated_at = ?
   WHERE id = ? AND user_id = ?;`,
);
const deleteNoteStatement = database.query("DELETE FROM note WHERE id = ? AND user_id = ?;");
const disableSharesStatement = database.query(
  "UPDATE note_share SET enabled = 0, disabled_at = ? WHERE note_id = ? AND enabled = 1;",
);
const setShareEnabledStatement = database.query(
  "UPDATE note SET share_enabled = ? WHERE id = ? AND user_id = ?;",
);
const createShareStatement = database.query(
  `INSERT INTO note_share (id, note_id, token_hash, token, enabled, created_at)
   VALUES (?, ?, ?, ?, 1, ?);`,
);
const getPublicNoteStatement = database.query(
  `SELECT note.title, note.content_json as contentJson, note.updated_at as updatedAt
   FROM note_share JOIN note ON note.id = note_share.note_id
   WHERE note_share.token_hash = ? AND note_share.enabled = 1 AND note.share_enabled = 1;`,
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
  const result = updateNoteStatement.run(
    input.title ?? null,
    input.contentJson ?? null,
    new Date().toISOString(),
    id,
    userId,
  );
  return result.changes > 0;
}
export function deleteNote(userId: string, id: string): boolean {
  return deleteNoteStatement.run(id, userId).changes > 0;
}

export function enableNoteSharing(userId: string, id: string): string | null {
  const token = randomBytes(24).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const now = new Date().toISOString();
  const transaction = database.transaction(() => {
    const result = setShareEnabledStatement.run(1, id, userId);
    if (result.changes === 0) return false;
    disableSharesStatement.run(now, id);
    createShareStatement.run(crypto.randomUUID(), id, tokenHash, token, now);
    return true;
  });
  return transaction.immediate() ? token : null;
}

export function disableNoteSharing(userId: string, id: string): boolean {
  const now = new Date().toISOString();
  const transaction = database.transaction(() => {
    const result = setShareEnabledStatement.run(0, id, userId);
    if (result.changes === 0) return false;
    disableSharesStatement.run(now, id);
    return true;
  });
  return transaction.immediate();
}

export function getPublicNote(token: string): PublicNote | null {
  const tokenHash = createHash("sha256").update(token).digest("hex");
  return (getPublicNoteStatement.get(tokenHash) as PublicNote | null) ?? null;
}
