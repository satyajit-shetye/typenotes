import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/app/_components/scaffold";
import { listNotes } from "@/lib/notes";
import { extractTipTapText } from "@/lib/note-text";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Notes",
};

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function summarizeNote(contentJson: string) {
  const text = extractTipTapText(contentJson);

  if (!text) {
    return "No content yet.";
  }

  return text.length > 180 ? `${text.slice(0, 180).trimEnd()}...` : text;
}

export default async function NotesPage() {
  const session = await requireSession();
  const notes = listNotes(session.user.id);

  return (
    <main>
      <PageIntro
        eyebrow="Your workspace"
        title="Notes"
        description="Your saved notes appear here, ordered by the most recent update."
      />
      {notes.length > 0 ? (
        <div className="mt-10 grid gap-4">
          {notes.map((note) => (
            <article
              className="rounded-2xl border border-border bg-surface/90 p-5 shadow-sm transition hover:border-acqua-300 hover:shadow-md"
              key={note.id}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    {note.title || "Untitled note"}
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    Updated {formatUpdatedAt(note.updatedAt)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    note.shareEnabled ? "bg-acqua-50 text-acqua-800" : "bg-surface-muted text-muted"
                  }`}
                >
                  {note.shareEnabled ? "Shared" : "Private"}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted">{summarizeNote(note.contentJson)}</p>
              <div className="mt-4 flex items-center gap-3">
                <Link
                  className="rounded-xl bg-acqua-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-acqua-600"
                  href={`/notes/${note.id}`}
                >
                  View note
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-acqua-300 bg-surface/75 p-6 shadow-sm">
          <p className="text-sm font-semibold text-acqua-800">No notes yet</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Create your first note to start saving thoughts in TinyNotes.
          </p>
          <Link
            className="mt-5 inline-flex rounded-xl bg-acqua-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-acqua-600"
            href="/notes/new"
          >
            New note
          </Link>
        </div>
      )}
    </main>
  );
}
