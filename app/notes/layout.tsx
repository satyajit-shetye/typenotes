export default function NotesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-surface/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5 sm:px-10">
          <div>
            <p className="text-lg font-semibold tracking-tight text-acqua-800">TinyNotes</p>
            <p className="mt-1 text-xs text-muted">Authenticated app shell placeholder</p>
          </div>
          <div className="rounded-full border border-dashed border-acqua-300 px-4 py-2 text-xs font-medium text-acqua-800">
            Account area placeholder
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-10">{children}</div>
    </div>
  );
}
