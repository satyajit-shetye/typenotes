import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/app/_components/scaffold";
import { updateNoteAction } from "@/app/notes/actions";
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
