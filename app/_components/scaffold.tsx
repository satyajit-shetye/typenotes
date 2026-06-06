type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

type PlaceholderPanelProps = {
  label: string;
  description: string;
  tall?: boolean;
};

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <header className="max-w-3xl">
      <p className="text-xs font-semibold tracking-[0.22em] text-acqua-600 uppercase">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{description}</p>
    </header>
  );
}

export function PlaceholderPanel({ label, description, tall = false }: PlaceholderPanelProps) {
  return (
    <section
      className={`rounded-2xl border border-dashed border-acqua-300 bg-surface/75 p-6 shadow-sm ${
        tall ? "min-h-80" : "min-h-36"
      }`}
    >
      <p className="text-sm font-semibold text-acqua-800">{label}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </section>
  );
}

export function LoadingPlaceholder({ label }: { label: string }) {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-10">
      <div className="rounded-2xl border border-border bg-surface/80 p-6 shadow-sm">
        <p className="text-sm font-medium text-acqua-800">{label}</p>
        <div className="mt-5 h-3 w-2/3 rounded-full bg-acqua-100" />
        <div className="mt-3 h-3 w-1/2 rounded-full bg-surface-muted" />
      </div>
    </main>
  );
}
