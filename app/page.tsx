import { PageIntro, PlaceholderPanel } from "@/app/_components/scaffold";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16 sm:px-10">
      <PageIntro
        eyebrow="TinyNotes"
        title="A quiet place for thoughtful notes."
        description="This landing page is a static placeholder. Authentication-aware routing will be added later."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <PlaceholderPanel
          label="Returning users"
          description="Future sign-in entry point."
        />
        <PlaceholderPanel
          label="New users"
          description="Future registration entry point."
        />
      </div>
    </main>
  );
}
