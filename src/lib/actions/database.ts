'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { patients, type Patient } from '@/lib/db/schema';
import { requireRole, requireUser } from '@/lib/auth/session';
import { requirePatientAccess } from '@/lib/auth/access';
import { patientIdSchema, patientStatusSchema, toActionFailure } from '@/lib/auth/validation';
import { loadScopedPatients } from '@/lib/data/scoped';
import { audit } from '@/lib/audit';

/** Patients visible to the current user (database view). */
export async function getAllPatientsAction(): Promise<{ success: boolean; patients?: Patient[]; error?: string }> {
    try {
        return { success: true, patients: await loadScopedPatients(await requireUser()) };
    } catch (error) {
        return toActionFailure(error, 'Fetch patients');
    }
}

/** Status counts across the current user's patients. */
export async function getPatientStatsAction(): Promise<{
    success: boolean;
    stats?: { total: number; pending: number; ready: number; reviewed: number };
    error?: string;
}> {
    try {
        const rows = await loadScopedPatients(await requireUser());
        return {
            success: true,
            stats: {
                total: rows.length,
                pending: rows.filter((p) => p.status === 'Pending Analysis').length,
                ready: rows.filter((p) => p.status === 'Results Ready').length,
                reviewed: rows.filter((p) => p.status === 'Reviewed').length,
            },
        };
    } catch (error) {
        return toActionFailure(error, 'Fetch stats');
    }
}

export async function updatePatientStatusAction(
    id: string,
    status: 'Pending Analysis' | 'Results Ready' | 'Reviewed'
): Promise<{ success: boolean; error?: string }> {
    try {
        const patientId = patientIdSchema.parse(id);
        const nextStatus = patientStatusSchema.parse(status);
        const user = await requireRole('admin', 'clinician');
        await requirePatientAccess(patientId);

        const now = new Date().toISOString();
        await db
            .update(patients)
            .set({ status: nextStatus, lastUpdated: now, updatedAt: now })
            .where(eq(patients.id, patientId));

        await audit({
            action: 'patient.status_update',
            outcome: 'success',
            userId: user.id,
            patientId,
            detail: { status: nextStatus },
        });
        return { success: true };
    } catch (error) {
        return toActionFailure(error, 'Update patient status', 'Patient not found');
    }
}
