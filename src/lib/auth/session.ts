import 'server-only';

import { createHash, randomBytes } from 'node:crypto';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { and, eq, lt, or } from 'drizzle-orm';
import { db } from '@/lib/db';
import { sessions, users } from '@/lib/db/schema';

/** Absolute session lifetime. */
export const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000;
/** Session ends after this long without activity. */
export const SESSION_IDLE_TIMEOUT_MS = 30 * 60 * 1000;
/** Avoid a DB write on every request; refresh last-seen at most this often. */
const TOUCH_INTERVAL_MS = 60 * 1000;

const isProd = process.env.NODE_ENV === 'production';
/** `__Host-` prefix requires Secure, so it is only usable over HTTPS (production). */
export const SESSION_COOKIE = isProd ? '__Host-c4r_session' : 'c4r_session';

export type Role = 'admin' | 'clinician' | 'researcher' | 'user';

export type AuthUser = {
    id: number;
    email: string;
    name: string;
    role: Role;
};

export class AuthError extends Error {
    constructor(public readonly code: 'UNAUTHENTICATED' | 'FORBIDDEN') {
        super(code);
    }
}

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

export async function createSession(userId: number): Promise<void> {
    const token = randomBytes(32).toString('base64url');
    const now = Date.now();
    const expiresAt = new Date(now + SESSION_MAX_AGE_MS);

    // Opportunistically clear this user's dead sessions.
    await db
        .delete(sessions)
        .where(and(eq(sessions.userId, userId), lt(sessions.expiresAt, new Date(now).toISOString())));

    await db.insert(sessions).values({
        userId,
        tokenHash: hashToken(token),
        expiresAt: expiresAt.toISOString(),
        lastSeenAt: new Date(now).toISOString(),
        createdAt: new Date(now).toISOString(),
    });

    (await cookies()).set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'strict',
        path: '/',
        expires: expiresAt,
    });
}

export async function destroySession(): Promise<void> {
    const store = await cookies();
    const token = store.get(SESSION_COOKIE)?.value;
    if (token) {
        await db.delete(sessions).where(eq(sessions.tokenHash, hashToken(token)));
    }
    store.delete(SESSION_COOKIE);
}

/**
 * Resolves the signed-in user from the session cookie, or null.
 * Memoised per request so multiple checks in one action cost one lookup.
 */
export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const tokenHash = hashToken(token);
    const [row] = await db
        .select({
            sessionId: sessions.id,
            expiresAt: sessions.expiresAt,
            lastSeenAt: sessions.lastSeenAt,
            id: users.id,
            email: users.email,
            name: users.name,
            role: users.role,
            isActive: users.isActive,
        })
        .from(sessions)
        .innerJoin(users, eq(users.id, sessions.userId))
        .where(eq(sessions.tokenHash, tokenHash))
        .limit(1);

    if (!row) return null;

    const now = Date.now();
    const expired =
        Date.parse(row.expiresAt) <= now || Date.parse(row.lastSeenAt) + SESSION_IDLE_TIMEOUT_MS <= now;

    if (expired || !row.isActive) {
        await db.delete(sessions).where(eq(sessions.id, row.sessionId));
        return null;
    }

    if (now - Date.parse(row.lastSeenAt) > TOUCH_INTERVAL_MS) {
        await db
            .update(sessions)
            .set({ lastSeenAt: new Date(now).toISOString() })
            .where(eq(sessions.id, row.sessionId));
    }

    return { id: row.id, email: row.email, name: row.name, role: row.role };
});

export async function requireUser(): Promise<AuthUser> {
    const user = await getCurrentUser();
    if (!user) throw new AuthError('UNAUTHENTICATED');
    return user;
}

export async function requireRole(...roles: Role[]): Promise<AuthUser> {
    const user = await requireUser();
    if (!roles.includes(user.role)) throw new AuthError('FORBIDDEN');
    return user;
}

/** Deletes every session of a user (e.g. after deactivation or password change). */
export async function revokeUserSessions(userId: number): Promise<void> {
    await db.delete(sessions).where(eq(sessions.userId, userId));
}

/** Housekeeping: remove sessions that are past their absolute or idle expiry. */
export async function purgeExpiredSessions(): Promise<void> {
    const now = Date.now();
    await db
        .delete(sessions)
        .where(
            or(
                lt(sessions.expiresAt, new Date(now).toISOString()),
                lt(sessions.lastSeenAt, new Date(now - SESSION_IDLE_TIMEOUT_MS).toISOString())
            )
        );
}
