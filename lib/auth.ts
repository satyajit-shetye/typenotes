import "server-only";

import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { database } from "@/lib/database";

const authSecret = process.env.AUTH_SECRET ?? process.env.BETTER_AUTH_SECRET;
const appUrl = process.env.APP_URL ?? process.env.BETTER_AUTH_URL;

if (!authSecret) {
  throw new Error("AUTH_SECRET is required.");
}

if (!appUrl) {
  throw new Error("APP_URL is required.");
}

export const auth = betterAuth({
  appName: "TinyNotes",
  baseURL: appUrl,
  database,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  secret: authSecret,
  plugins: [nextCookies()],
});
