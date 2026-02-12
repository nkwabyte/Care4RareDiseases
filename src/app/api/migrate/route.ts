import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
    try {
        console.log('Starting sessions table migration...');

        // Create new table with correct schema
        await db.run(sql`
            CREATE TABLE IF NOT EXISTS sessions_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
                token TEXT NOT NULL UNIQUE,
                expires_at TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('✓ Created new sessions table');

        // Copy data from old table if it exists
        try {
            await db.run(sql`
                INSERT INTO sessions_new (id, doctor_id, token, expires_at, created_at)
                SELECT id, doctor_id, token, expires_at, created_at FROM sessions;
            `);
            console.log('✓ Copied existing data');
        } catch (e) {
            console.log('No existing data to copy or already migrated');
        }

        // Drop old table
        await db.run(sql`DROP TABLE IF EXISTS sessions;`);
        console.log('✓ Dropped old table');

        // Rename new table
        await db.run(sql`ALTER TABLE sessions_new RENAME TO sessions;`);
        console.log('✓ Renamed new table');

        return NextResponse.json({
            success: true,
            message: 'Migration completed successfully!'
        });
    } catch (error) {
        console.error('Migration failed:', error);
        return NextResponse.json({
            success: false,
            error: String(error)
        }, { status: 500 });
    }
}
