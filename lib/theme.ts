export const THEME_COOKIE_NAME = "typenotes-theme";

export type Theme = "light" | "dark";

export function getTheme(value: string | undefined): Theme {
  return value === "dark" ? "dark" : "light";
}
