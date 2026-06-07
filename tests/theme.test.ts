import { describe, expect, it } from "vitest";
import { getTheme } from "@/lib/theme";

describe("getTheme", () => {
  it("uses light as the default theme", () => {
    expect(getTheme(undefined)).toBe("light");
    expect(getTheme("unexpected")).toBe("light");
  });

  it("accepts the dark theme", () => {
    expect(getTheme("dark")).toBe("dark");
  });
});
