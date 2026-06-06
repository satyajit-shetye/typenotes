# Repository Guidelines

## General Instructions

1. Always run “bun run lint” to check for linting issues and fix it.
2. Always check for TypeScript type errors and fix it.
3. Always run formatting scripts after making code changes.

## Project Structure & Module Organization

TinyNotes is a Next.js 16 App Router application written in TypeScript. Route files live under `app/`: public entry points include `app/page.tsx`, `app/login/`, and `app/register/`; note-related routes are grouped under `app/notes/`; shared-token pages use `app/s/[token]/`. Reusable UI currently belongs in `app/_components/`, while global Tailwind theme tokens and base styles live in `app/globals.css`. Put static files in `public/`. Review `SPEC.MD` before implementing product behavior or changing route responsibilities.

## Build, Test, and Development Commands

Use Bun and keep `bun.lock` authoritative.

- `bun install`: install dependencies.
- `bun run dev`: start the local development server at `http://localhost:3000`.
- `bun run build`: create a production build and catch Next.js/type integration errors.
- `bun run start`: serve the completed production build.
- `bun run lint`: run Oxlint across the repository.
- `bun run format`: format supported files with Oxfmt.

Run lint and build before opening a pull request.

## Coding Style & Naming Conventions

Use strict TypeScript, two-space indentation, double quotes, and semicolons; let Oxfmt resolve formatting details. Prefer React Server Components unless browser-only state or APIs require `"use client"`. Name components and prop types in PascalCase (`PageIntro`, `PageIntroProps`), functions and variables in camelCase, and route folders according to Next.js conventions (`[id]`, `loading.tsx`, `not-found.tsx`). Use the `@/` path alias for repository-root imports. Reuse theme utilities such as `text-acqua-600` instead of introducing one-off colors.

## Commit & Pull Request Guidelines

Recent commits use short, imperative summaries such as `Scaffold TinyNotes routes and acqua theme`. Keep each commit focused and avoid mixing unrelated refactors. Pull requests should explain the user-visible change, list verification performed, link relevant issues or specification sections, and include screenshots for UI changes.
