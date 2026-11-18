/**
 * Sets a user's password and revokes all of their sessions.
 *   yarn user:set-password <email>
 * Reads the new password from NEW_PASSWORD, or generates a random one and prints it once.
 */
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';
import path from 'node:path';

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
    console.error('Usage: yarn user:set-password <email>   (optionally set NEW_PASSWORD)');
    process.exit(1);
}

const password = process.env.NEW_PASSWORD || randomBytes(12).toString('base64url');
if (password.length < 12) {
    console.error('Password must be at least 12 characters.');
    process.exit(1);
}

const db = new Database(process.env.DATABASE_PATH ?? path.join(process.cwd(), 'data', 'care4rare.db'));
db.pragma('foreign_keys = ON');

const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as { id: number } | undefined;
if (!user) {
    console.error(`No user with email ${email}`);
    process.exit(1);
}

db.transaction(() => {
    db.prepare("UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(
        bcrypt.hashSync(password, 12),
        user.id
    );
    db.prepare('DELETE FROM sessions WHERE user_id = ?').run(user.id);
})();

console.log(`Password updated for ${email}; existing sessions revoked.`);
if (!process.env.NEW_PASSWORD) console.log(`New password (shown once): ${password}`);
