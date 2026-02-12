import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { db } from '@/lib/db';
import { sessions, doctorPatientAssignments } from '@/lib/db/schema';
import { eq, and, gt } from 'drizzle-orm';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

async function verifyAuth(request: NextRequest): Promise<number | null> {
    const sessionToken = request.cookies.get('session')?.value;

    if (!sessionToken) {
        return null;
    }

    try {
        const { payload } = await jwtVerify(sessionToken, JWT_SECRET);

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
            return null;
        }

        return payload.doctorId as number;
    } catch {
        return null;
    }
}

export async function GET(request: NextRequest) {
    try {
        const doctorId = await verifyAuth(request);

        if (!doctorId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get assigned patients for this doctor
        const assignments = await db
            .select({
                patientId: doctorPatientAssignments.patientId,
            })
            .from(doctorPatientAssignments)
            .where(eq(doctorPatientAssignments.doctorId, doctorId));

        const patients = assignments.map((a) => ({ id: a.patientId }));

        return NextResponse.json({ patients });
    } catch (error) {
        console.error('Fetch patients error:', error);
        return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const doctorId = await verifyAuth(request);

        if (!doctorId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { patientId } = await request.json();

        if (!patientId) {
            return NextResponse.json({ error: 'Patient ID required' }, { status: 400 });
        }

        // Insert or ignore if already exists
        await db
            .insert(doctorPatientAssignments)
            .values({
                doctorId,
                patientId,
            })
            .onConflictDoNothing();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Create patient assignment error:', error);
        return NextResponse.json({ error: 'Failed to create assignment' }, { status: 500 });
    }
}
