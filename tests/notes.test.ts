import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/session", () => ({
  requireSession: vi.fn(),
}));

vi.mock("@/lib/notes", () => ({
  createNote: vi.fn(),
  deleteNote: vi.fn(),
  disableNoteSharing: vi.fn(),
  enableNoteSharing: vi.fn(),
  updateNote: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    throw new Error("REDIRECT");
  }),
}));

import {
  createNoteAction,
  deleteNoteAction,
  disableNoteSharingAction,
  enableNoteSharingAction,
  updateNoteAction,
} from "@/app/notes/actions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createNote,
  deleteNote,
  disableNoteSharing,
  enableNoteSharing,
  updateNote,
} from "@/lib/notes";
import { extractTipTapText } from "@/lib/note-text";
import { requireSession } from "@/lib/session";

const testSession = {
  user: { id: "user_1" },
} as Awaited<ReturnType<typeof requireSession>>;

function tipTapDoc(text: string): string {
  return JSON.stringify({
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text }],
      },
    ],
  });
}

function noteFormData({
  contentJson = tipTapDoc("Valid content"),
  id,
  title = "My note",
}: {
  contentJson?: string;
  id?: string;
  title?: string;
} = {}): FormData {
  const formData = new FormData();

  if (id) {
    formData.set("id", id);
  }

  formData.set("title", title);
  formData.set("contentJson", contentJson);

  return formData;
}

describe("extractTipTapText", () => {
  it("collects text from nested TipTap content", () => {
    const contentJson = JSON.stringify({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Hello" }],
        },
        {
          type: "blockquote",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "TinyNotes" }],
            },
          ],
        },
      ],
    });

    expect(extractTipTapText(contentJson)).toBe("Hello TinyNotes");
  });

  it("normalizes whitespace across rich-text blocks", () => {
    const contentJson = JSON.stringify({
      type: "doc",
      content: [
        {
          type: "heading",
          content: [{ type: "text", text: "  Release\tplan " }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "\nShip tests" }],
                },
              ],
            },
          ],
        },
      ],
    });

    expect(extractTipTapText(contentJson)).toBe("Release plan Ship tests");
  });

  it("returns an empty string for invalid JSON", () => {
    expect(extractTipTapText("{not json")).toBe("");
  });
});

describe("createNoteAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireSession).mockResolvedValue(testSession);
  });

  it("returns a validation error for an empty title", async () => {
    await expect(createNoteAction({}, noteFormData({ title: "   " }))).resolves.toEqual({
      error: "Enter a title for your note.",
    });
    expect(createNote).not.toHaveBeenCalled();
  });

  it("returns a validation error for a long title", async () => {
    await expect(createNoteAction({}, noteFormData({ title: "a".repeat(121) }))).resolves.toEqual({
      error: "Title must be 120 characters or fewer.",
    });
    expect(createNote).not.toHaveBeenCalled();
  });

  it("returns a validation error for empty content", async () => {
    await expect(
      createNoteAction(
        {},
        noteFormData({
          contentJson: JSON.stringify({
            type: "doc",
            content: [
              {
                type: "paragraph",
              },
            ],
          }),
        }),
      ),
    ).resolves.toEqual({
      error: "Add some note content.",
    });
    expect(createNote).not.toHaveBeenCalled();
  });

  it("returns a validation error for unsupported content", async () => {
    await expect(
      createNoteAction(
        {},
        noteFormData({
          contentJson: JSON.stringify({
            type: "doc",
            content: [{ type: "unsupportedNode" }],
          }),
        }),
      ),
    ).resolves.toEqual({
      error: "The note content contains unsupported formatting.",
    });
    expect(createNote).not.toHaveBeenCalled();
  });

  it("creates a note with trimmed title and redirects to the list", async () => {
    const contentJson = tipTapDoc("A real note body");
    const formData = noteFormData({
      contentJson,
      title: "  Project plan  ",
    });

    vi.mocked(createNote).mockReturnValue("note_1");

    await expect(createNoteAction({}, formData)).rejects.toThrow("REDIRECT");
    expect(createNote).toHaveBeenCalledWith("user_1", {
      contentJson,
      title: "Project plan",
    });
    expect(revalidatePath).toHaveBeenCalledWith("/notes");
    expect(redirect).toHaveBeenCalledWith("/notes");
  });
});

describe("updateNoteAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireSession).mockResolvedValue(testSession);
  });

  it("requires an existing note id", async () => {
    await expect(updateNoteAction({}, noteFormData())).resolves.toEqual({
      error: "Open a note before saving changes.",
    });
    expect(updateNote).not.toHaveBeenCalled();
  });

  it("returns an error when the note is missing or belongs to another user", async () => {
    const formData = noteFormData({ id: "note_1" });

    vi.mocked(updateNote).mockReturnValue(false);

    await expect(updateNoteAction({}, formData)).resolves.toEqual({
      error: "We could not find that note.",
    });
    expect(updateNote).toHaveBeenCalledWith("user_1", "note_1", {
      contentJson: tipTapDoc("Valid content"),
      title: "My note",
    });
    expect(redirect).not.toHaveBeenCalled();
  });

  it("updates a note and revalidates the list and detail routes", async () => {
    const contentJson = JSON.stringify({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Updated content" }],
        },
      ],
    });
    const formData = noteFormData({
      contentJson,
      id: "note_1",
      title: " Updated note ",
    });

    vi.mocked(updateNote).mockReturnValue(true);

    await expect(updateNoteAction({}, formData)).rejects.toThrow("REDIRECT");
    expect(updateNote).toHaveBeenCalledWith("user_1", "note_1", {
      contentJson,
      title: "Updated note",
    });
    expect(revalidatePath).toHaveBeenCalledWith("/notes");
    expect(revalidatePath).toHaveBeenCalledWith("/notes/note_1");
    expect(redirect).toHaveBeenCalledWith("/notes");
  });
});

describe("note management actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireSession).mockResolvedValue(testSession);
  });

  it("deletes only the signed-in user's note", async () => {
    const formData = new FormData();
    formData.set("id", "note_1");

    await expect(deleteNoteAction(formData)).rejects.toThrow("REDIRECT");
    expect(deleteNote).toHaveBeenCalledWith("user_1", "note_1");
    expect(revalidatePath).toHaveBeenCalledWith("/notes");
    expect(redirect).toHaveBeenCalledWith("/notes");
  });

  it("enables sharing and returns to the note", async () => {
    const formData = new FormData();
    formData.set("id", "note_1");
    formData.set("returnTo", "/notes/note_1");
    vi.mocked(enableNoteSharing).mockReturnValue("public_token");

    await expect(enableNoteSharingAction(formData)).rejects.toThrow("REDIRECT");
    expect(enableNoteSharing).toHaveBeenCalledWith("user_1", "note_1");
    expect(redirect).toHaveBeenCalledWith("/notes/note_1");
  });

  it("disables sharing and returns to the requested notes page", async () => {
    const formData = new FormData();
    formData.set("id", "note_1");
    formData.set("returnTo", "/notes");

    await expect(disableNoteSharingAction(formData)).rejects.toThrow("REDIRECT");
    expect(disableNoteSharing).toHaveBeenCalledWith("user_1", "note_1");
    expect(redirect).toHaveBeenCalledWith("/notes");
  });
});
