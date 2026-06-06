import type { Metadata } from "next";
import { PageIntro, PlaceholderPanel } from "@/app/_components/scaffold";

export const metadata: Metadata = {
  title: "Shared note",
};

export default function SharedNotePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-16 sm:px-10">
      <PageIntro
        eyebrow="Shared from TinyNotes"
        title="Public note placeholder"
        description="Public token resolution and sanitized note rendering will be added later."
      />
      <div className="mt-10">
        <PlaceholderPanel
          label="Sanitized shared-note content placeholder"
          description="Future read-only rendered note content."
          tall
        />
      </div>
    </main>
  );
}
