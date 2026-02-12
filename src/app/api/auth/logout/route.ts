import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sessions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
    try {
        const sessionToken = request.cookies.get('session')?.value;

        if (sessionToken) {
            // Delete session from database using Drizzle
            await db.delete(sessions).where(eq(sessions.token, sessionToken));
        }

        // Create response and clear cookie
        const response = NextResponse.json({ success: true });
        response.cookies.delete('session');

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
    }
}
