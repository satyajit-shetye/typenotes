import { generateHTML } from "@tiptap/html";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicNote } from "@/lib/notes";
import { createNoteExtensions } from "@/lib/tiptap";

type SharedNotePageProps = {
  params: Promise<{ token: string }>;
};

export const metadata: Metadata = {
  title: "Shared note",
  robots: { index: false, follow: false },
};

export default async function SharedNotePage({ params }: SharedNotePageProps) {
  const { token } = await params;
  const note = getPublicNote(token);

  if (!note) {
    notFound();
  }

  let contentHtml: string;

  try {
    contentHtml = generateHTML(JSON.parse(note.contentJson), createNoteExtensions());
  } catch {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-16 sm:px-10">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-acqua-800">
        Shared from TinyNotes
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">{note.title}</h1>
      <p className="mt-3 text-sm text-muted">
        Last updated{" "}
        {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(
          new Date(note.updatedAt),
        )}
      </p>
      <article
        className="shared-note mt-10 rounded-2xl border border-border bg-surface p-6 shadow-sm"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </main>
  );
}
