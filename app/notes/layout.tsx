import Link from "next/link";
import { LogoutButton } from "@/app/_components/logout-button";
import { ThemeSelector } from "@/app/_components/theme-selector";
import { requireSession } from "@/lib/session";
import { getTheme, THEME_COOKIE_NAME } from "@/lib/theme";
import { cookies } from "next/headers";

export default async function NotesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireSession();
  const cookieStore = await cookies();
  const theme = getTheme(cookieStore.get(THEME_COOKIE_NAME)?.value);

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-surface/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-5 sm:px-10">
          <Link className="text-lg font-semibold tracking-tight text-acqua-800" href="/notes">
            TinyNotes
          </Link>
          <nav aria-label="Workspace navigation" className="flex items-center gap-3 sm:gap-5">
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
            <ThemeSelector initialTheme={theme} />
            <LogoutButton />
          </nav>
        </div>
      </header>
      <div className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-10">{children}</div>
    </div>
  );
}
