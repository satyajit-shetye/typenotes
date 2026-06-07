"use client";

import { useState } from "react";
import {
  deleteNoteAction,
  disableNoteSharingAction,
  enableNoteSharingAction,
} from "@/app/notes/actions";

type NoteActionsProps = {
  noteId: string;
  returnTo: string;
  shareEnabled: boolean;
  shareToken: string | null;
};

export function NoteActions({ noteId, returnTo, shareEnabled, shareToken }: NoteActionsProps) {
  const [copied, setCopied] = useState(false);
  const sharePath = shareToken ? `/s/${shareToken}` : null;

  async function copyShareLink() {
    if (!sharePath) return;

    await navigator.clipboard.writeText(`${window.location.origin}${sharePath}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {shareEnabled ? (
        <>
          {sharePath ? (
            <>
              <a
                className="rounded-xl border border-acqua-300 bg-acqua-50 px-4 py-2 text-sm font-semibold text-acqua-800 transition hover:bg-acqua-100"
                href={sharePath}
                rel="noreferrer"
                target="_blank"
              >
                Open shared note
              </a>
              <button
                className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition hover:border-acqua-300"
                onClick={copyShareLink}
                type="button"
              >
                {copied ? "Copied!" : "Copy link"}
              </button>
            </>
          ) : null}
          <form action={disableNoteSharingAction}>
            <input name="id" type="hidden" value={noteId} />
            <input name="returnTo" type="hidden" value={returnTo} />
            <button
              className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition hover:border-acqua-300"
              type="submit"
            >
              Disable sharing
            </button>
          </form>
        </>
      ) : (
        <form action={enableNoteSharingAction}>
          <input name="id" type="hidden" value={noteId} />
          <input name="returnTo" type="hidden" value={returnTo} />
          <button
            className="rounded-xl border border-acqua-300 bg-acqua-50 px-4 py-2 text-sm font-semibold text-acqua-800 transition hover:bg-acqua-100"
            type="submit"
          >
            Enable sharing
          </button>
        </form>
      )}
      <form
        action={deleteNoteAction}
        onSubmit={(event) => {
          if (!window.confirm("Delete this note? This cannot be undone.")) {
            event.preventDefault();
          }
        }}
      >
        <input name="id" type="hidden" value={noteId} />
        <button
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
          type="submit"
        >
          Delete note
        </button>
      </form>
    </div>
  );
}
