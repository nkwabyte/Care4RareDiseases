import 'server-only';

import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { doctorPatientAssignments } from '@/lib/db/schema';
import { audit } from '@/lib/audit';
import { AuthError, requireUser, type AuthUser } from './session';

/**
 * Which patients a user may see.
 *  - admin:      every patient
 *  - clinician:  patients assigned to them
 *  - researcher / user: none (no identifiable patient data)
 */
export type PatientScope = { kind: 'all' } | { kind: 'ids'; ids: string[] };

export async function getPatientScope(user: AuthUser): Promise<PatientScope> {
    if (user.role === 'admin') return { kind: 'all' };
    if (user.role !== 'clinician') return { kind: 'ids', ids: [] };

    const rows = await db
        .select({ patientId: doctorPatientAssignments.patientId })
        .from(doctorPatientAssignments)
        .where(eq(doctorPatientAssignments.clinicianId, user.id));
    return { kind: 'ids', ids: rows.map((r) => r.patientId) };
}

export function scopeIncludes(scope: PatientScope, patientId: string): boolean {
    return scope.kind === 'all' || scope.ids.includes(patientId);
}

/**
 * Throws FORBIDDEN unless the current user may access the patient.
 * Callers should report FORBIDDEN as "not found" so patient IDs cannot be probed.
 */
export async function requirePatientAccess(patientId: string): Promise<AuthUser> {
    const user = await requireUser();
    if (!scopeIncludes(await getPatientScope(user), patientId)) {
        await audit({ action: 'patient.access_denied', outcome: 'denied', userId: user.id, patientId });
        throw new AuthError('FORBIDDEN');
    }
    return user;
}
