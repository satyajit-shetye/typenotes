import { PageIntro, PlaceholderPanel } from "@/app/_components/scaffold";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-16">
      <PageIntro
        eyebrow="404"
        title="This page could not be found."
        description="The requested page or note is unavailable."
      />
      <div className="mt-8">
        <PlaceholderPanel
          label="Not-found actions placeholder"
          description="Future navigation back to a safe destination."
        />
      </div>
    </main>
  );
}
