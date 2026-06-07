import "server-only";

import { Database } from "bun:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const defaultDatabasePath = "./data/tinynotes.db";
const configuredPath = process.env.DB_PATH ?? defaultDatabasePath;
const databasePath = configuredPath === ":memory:" ? configuredPath : resolve(configuredPath);

if (databasePath !== ":memory:") {
  mkdirSync(dirname(databasePath), { recursive: true });
}

const globalForDatabase = globalThis as typeof globalThis & {
  tinynotesDatabase?: Database;
};

export const database =
  globalForDatabase.tinynotesDatabase ??
  new Database(databasePath, {
    create: true,
    strict: true,
  });

database.run("PRAGMA foreign_keys = ON;");

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.tinynotesDatabase = database;
}
