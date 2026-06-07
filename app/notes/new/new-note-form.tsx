"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import { useActionState, useEffect, useMemo, useState, type ReactNode } from "react";
import { createNoteExtensions } from "@/lib/tiptap";

type NoteFormProps = {
  action: typeof import("@/app/notes/actions").createNoteAction;
  submitLabel: string;
  initialTitle?: string;
  initialContentJson?: string;
  noteId?: string;
};

type NoteFormState = {
  error?: string;
};

const emptyDoc = {
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
  ],
};

const initialState: NoteFormState = {};

function safeParseContent(contentJson?: string) {
  if (!contentJson) {
    return emptyDoc;
  }

  try {
    return JSON.parse(contentJson) as Record<string, unknown>;
  } catch {
    return emptyDoc;
  }
}

export function NoteForm({
  action,
  submitLabel,
  initialTitle = "",
  initialContentJson,
  noteId,
}: NoteFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [title, setTitle] = useState(initialTitle);
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [contentJson, setContentJson] = useState(initialContentJson ?? JSON.stringify(emptyDoc));
  const initialContent = useMemo(() => safeParseContent(initialContentJson), [initialContentJson]);

  const editor = useEditor({
    extensions: [
      ...createNoteExtensions(),
      Placeholder.configure({
        placeholder: "Start writing your note...",
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        id: "note-content",
        class:
          "min-h-72 rounded-2xl border border-border bg-surface px-4 py-4 text-sm leading-7 text-foreground outline-none focus:border-acqua-600 focus:ring-4 focus:ring-acqua-100",
      },
    },
    onUpdate: ({ editor }) => {
      setContentJson(JSON.stringify(editor.getJSON()));
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  useEffect(() => {
    setContentJson(initialContentJson ?? JSON.stringify(emptyDoc));
  }, [initialContentJson]);

  function validateTitle(value: string) {
    const trimmed = value.trim();

    if (!trimmed) {
      return "Enter a title for your note.";
    }

    if (trimmed.length > 120) {
      return "Title must be 120 characters or fewer.";
    }

    return "";
  }

  function validateContent() {
    if (!editor || editor.isEmpty) {
      return "Add some note content.";
    }

    return "";
  }

  return (
    <form
      action={formAction}
      className="grid gap-5 rounded-2xl border border-border bg-surface/90 p-6 shadow-sm sm:p-8"
      noValidate
      onSubmit={(event) => {
        const nextTitleError = validateTitle(title);
        const nextContentError = validateContent();

        setTitleError(nextTitleError);
        setContentError(nextContentError);

        if (nextTitleError || nextContentError) {
          event.preventDefault();
        }
      }}
    >
      {noteId ? <input name="id" type="hidden" value={noteId} /> : null}
      <div>
        <label className="text-sm font-semibold text-acqua-800" htmlFor="note-title">
          Title
        </label>
        <input
          aria-describedby={titleError ? "note-title-error" : undefined}
          aria-invalid={Boolean(titleError)}
          autoComplete="off"
          className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-acqua-600 focus:ring-4 focus:ring-acqua-100"
          id="note-title"
          maxLength={120}
          name="title"
          onChange={(event) => {
            setTitle(event.target.value);
            setTitleError("");
          }}
          placeholder="Note title"
          required
          type="text"
          value={title}
          disabled={isPending}
        />
        {titleError ? (
          <p className="mt-2 text-sm text-red-700" id="note-title-error">
            {titleError}
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted">Keep it short and clear.</p>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-4">
          <label className="text-sm font-semibold text-acqua-800" htmlFor="note-content">
            Content
          </label>
          <span className="text-xs text-muted">TipTap editor</span>
        </div>

        <input name="contentJson" type="hidden" value={contentJson} readOnly />

        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="flex flex-wrap gap-2 border-b border-border px-3 py-3">
            <ToolbarButton
              disabled={!editor?.can().chain().focus().toggleBold().run()}
              onClick={() => editor?.chain().focus().toggleBold().run()}
              pressed={editor?.isActive("bold") ?? false}
              type="button"
            >
              Bold
            </ToolbarButton>
            <ToolbarButton
              disabled={!editor?.can().chain().focus().toggleItalic().run()}
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              pressed={editor?.isActive("italic") ?? false}
              type="button"
            >
              Italic
            </ToolbarButton>
            <ToolbarButton
              disabled={!editor?.can().chain().focus().toggleBulletList().run()}
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              pressed={editor?.isActive("bulletList") ?? false}
              type="button"
            >
              Bullets
            </ToolbarButton>
            <ToolbarButton
              disabled={!editor?.can().chain().focus().toggleOrderedList().run()}
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              pressed={editor?.isActive("orderedList") ?? false}
              type="button"
            >
              Numbered
            </ToolbarButton>
            <ToolbarButton
              disabled={!editor?.can().chain().focus().toggleBlockquote().run()}
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              pressed={editor?.isActive("blockquote") ?? false}
              type="button"
            >
              Quote
            </ToolbarButton>
            <ToolbarButton
              disabled={!editor?.can().chain().focus().toggleCodeBlock().run()}
              onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
              pressed={editor?.isActive("codeBlock") ?? false}
              type="button"
            >
              Code
            </ToolbarButton>
            <ToolbarButton
              disabled={!editor?.can().chain().focus().toggleStrike().run()}
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              pressed={editor?.isActive("strike") ?? false}
              type="button"
            >
              Strike
            </ToolbarButton>
            <ToolbarButton
              disabled={!editor?.can().chain().focus().setParagraph().run()}
              onClick={() => editor?.chain().focus().setParagraph().run()}
              pressed={editor?.isActive("paragraph") ?? false}
              type="button"
            >
              Text
            </ToolbarButton>
            <ToolbarButton
              disabled={!editor?.can().chain().focus().toggleHeading({ level: 2 }).run()}
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              pressed={editor?.isActive("heading", { level: 2 }) ?? false}
              type="button"
            >
              Heading 2
            </ToolbarButton>
            <ToolbarButton
              disabled={!editor?.can().chain().focus().toggleHeading({ level: 3 }).run()}
              onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
              pressed={editor?.isActive("heading", { level: 3 }) ?? false}
              type="button"
            >
              Heading 3
            </ToolbarButton>
            <ToolbarButton
              disabled={!editor?.can().chain().focus().setHorizontalRule().run()}
              onClick={() => editor?.chain().focus().setHorizontalRule().run()}
              pressed={false}
              type="button"
            >
              Rule
            </ToolbarButton>
            <ToolbarButton
              disabled={!editor?.can().chain().focus().undo().run()}
              onClick={() => editor?.chain().focus().undo().run()}
              pressed={false}
              type="button"
            >
              Undo
            </ToolbarButton>
            <ToolbarButton
              disabled={!editor?.can().chain().focus().redo().run()}
              onClick={() => editor?.chain().focus().redo().run()}
              pressed={false}
              type="button"
            >
              Redo
            </ToolbarButton>
          </div>

          <EditorContent editor={editor} />
        </div>

        {contentError ? (
          <p className="mt-2 text-sm text-red-700" id="note-content-error">
            {contentError}
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted">You can use simple formatting with the toolbar.</p>
        )}
      </div>

      {state.error ? (
        <p
          className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <div className="flex items-center justify-end gap-3">
        <button
          className="rounded-xl border border-border px-4 py-3 text-sm font-semibold text-acqua-800 transition hover:border-acqua-300 hover:bg-acqua-50 disabled:cursor-wait disabled:opacity-60"
          disabled={isPending}
          type="button"
          onClick={() => {
            setTitle(initialTitle);
            setTitleError("");
            setContentError("");
            editor?.commands.setContent(initialContent);
            setContentJson(JSON.stringify(initialContent));
          }}
        >
          Reset
        </button>
        <button
          className="rounded-xl bg-acqua-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-acqua-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acqua-800 disabled:cursor-wait disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

type ToolbarButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  onClick: () => void;
  pressed?: boolean;
  type: "button";
};

function ToolbarButton({ children, disabled, onClick, pressed, type }: ToolbarButtonProps) {
  return (
    <button
      aria-pressed={pressed}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        pressed
          ? "border-acqua-600 bg-acqua-50 text-acqua-800"
          : "border-border text-acqua-800 hover:border-acqua-300 hover:bg-acqua-50"
      } disabled:cursor-not-allowed disabled:opacity-50`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
