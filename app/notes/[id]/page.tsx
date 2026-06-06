import type { Metadata } from "next";
import { PageIntro, PlaceholderPanel } from "@/app/_components/scaffold";

export const metadata: Metadata = {
  title: "Edit note",
};

export default function NotePage() {
  return (
    <main>
      <PageIntro
        eyebrow="Note workspace"
        title="View and edit note"
        description="Note loading, editing, autosave, deletion, and sharing behavior will be added later."
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="grid gap-5">
          <PlaceholderPanel
            label="Note title placeholder"
            description="Future editable note title and save status."
          />
          <PlaceholderPanel
            label="Rich-text editor placeholder"
            description="Future TipTap toolbar and editing surface."
            tall
          />
        </div>
        <div className="grid content-start gap-5">
          <PlaceholderPanel
            label="Share controls placeholder"
            description="Future share-link enable, copy, and disable controls."
          />
          <PlaceholderPanel
            label="Delete-note placeholder"
            description="Future note deletion controls."
          />
        </div>
      </div>
    </main>
  );
}
