export function extractTipTapText(contentJson: string): string {
  try {
    const doc = JSON.parse(contentJson) as {
      content?: unknown[];
      text?: string;
    };

    const parts: string[] = [];

    function walk(node: unknown): void {
      if (!node || typeof node !== "object") {
        return;
      }

      const value = node as {
        content?: unknown[];
        text?: string;
      };

      if (typeof value.text === "string") {
        parts.push(value.text);
      }

      if (Array.isArray(value.content)) {
        for (const child of value.content) {
          walk(child);
        }
      }
    }

    walk(doc);

    return parts.join(" ").replace(/\s+/g, " ").trim();
  } catch {
    return "";
  }
}
