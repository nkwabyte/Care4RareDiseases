/**
 * Applies pending Drizzle migrations from ./drizzle in order, tracked in __drizzle_migrations.
 *
 * Databases created before migration tracking existed (schema applied by piping .sql files into
 * sqlite3) are baselined: if app tables exist but the tracking table does not, migrations up to
 * BASELINE_TAG are recorded as applied without being re-run.
 */
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { readMigrationFiles } from 'drizzle-orm/migrator';
import fs from 'node:fs';
import path from 'node:path';

const BASELINE_TAG = '0001_swift_invisible_woman';
const migrationsFolder = path.join(process.cwd(), 'drizzle');
const dbPath = process.env.DATABASE_PATH ?? path.join(process.cwd(), 'data', 'care4rare.db');

const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');

const hasTable = (name: string) =>
    !!sqlite.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name=?").get(name);

if (hasTable('users') && !hasTable('__drizzle_migrations')) {
    const journal = JSON.parse(
        fs.readFileSync(path.join(migrationsFolder, 'meta', '_journal.json'), 'utf8')
    ) as { entries: { tag: string }[] };
    const baselineCount = journal.entries.findIndex((e) => e.tag === BASELINE_TAG) + 1;
    const files = readMigrationFiles({ migrationsFolder }).slice(0, baselineCount);

    sqlite.exec(
        'CREATE TABLE "__drizzle_migrations" (id INTEGER PRIMARY KEY AUTOINCREMENT, hash text NOT NULL, created_at numeric)'
    );
    const insert = sqlite.prepare('INSERT INTO "__drizzle_migrations" (hash, created_at) VALUES (?, ?)');
    for (const m of files) insert.run(m.hash, m.folderMillis);
    console.log(`Baselined existing database at ${BASELINE_TAG} (${files.length} migrations).`);
}

migrate(drizzle(sqlite), { migrationsFolder });
console.log('Migrations up to date.');
sqlite.close();
