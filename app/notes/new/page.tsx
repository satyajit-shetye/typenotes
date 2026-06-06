import type { Metadata } from "next";
import { PageIntro, PlaceholderPanel } from "@/app/_components/scaffold";

export const metadata: Metadata = {
  title: "New note",
};

export default function NewNotePage() {
  return (
    <main>
      <PageIntro
        eyebrow="New note"
        title="Capture a thought"
        description="The note editor and creation behavior will be added later."
      />
      <div className="mt-10 grid gap-5">
        <PlaceholderPanel
          label="Note title placeholder"
          description="Future editable note title."
        />
        <PlaceholderPanel
          label="Rich-text editor placeholder"
          description="Future TipTap toolbar, editing surface, and save-status area."
          tall
        />
      </div>
    </main>
  );
}
