'use server';

import { db } from '@/lib/db';
import { patients, reports } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { getSessionAction } from './auth';

/**
 * Get all patients from database (for database view)
 */
export async function getAllPatientsAction(): Promise<{ success: boolean; patients?: any[]; error?: string }> {
    try {
        const session = await getSessionAction();

        if (!session.success || !session.user) {
            return { success: false, error: 'Unauthorized' };
        }

        const allPatients = await db.select().from(patients);

        return { success: true, patients: allPatients };
    } catch (error) {
        console.error('Get all patients error:', error);
        return { success: false, error: 'Failed to fetch patients' };
    }
}

/**
 * Get patient statistics for dashboard
 */
export async function getPatientStatsAction(): Promise<{
    success: boolean;
    stats?: { total: number; pending: number; ready: number; reviewed: number };
    error?: string;
}> {
    try {
        const session = await getSessionAction();

        if (!session.success || !session.user) {
            return { success: false, error: 'Unauthorized' };
        }

        const allPatients = await db.select().from(patients);

        const stats = {
            total: allPatients.length,
            pending: allPatients.filter(p => p.status === 'Pending Analysis').length,
            ready: allPatients.filter(p => p.status === 'Results Ready').length,
            reviewed: allPatients.filter(p => p.status === 'Reviewed').length,
        };

        return { success: true, stats };
    } catch (error) {
        console.error('Get patient stats error:', error);
        return { success: false, error: 'Failed to fetch stats' };
    }
}

/**
 * Get full patient details including genetic data
 */
export async function getPatientDetailsAction(id: string): Promise<{ success: boolean; patient?: any; error?: string }> {
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

        return { success: true, patient };
    } catch (error) {
        console.error('Get patient details error:', error);
        return { success: false, error: 'Failed to fetch patient details' };
    }
}

/**
 * Update patient status
 */
export async function updatePatientStatusAction(
    id: string,
    status: 'Pending Analysis' | 'Results Ready' | 'Reviewed'
): Promise<{ success: boolean; error?: string }> {
    try {
        const session = await getSessionAction();

        if (!session.success || !session.user) {
            return { success: false, error: 'Unauthorized' };
        }

        await db
            .update(patients)
            .set({
                status,
                lastUpdated: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            })
            .where(eq(patients.id, id));

        return { success: true };
    } catch (error) {
        console.error('Update patient status error:', error);
        return { success: false, error: 'Failed to update patient status' };
    }
}
