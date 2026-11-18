import 'server-only';

import { desc, inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import { patients, reports, type Patient, type Report } from '@/lib/db/schema';
import { getPatientScope } from '@/lib/auth/access';
import type { AuthUser } from '@/lib/auth/session';

/** Patients visible to the given user. */
export async function loadScopedPatients(user: AuthUser): Promise<Patient[]> {
    const scope = await getPatientScope(user);
    if (scope.kind === 'all') return db.select().from(patients);
    if (scope.ids.length === 0) return [];
    return db.select().from(patients).where(inArray(patients.id, scope.ids));
}

/** Reports for patients visible to the given user, newest first. */
export async function loadScopedReports(user: AuthUser): Promise<Report[]> {
    const scope = await getPatientScope(user);
    if (scope.kind === 'all') return db.select().from(reports).orderBy(desc(reports.dateGenerated));
    if (scope.ids.length === 0) return [];
    return db
        .select()
        .from(reports)
        .where(inArray(reports.patientId, scope.ids))
        .orderBy(desc(reports.dateGenerated));
}
