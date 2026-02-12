import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, doctors, sessions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Try to find user in users table first (new auth system)
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (user) {
            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.passwordHash);

            if (!isValidPassword) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            // Check if user is active
            if (!user.isActive) {
                return NextResponse.json({ error: 'Account is disabled' }, { status: 401 });
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
            });

            // Create response with httpOnly cookie
            const response = NextResponse.json({
                doctor: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            });

            response.cookies.set('session', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60, // 7 days
                path: '/',
            });

            return response;
        }

        // Fallback to doctors table for backward compatibility
        const [doctor] = await db.select().from(doctors).where(eq(doctors.email, email)).limit(1);

        if (!doctor) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, doctor.passwordHash);

        if (!isValidPassword) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
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
        });

        // Create response with httpOnly cookie
        const response = NextResponse.json({
            doctor: {
                id: doctor.id,
                email: doctor.email,
                name: doctor.name,
                specialty: doctor.specialty,
            },
        });

        response.cookies.set('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
