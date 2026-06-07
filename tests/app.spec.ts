import { expect, test, type Page, type TestInfo } from "@playwright/test";

const password = "TinyNotes123!";

function uniqueEmail(testInfo: TestInfo): string {
  const projectName = testInfo.project.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

  return `e2e-${projectName}-${testInfo.workerIndex}-${Date.now()}@example.com`;
}

async function register(page: Page, email: string): Promise<void> {
  await page.goto("/register");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL("/notes");
}

async function logIn(page: Page, email: string): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page).toHaveURL("/notes");
}

async function fillEditor(page: Page, text: string): Promise<void> {
  const editor = page.locator("#note-content");

  await expect(editor).toBeVisible();
  await editor.fill(text);
}

test("redirects anonymous visitors from the home page to login", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL("/login");
  await expect(page.getByRole("heading", { name: "Log in to TinyNotes" })).toBeVisible();
});

test("shows login and register routes", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByRole("heading", { name: "Log in to TinyNotes" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Log in" })).toBeVisible();

  await page.goto("/register");

  await expect(page.getByRole("heading", { name: "Start your TinyNotes space" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Create account" })).toBeVisible();
});

test("shows login validation when the form is submitted with invalid input", async ({ page }) => {
  await page.goto("/login");

  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page.getByText("Enter your email address.")).toBeVisible();
  await expect(page.getByText("Enter your password.")).toBeVisible();
});

test("protects the notes editor route for anonymous visitors", async ({ page }) => {
  await page.goto("/notes/new");

  await expect(page).toHaveURL("/login");
});

test("lets logged-in users select and retain a theme", async ({ page }, testInfo) => {
  const email = uniqueEmail(testInfo);

  await register(page, email);

  const themeSelector = page
    .getByRole("navigation", { name: "Workspace navigation" })
    .getByLabel("Theme");

  await expect(themeSelector).toHaveValue("light");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await themeSelector.selectOption("dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.reload();
  await expect(themeSelector).toHaveValue("dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL("/login");
  await expect(page.getByLabel("Theme")).toHaveCount(0);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("registers, creates, reopens, and updates a note", async ({ page }, testInfo) => {
  const email = uniqueEmail(testInfo);
  const initialTitle = `E2E note ${Date.now()}`;
  const initialBody = "Initial note body from the browser workflow.";
  const updatedTitle = `${initialTitle} updated`;
  const updatedBody = "Updated note body after logging back in.";

  await register(page, email);

  await page
    .getByRole("navigation", { name: "Workspace navigation" })
    .getByRole("link", { name: "New Note" })
    .click();
  await expect(page).toHaveURL("/notes/new");
  await page.getByLabel("Title").fill(initialTitle);
  await fillEditor(page, initialBody);
  await page.getByRole("button", { name: "Save note" }).click();

  await expect(page).toHaveURL("/notes");
  await expect(page.getByRole("heading", { name: initialTitle })).toBeVisible();
  await expect(page.getByText(initialBody)).toBeVisible();

  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL("/login");

  await logIn(page, email);
  await page.getByRole("link", { name: "View note" }).click();
  await expect(page).toHaveURL(/\/notes\/.+/);
  await expect(page.getByLabel("Title")).toHaveValue(initialTitle);

  await page.getByLabel("Title").fill(updatedTitle);
  await fillEditor(page, updatedBody);
  await page.getByRole("button", { name: "Update" }).click();

  await expect(page).toHaveURL("/notes");
  await expect(page.getByRole("heading", { name: updatedTitle })).toBeVisible();
  await expect(page.getByText(updatedBody)).toBeVisible();
});
