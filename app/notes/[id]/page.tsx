import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/app/_components/scaffold";
import { updateNoteAction } from "@/app/notes/actions";
import { NoteActions } from "@/app/notes/note-actions";
import { NoteForm } from "@/app/notes/new/new-note-form";
import { getNote } from "@/lib/notes";
import { requireSession } from "@/lib/session";

type NotePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "Edit note",
};

export default async function NotePage({ params }: NotePageProps) {
  const session = await requireSession();
  const { id } = await params;
  const note = getNote(session.user.id, id);

  if (!note) {
    notFound();
  }

  return (
    <main>
      <PageIntro
        eyebrow="Note workspace"
        title="View and edit note"
        description="Update the title or body, then save the latest version back to your workspace."
      />
      <div className="mt-8 rounded-2xl border border-border bg-surface/75 p-5">
        <p className="mb-3 text-sm leading-6 text-muted">
          {note.shareEnabled
            ? "Anyone with the link can view this note without signing in."
            : "This note is private. Enable sharing to generate a public link."}
        </p>
        <NoteActions
          noteId={note.id}
          returnTo={`/notes/${note.id}`}
          shareEnabled={note.shareEnabled}
          shareToken={note.shareToken}
        />
      </div>
      <div className="mt-10">
        <NoteForm
          action={updateNoteAction}
          initialContentJson={note.contentJson}
          initialTitle={note.title}
          noteId={note.id}
          submitLabel="Update"
        />
      </div>
    </main>
  );
}
