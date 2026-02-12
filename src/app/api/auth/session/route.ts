import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { db } from '@/lib/db';
import { users, doctors, sessions } from '@/lib/db/schema';
import { eq, and, gt } from 'drizzle-orm';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export async function GET(request: NextRequest) {
    try {
        const sessionToken = request.cookies.get('session')?.value;

        if (!sessionToken) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Verify JWT token
        const { payload } = await jwtVerify(sessionToken, JWT_SECRET);

        // Check if session exists in database and is not expired
        const [session] = await db
            .select()
            .from(sessions)
            .where(
                and(
                    eq(sessions.token, sessionToken),
                    gt(sessions.expiresAt, new Date().toISOString())
                )
            )
            .limit(1);

        if (!session) {
            return NextResponse.json({ error: 'Session expired' }, { status: 401 });
        }

        // Try to get user from users table first (new auth system)
        if (payload.userId) {
            const [user] = await db
                .select({
                    id: users.id,
                    email: users.email,
                    name: users.name,
                    role: users.role,
                })
                .from(users)
                .where(eq(users.id, payload.userId as number))
                .limit(1);

            if (user) {
                return NextResponse.json({ doctor: user });
            }
        }

        // Fallback to doctors table for backward compatibility
        const [doctor] = await db
            .select({
                id: doctors.id,
                email: doctors.email,
                name: doctors.name,
                specialty: doctors.specialty,
            })
            .from(doctors)
            .where(eq(doctors.id, payload.doctorId as number))
            .limit(1);

        if (!doctor) {
            return NextResponse.json({ error: 'User not found' }, { status: 401 });
        }

        return NextResponse.json({ doctor });
    } catch (error) {
        console.error('Session check error:', error);
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }
}
