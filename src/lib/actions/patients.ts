'use server';

import { db } from '@/lib/db';
import { patients, doctorPatientAssignments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSessionAction } from './auth';

/**
 * Get all patients assigned to the current doctor
 */
export async function getPatientsAction(): Promise<{ success: boolean; patients?: string[]; error?: string }> {
    try {
        const session = await getSessionAction();

        if (!session.success || !session.user) {
            return { success: false, error: 'Unauthorized' };
        }

        const doctorId = session.user.id;

        // Get assigned patients for this doctor
        const assignments = await db
            .select({
                patientId: doctorPatientAssignments.patientId,
            })
            .from(doctorPatientAssignments)
            .where(eq(doctorPatientAssignments.doctorId, doctorId));

        const patientIds = assignments.map((a) => a.patientId);

        return { success: true, patients: patientIds };
    } catch (error) {
        console.error('Fetch patients error:', error);
        return { success: false, error: 'Failed to fetch patients' };
    }
}

/**
 * Assign a patient to the current doctor
 */
export async function assignPatientAction(patientId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const session = await getSessionAction();

        if (!session.success || !session.user) {
            return { success: false, error: 'Unauthorized' };
        }

        const doctorId = session.user.id;

        if (!patientId) {
            return { success: false, error: 'Patient ID required' };
        }

        // Insert or ignore if already exists
        await db
            .insert(doctorPatientAssignments)
            .values({
                doctorId,
                patientId,
            })
            .onConflictDoNothing();

        return { success: true };
    } catch (error) {
        console.error('Assign patient error:', error);
        return { success: false, error: 'Failed to assign patient' };
    }
}

/**
 * Get a specific patient by ID
 */
export async function getPatientByIdAction(id: string): Promise<{ success: boolean; patient?: any; error?: string }> {
    try {
        const session = await getSessionAction();

        if (!session.success || !session.user) {
            return { success: false, error: 'Unauthorized' };
        }

        const [patient] = await db
            .select()
            .from(patients)
            .where(eq(patients.id, id))
            .limit(1);

        if (!patient) {
            return { success: false, error: 'Patient not found' };
        }

        return {
            success: true,
            patient,
        };
    } catch (error) {
        console.error('Get patient error:', error);
        return { success: false, error: 'Failed to fetch patient' };
    }
}
