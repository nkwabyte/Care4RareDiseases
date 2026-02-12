import { db } from './index.js';
import { sql } from 'drizzle-orm';

async function migrateSessionsTable() {
    try {
        console.log('Starting sessions table migration...');

        // Add userId column if it doesn't exist
        try {
            await db.run(sql`
                ALTER TABLE sessions ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
            `);
            console.log('✓ Added user_id column');
        } catch (error: any) {
            if (error.message && error.message.includes('duplicate column name: user_id')) {
                console.log('ℹ user_id column already exists, skipping addition');
            } else {
                throw error;
            }
        }

        // Note: SQLite doesn't support dropping NOT NULL constraint directly
        // We need to recreate the table to make doctorId nullable
        console.log('Recreating sessions table to make doctor_id nullable...');

        // Create new table with correct schema
        await db.run(sql`
            CREATE TABLE sessions_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
                token TEXT NOT NULL UNIQUE,
                expires_at TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('✓ Created new sessions table');

        // Copy data from old table
        await db.run(sql`
            INSERT INTO sessions_new (id, user_id, doctor_id, token, expires_at, created_at)
            SELECT id, user_id, doctor_id, token, expires_at, created_at FROM sessions;
        `);

        console.log('✓ Copied existing data');

        // Drop old table
        await db.run(sql`DROP TABLE sessions;`);

        console.log('✓ Dropped old table');

        // Rename new table
        await db.run(sql`ALTER TABLE sessions_new RENAME TO sessions;`);

        console.log('✓ Renamed new table');

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrateSessionsTable();
