'use server';

import { db } from '@/lib/db';
import { users, doctors, sessions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export type AuthUser = {
    id: number;
    email: string;
    name: string;
    role?: string;
    specialty?: string;
};

export type AuthResult = {
    success: boolean;
    user?: AuthUser;
    error?: string;
};

/**
 * Login action - authenticates user and creates session
 */
export async function loginAction(email: string, password: string): Promise<AuthResult> {
    try {
        if (!email || !password) {
            return { success: false, error: 'Email and password are required' };
        }

        // Try to find user in users table first (new auth system)
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (user) {
            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.passwordHash);

            if (!isValidPassword) {
                return { success: false, error: 'Invalid credentials' };
            }

            // Check if user is active
            if (!user.isActive) {
                return { success: false, error: 'Account is disabled' };
            }

            // Create JWT token
            const token = await new SignJWT({ userId: user.id, email: user.email, role: user.role })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('7d')
                .sign(JWT_SECRET);

            // Store session in database
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
            await db.insert(sessions).values({
                userId: user.id,
                doctorId: null,
                token,
                expiresAt: expiresAt.toISOString(),
                createdAt: new Date().toISOString(),
            });

            // Set httpOnly cookie
            (await cookies()).set('session', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60, // 7 days
                path: '/',
            });

            return {
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            };
        }

        // Fallback to doctors table for backward compatibility
        const [doctor] = await db.select().from(doctors).where(eq(doctors.email, email)).limit(1);

        if (!doctor) {
            return { success: false, error: 'Invalid credentials' };
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, doctor.passwordHash);

        if (!isValidPassword) {
            return { success: false, error: 'Invalid credentials' };
        }

        // Create JWT token
        const token = await new SignJWT({ doctorId: doctor.id, email: doctor.email })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7d')
            .sign(JWT_SECRET);

        // Store session in database
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        await db.insert(sessions).values({
            userId: null,
            doctorId: doctor.id,
            token,
            expiresAt: expiresAt.toISOString(),
            createdAt: new Date().toISOString(),
        });

        // Set httpOnly cookie
        (await cookies()).set('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return {
            success: true,
            user: {
                id: doctor.id,
                email: doctor.email,
                name: doctor.name,
                specialty: doctor.specialty || undefined,
            },
        };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Login failed' };
    }
}

/**
 * Logout action - deletes session and clears cookie
 */
export async function logoutAction(): Promise<{ success: boolean }> {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('session')?.value;

        if (sessionToken) {
            // Delete session from database
            await db.delete(sessions).where(eq(sessions.token, sessionToken));
        }

        // Clear cookie
        cookieStore.delete('session');

        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false };
    }
}

/**
 * Get current session - validates token and returns user info
 */
export async function getSessionAction(): Promise<AuthResult> {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('session')?.value;

        if (!sessionToken) {
            return { success: false, error: 'No session found' };
        }

        // Verify JWT
        const { payload } = await jwtVerify(sessionToken, JWT_SECRET);

        // Get session from database
        const [session] = await db
            .select()
            .from(sessions)
            .where(eq(sessions.token, sessionToken))
            .limit(1);

        if (!session) {
            return { success: false, error: 'Invalid session' };
        }

        // Check if session is expired
        if (new Date(session.expiresAt) < new Date()) {
            await db.delete(sessions).where(eq(sessions.token, sessionToken));
            cookieStore.delete('session');
            return { success: false, error: 'Session expired' };
        }

        // Get user info
        if (session.userId) {
            const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
            if (user) {
                return {
                    success: true,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                    },
                };
            }
        } else if (session.doctorId) {
            const [doctor] = await db
                .select()
                .from(doctors)
                .where(eq(doctors.id, session.doctorId))
                .limit(1);
            if (doctor) {
                return {
                    success: true,
                    user: {
                        id: doctor.id,
                        email: doctor.email,
                        name: doctor.name,
                        specialty: doctor.specialty || undefined,
                    },
                };
            }
        }

        return { success: false, error: 'User not found' };
    } catch (error) {
        console.error('Get session error:', error);
        return { success: false, error: 'Invalid session' };
    }
}
