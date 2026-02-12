
import { db } from './index';
import { sessions, users } from './schema';
import { eq, sql } from 'drizzle-orm';

async function main() {
    console.log('Starting debug script...');
    try {
        const email = 'admin@care4rare.com';
        console.log(`Looking for user: ${email}`);
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (!user) {
            console.error('User not found!');
            return;
        }

        console.log('User found:', user);

        const token = 'debug-token-' + Date.now();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

        console.log('Attempting to insert session with Drizzle:', {
            userId: user.id,
            token,
            expiresAt
        });

        try {
            await db.insert(sessions).values({
                userId: user.id,
                token,
                expiresAt,
            });
            console.log('Session inserted successfully with Drizzle!');
        } catch (err) {
            console.error('Drizzle insert failed:', err);

            // Try raw SQL
            console.log('Attempting raw SQL insert...');
            const token2 = 'debug-token-raw-' + Date.now();
            try {
                await db.run(sql`
                    INSERT INTO sessions (user_id, token, expires_at)
                    VALUES (${user.id}, ${token2}, ${expiresAt})
                `);
                console.log('Session inserted successfully with Raw SQL!');
            } catch (rawErr) {
                console.error('Raw SQL insert failed:', rawErr);
            }
        }

    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

main();
