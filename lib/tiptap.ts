import type { Extensions } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

export function createNoteExtensions(): Extensions {
  return [
    StarterKit.configure({
      heading: {
        levels: [2, 3],
      },
    }),
  ];
}
