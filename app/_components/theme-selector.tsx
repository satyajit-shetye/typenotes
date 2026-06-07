"use client";

import { useState } from "react";
import { THEME_COOKIE_NAME, type Theme } from "@/lib/theme";

type ThemeSelectorProps = {
  initialTheme: Theme;
};

export function ThemeSelector({ initialTheme }: ThemeSelectorProps) {
  const [theme, setTheme] = useState(initialTheme);

  function handleThemeChange(nextTheme: Theme) {
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    document.cookie = `${THEME_COOKIE_NAME}=${nextTheme}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }

  return (
    <div className="relative inline-flex items-center">
      <select
        aria-label="Theme"
        className="h-9 min-w-32 cursor-pointer appearance-none rounded-full border border-border bg-surface-muted/70 py-1.5 pr-8 pl-3 text-sm font-semibold text-foreground shadow-sm outline-none transition-colors hover:border-acqua-300 hover:bg-surface focus:border-acqua-600 focus:bg-surface focus:ring-2 focus:ring-acqua-100"
        onChange={(event) => handleThemeChange(event.target.value as Theme)}
        value={theme}
      >
        <option value="light">Light Theme</option>
        <option value="dark">Dark Theme</option>
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 h-1.5 w-1.5 rotate-45 border-r-2 border-b-2 border-muted"
      />
    </div>
  );
}
