'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { patients, type Patient } from '@/lib/db/schema';
import { requireUser } from '@/lib/auth/session';
import { getPatientScope, requirePatientAccess } from '@/lib/auth/access';
import { patientIdSchema, toActionFailure } from '@/lib/auth/validation';
import { audit } from '@/lib/audit';

/** IDs of the patients the current user may access. */
export async function getPatientsAction(): Promise<{ success: boolean; patients?: string[]; error?: string }> {
    try {
        const scope = await getPatientScope(await requireUser());
        if (scope.kind === 'ids') return { success: true, patients: scope.ids };

        const rows = await db.select({ id: patients.id }).from(patients);
        return { success: true, patients: rows.map((r) => r.id) };
    } catch (error) {
        return toActionFailure(error, 'Fetch patients');
    }
}

export async function getPatientByIdAction(
    id: string
): Promise<{ success: boolean; patient?: Patient; error?: string }> {
    try {
        const patientId = patientIdSchema.parse(id);
        const user = await requirePatientAccess(patientId);

        const [patient] = await db.select().from(patients).where(eq(patients.id, patientId)).limit(1);
        if (!patient) return { success: false, error: 'Patient not found' };

        await audit({ action: 'patient.view', outcome: 'success', userId: user.id, patientId });
        return { success: true, patient };
    } catch (error) {
        return toActionFailure(error, 'Fetch patient', 'Patient not found');
    }
}
