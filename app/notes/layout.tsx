import Link from "next/link";
import { LogoutButton } from "@/app/_components/logout-button";
import { requireSession } from "@/lib/session";

export default async function NotesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireSession();

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-surface/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5 sm:px-10">
          <Link className="text-lg font-semibold tracking-tight text-acqua-800" href="/notes">
            TinyNotes
          </Link>
          <nav aria-label="Workspace navigation" className="flex items-center gap-5">
            <Link
              className="text-sm font-medium text-acqua-800 transition-colors hover:text-acqua-600"
              href="/notes"
            >
              Notes
            </Link>
            <Link
              className="text-sm font-medium text-acqua-800 transition-colors hover:text-acqua-600"
              href="/notes/new"
            >
              New Note
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <div className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-10">{children}</div>
    </div>
  );
}
