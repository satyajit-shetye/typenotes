import type { Metadata } from "next";
import { PageIntro, PlaceholderPanel } from "@/app/_components/scaffold";

export const metadata: Metadata = {
  title: "Notes",
};

export default function NotesPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Your workspace"
        title="Notes"
        description="Your saved notes will eventually appear here, ordered by their most recent update."
      />
      <div className="mt-10 grid gap-5">
        <PlaceholderPanel
          label="Create-note action placeholder"
          description="Future entry point for creating a new note."
        />
        <PlaceholderPanel
          label="Notes list and empty-state placeholder"
          description="Future note cards, sharing indicators, timestamps, and empty-list guidance."
          tall
        />
      </div>
    </main>
  );
}
