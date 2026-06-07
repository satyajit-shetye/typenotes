"use server";

import { createDocument, getSchema, type JSONContent } from "@tiptap/core";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createNote,
  deleteNote,
  disableNoteSharing,
  enableNoteSharing,
  updateNote,
} from "@/lib/notes";
import { requireSession } from "@/lib/session";
import { createNoteExtensions } from "@/lib/tiptap";

type CreateNoteState = {
  error?: string;
};

type UpdateNoteState = CreateNoteState;

const emptyTitlePattern = /^\s*$/;
const noteSchema = getSchema(createNoteExtensions());

function validateTitle(title: string): string | null {
  if (emptyTitlePattern.test(title)) {
    return "Enter a title for your note.";
  }

  if (title.length > 120) {
    return "Title must be 120 characters or fewer.";
  }

  return null;
}

function validateContentJson(contentJson: string): string | null {
  if (!contentJson) {
    return "Add some note content.";
  }

  try {
    const parsed = JSON.parse(contentJson) as JSONContent;
    const document = createDocument(parsed, noteSchema, undefined, {
      errorOnInvalidContent: true,
    });

    if (document.type.name !== "doc") {
      return "Add some note content.";
    }

    if (!document.textContent.trim()) {
      return "Add some note content.";
    }
  } catch {
    return "The note content contains unsupported formatting.";
  }

  return null;
}

function safeReturnTo(value: FormDataEntryValue | null): string {
  const returnTo = String(value ?? "/notes");

  return returnTo.startsWith("/notes") ? returnTo : "/notes";
}

export async function createNoteAction(
  _previousState: CreateNoteState,
  formData: FormData,
): Promise<CreateNoteState> {
  const session = await requireSession();
  const title = String(formData.get("title") ?? "").trim();
  const contentJson = String(formData.get("contentJson") ?? "").trim();

  const titleError = validateTitle(title);

  if (titleError) {
    return { error: titleError };
  }

  const contentError = validateContentJson(contentJson);

  if (contentError) {
    return { error: contentError };
  }

  createNote(session.user.id, { title, contentJson });
  revalidatePath("/notes");
  redirect("/notes");
}

export async function updateNoteAction(
  _previousState: UpdateNoteState,
  formData: FormData,
): Promise<UpdateNoteState> {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const contentJson = String(formData.get("contentJson") ?? "").trim();

  if (!id) {
    return { error: "Open a note before saving changes." };
  }

  const titleError = validateTitle(title);

  if (titleError) {
    return { error: titleError };
  }

  const contentError = validateContentJson(contentJson);

  if (contentError) {
    return { error: contentError };
  }

  const didUpdate = updateNote(session.user.id, id, { title, contentJson });

  if (!didUpdate) {
    return { error: "We could not find that note." };
  }

  revalidatePath("/notes");
  revalidatePath(`/notes/${id}`);
  redirect("/notes");
}

export async function deleteNoteAction(formData: FormData): Promise<void> {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");

  if (id) {
    deleteNote(session.user.id, id);
    revalidatePath("/notes");
  }

  redirect("/notes");
}

export async function enableNoteSharingAction(formData: FormData): Promise<void> {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");
  const returnTo = safeReturnTo(formData.get("returnTo"));

  if (!id) {
    redirect(returnTo);
  }

  enableNoteSharing(session.user.id, id);
  revalidatePath("/notes");
  revalidatePath(`/notes/${id}`);
  redirect(returnTo);
}

export async function disableNoteSharingAction(formData: FormData): Promise<void> {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");
  const returnTo = safeReturnTo(formData.get("returnTo"));

  if (id) {
    disableNoteSharing(session.user.id, id);
    revalidatePath("/notes");
    revalidatePath(`/notes/${id}`);
  }

  redirect(returnTo);
}
