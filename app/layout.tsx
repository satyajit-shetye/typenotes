import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentSession } from "@/lib/session";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TinyNotes",
    template: "%s | TinyNotes",
  },
  description: "A quiet place for thoughtful notes.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentSession();

  return (
    <html lang="en">
      <body className="antialiased">
        {!session && (
          <header className="border-b border-border bg-surface/80 backdrop-blur">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5 sm:px-10">
              <Link className="text-lg font-semibold tracking-tight text-acqua-800" href="/">
                TinyNotes
              </Link>
              <nav aria-label="Account navigation" className="flex items-center gap-5">
                <Link
                  className="text-sm font-medium text-acqua-800 transition-colors hover:text-acqua-600"
                  href="/login"
                >
                  Log in
                </Link>
                <Link
                  className="rounded-full bg-acqua-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-acqua-600"
                  href="/register"
                >
                  Register
                </Link>
              </nav>
            </div>
          </header>
        )}
        {children}
      </body>
    </html>
  );
}
