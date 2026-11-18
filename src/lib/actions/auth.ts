'use server';

import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import {
    createSession,
    destroySession,
    getCurrentUser,
    requireUser,
    revokeUserSessions,
    SESSION_IDLE_TIMEOUT_MS,
    SESSION_MAX_AGE_MS,
    type AuthUser,
} from '@/lib/auth/session';
import { checkLoginAllowed, recordLoginFailure, recordLoginSuccess } from '@/lib/auth/rate-limit';
import { audit, getClientIp } from '@/lib/audit';
import { toActionFailure } from '@/lib/auth/validation';

export type { AuthUser };

export type AuthResult = {
    success: boolean;
    user?: AuthUser;
    error?: string;
};

const credentialsSchema = z.object({
    email: z.string().trim().toLowerCase().email().max(254),
    password: z.string().min(1).max(256),
});

/** Compared against when the email is unknown, so response time does not reveal which accounts exist. */
const DUMMY_HASH = bcrypt.hashSync('timing-equaliser', 10);
const INVALID: AuthResult = { success: false, error: 'Invalid email or password' };

export async function loginAction(email: string, password: string): Promise<AuthResult> {
    const parsed = credentialsSchema.safeParse({ email, password });
    if (!parsed.success) return INVALID;

    const { email: normalisedEmail } = parsed.data;
    try {
        const waitMs = checkLoginAllowed(normalisedEmail, await getClientIp());
        if (waitMs) {
            await audit({ action: 'auth.locked', outcome: 'denied', detail: { email: normalisedEmail } });
            return {
                success: false,
                error: `Too many sign-in attempts. Try again in ${Math.ceil(waitMs / 60_000)} minute(s).`,
            };
        }

        const [user] = await db.select().from(users).where(eq(users.email, normalisedEmail)).limit(1);
        const passwordOk = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? DUMMY_HASH);

        if (!user || !passwordOk || !user.isActive) {
            const locked = recordLoginFailure(normalisedEmail);
            await audit({
                action: 'auth.login',
                outcome: 'failure',
                userId: user?.id,
                detail: { email: normalisedEmail, ...(locked ? { lockedOut: true } : {}) },
            });
            return INVALID;
        }

        recordLoginSuccess(normalisedEmail);
        await createSession(user.id);
        await audit({ action: 'auth.login', outcome: 'success', userId: user.id });
        return {
            success: true,
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
        };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Login failed' };
    }
}

export async function logoutAction(): Promise<{ success: boolean }> {
    try {
        const user = await getCurrentUser();
        await destroySession();
        if (user) await audit({ action: 'auth.logout', outcome: 'success', userId: user.id });
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false };
    }
}

export async function getSessionAction(): Promise<AuthResult> {
    try {
        const user = await getCurrentUser();
        return user ? { success: true, user } : { success: false, error: 'Not authenticated' };
    } catch (error) {
        console.error('Get session error:', error);
        return { success: false, error: 'Not authenticated' };
    }
}

/** Security policy actually enforced by the server (shown read-only in Settings). */
export async function getSecurityPolicyAction(): Promise<{
    success: boolean;
    policy?: { sessionMaxHours: number; idleTimeoutMinutes: number; maxFailedLogins: number; minPasswordLength: number };
    error?: string;
}> {
    try {
        await requireUser();
        return {
            success: true,
            policy: {
                sessionMaxHours: SESSION_MAX_AGE_MS / 3_600_000,
                idleTimeoutMinutes: SESSION_IDLE_TIMEOUT_MS / 60_000,
                maxFailedLogins: 5,
                minPasswordLength: MIN_PASSWORD_LENGTH,
            },
        };
    } catch (error) {
        return toActionFailure(error, 'Fetch security policy');
    }
}

const MIN_PASSWORD_LENGTH = 12;
const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Enter your current password').max(256),
        newPassword: z
            .string()
            .min(MIN_PASSWORD_LENGTH, `New password must be at least ${MIN_PASSWORD_LENGTH} characters`)
            .max(256, 'New password is too long'),
    })
    .refine((v) => v.currentPassword !== v.newPassword, {
        message: 'New password must differ from the current one',
    });

/** Changes the current user's password and signs out every other session. */
export async function changePasswordAction(
    currentPassword: string,
    newPassword: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const input = changePasswordSchema.parse({ currentPassword, newPassword });
        const sessionUser = await requireUser();

        const waitMs = checkLoginAllowed(sessionUser.email, await getClientIp());
        if (waitMs) {
            return { success: false, error: `Too many attempts. Try again in ${Math.ceil(waitMs / 60_000)} minute(s).` };
        }

        const [user] = await db.select().from(users).where(eq(users.id, sessionUser.id)).limit(1);
        if (!user || !(await bcrypt.compare(input.currentPassword, user.passwordHash))) {
            recordLoginFailure(sessionUser.email);
            await audit({ action: 'auth.password_change', outcome: 'failure', userId: sessionUser.id });
            return { success: false, error: 'Current password is incorrect' };
        }

        await db
            .update(users)
            .set({ passwordHash: await bcrypt.hash(input.newPassword, 12), updatedAt: new Date().toISOString() })
            .where(eq(users.id, user.id));
        await revokeUserSessions(user.id);
        await createSession(user.id);
        await audit({ action: 'auth.password_change', outcome: 'success', userId: user.id });
        return { success: true };
    } catch (error) {
        return toActionFailure(error, 'Change password');
    }
}

/** Ends every session for the current user, including this one. */
export async function signOutEverywhereAction(): Promise<{ success: boolean; error?: string }> {
    try {
        const user = await requireUser();
        await revokeUserSessions(user.id);
        await destroySession();
        await audit({ action: 'auth.logout_all', outcome: 'success', userId: user.id });
        return { success: true };
    } catch (error) {
        return toActionFailure(error, 'Sign out everywhere');
    }
}
