import { Database } from "bun:sqlite";
import { mkdir, readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

type Direction = "up" | "down";

type MigrationPair = {
  version: string;
  upPath: string;
  downPath: string;
};

type PartialMigrationPair = Partial<Record<Direction, string>>;

const defaultDatabasePath = "./data/tinynotes.db";
const migrationFilePattern = /^(\d+_[a-z0-9][a-z0-9_-]*)\.(up|down)\.sql$/;
const migrationsDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "../migrations");

function parseDirection(value: string | undefined): Direction {
  if (value === undefined || value === "up") {
    return "up";
  }

  if (value === "down") {
    return "down";
  }

  throw new Error("Usage: bun run scripts/migrate.ts [up|down]");
}

async function loadMigrations(): Promise<MigrationPair[]> {
  const entries = await readdir(migrationsDirectory, { withFileTypes: true });
  const migrationPairs = new Map<string, PartialMigrationPair>();

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".sql")) {
      continue;
    }

    const match = migrationFilePattern.exec(entry.name);

    if (!match) {
      throw new Error(`Invalid migration filename: ${entry.name}`);
    }

    const version = match[1];
    const direction = match[2] as Direction;
    const migrationPair = migrationPairs.get(version) ?? {};

    if (migrationPair[direction]) {
      throw new Error(`Duplicate ${direction} migration for ${version}`);
    }

    migrationPair[direction] = join(migrationsDirectory, entry.name);
    migrationPairs.set(version, migrationPair);
  }

  return [...migrationPairs.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([version, pair]) => {
      if (!pair.up || !pair.down) {
        throw new Error(`Migration ${version} must have both up and down SQL`);
      }

      return {
        version,
        upPath: pair.up,
        downPath: pair.down,
      };
    });
}

function openDatabase(): { database: Database; path: string } {
  const configuredPath = Bun.env.DB_PATH ?? defaultDatabasePath;
  const databasePath = configuredPath === ":memory:" ? configuredPath : resolve(configuredPath);

  const database = new Database(databasePath, {
    create: true,
    strict: true,
  });

  database.run("PRAGMA foreign_keys = ON;");
  database.run(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);

  return { database, path: databasePath };
}

async function applyPendingMigrations(
  database: Database,
  migrations: MigrationPair[],
): Promise<void> {
  const appliedRows = database.query("SELECT version FROM schema_migrations;").all() as {
    version: string;
  }[];
  const appliedVersions = new Set(appliedRows.map(({ version }) => version));
  const insertMigration = database.query(
    "INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?);",
  );
  const applyMigration = database.transaction((version: string, sql: string) => {
    database.run(sql);
    insertMigration.run(version, new Date().toISOString());
  });

  const pendingMigrations = migrations.filter(({ version }) => !appliedVersions.has(version));

  if (pendingMigrations.length === 0) {
    console.log("No pending migrations.");
    return;
  }

  for (const migration of pendingMigrations) {
    const sql = await readFile(migration.upPath, "utf8");
    applyMigration.immediate(migration.version, sql);
    console.log(`Applied ${migration.version}`);
  }
}

async function rollbackLatestMigration(
  database: Database,
  migrations: MigrationPair[],
): Promise<void> {
  const latestApplied = database
    .query("SELECT version FROM schema_migrations ORDER BY applied_at DESC, version DESC LIMIT 1;")
    .get() as { version: string } | null;

  if (!latestApplied) {
    console.log("No applied migrations to roll back.");
    return;
  }

  const migration = migrations.find(({ version }) => version === latestApplied.version);

  if (!migration) {
    throw new Error(`Cannot roll back missing migration ${latestApplied.version}`);
  }

  const deleteMigration = database.query("DELETE FROM schema_migrations WHERE version = ?;");
  const rollbackMigration = database.transaction((version: string, sql: string) => {
    database.run(sql);
    const result = deleteMigration.run(version);

    if (result.changes !== 1) {
      throw new Error(`Failed to remove migration record for ${version}`);
    }
  });
  const sql = await readFile(migration.downPath, "utf8");

  rollbackMigration.immediate(migration.version, sql);
  console.log(`Rolled back ${migration.version}`);
}

async function main(): Promise<void> {
  const direction = parseDirection(Bun.argv[2]);
  const migrations = await loadMigrations();
  const configuredPath = Bun.env.DB_PATH ?? defaultDatabasePath;

  if (configuredPath !== ":memory:") {
    await mkdir(dirname(resolve(configuredPath)), { recursive: true });
  }

  const { database, path } = openDatabase();

  console.log(`Using database: ${path}`);

  try {
    if (direction === "up") {
      await applyPendingMigrations(database, migrations);
    } else {
      await rollbackLatestMigration(database, migrations);
    }
  } finally {
    database.close();
  }
}

main().catch((error: unknown) => {
  console.error("Migration failed:", error);
  process.exitCode = 1;
});
