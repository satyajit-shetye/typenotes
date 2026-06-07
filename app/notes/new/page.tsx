import type { Metadata } from "next";
import { PageIntro } from "@/app/_components/scaffold";
import { createNoteAction } from "@/app/notes/actions";
import { NoteForm } from "@/app/notes/new/new-note-form";

export const metadata: Metadata = {
  title: "New note",
};

export default function NewNotePage() {
  return (
    <main>
      <PageIntro
        eyebrow="New note"
        title="Capture a thought"
        description="Write a title, compose the note, and save it to your workspace."
      />
      <div className="mt-10">
        <NoteForm action={createNoteAction} submitLabel="Save note" />
      </div>
    </main>
  );
}
