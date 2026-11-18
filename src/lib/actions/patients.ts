'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { patients, type Patient } from '@/lib/db/schema';
import { requireUser } from '@/lib/auth/session';
import { getPatientScope, requirePatientAccess } from '@/lib/auth/access';
import { patientIdSchema, toActionFailure } from '@/lib/auth/validation';
import { audit } from '@/lib/audit';
import { loadScopedPatients } from '@/lib/data/scoped';
import { phenotypeFit, type CaseSummary } from '@/lib/evidence';
import { runningPatientIds, settleDueAnalysisJobs } from '@/lib/analysis/jobs';

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

/** Case-list summaries (gene, status, classification, phenotype fit) for the current user's patients. */
export async function getCaseSummariesAction(): Promise<{ success: boolean; cases?: CaseSummary[]; error?: string }> {
    try {
        const rows = await loadScopedPatients(await requireUser());
        const running = runningPatientIds(rows.map((r) => r.id));
        const cases = rows
            .map<CaseSummary>((p) => ({
                id: p.id,
                gene: p.variantInfo?.gene ?? null,
                status: p.status ?? 'Pending Analysis',
                classification: p.variantInfo?.pathogenicity ?? null,
                fit: phenotypeFit(p.phenotypes, p.variantInfo?.affectedPhenotypes),
                analysisRunning: running.has(p.id),
            }))
            .sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }));
        return { success: true, cases };
    } catch (error) {
        return toActionFailure(error, 'Fetch case summaries');
    }
}

export async function getPatientByIdAction(
    id: string
): Promise<{ success: boolean; patient?: Patient; error?: string }> {
    try {
        const patientId = patientIdSchema.parse(id);
        const user = await requirePatientAccess(patientId);
        await settleDueAnalysisJobs([patientId]);

        const [patient] = await db.select().from(patients).where(eq(patients.id, patientId)).limit(1);
        if (!patient) return { success: false, error: 'Patient not found' };

        await audit({ action: 'patient.view', outcome: 'success', userId: user.id, patientId });
        return { success: true, patient };
    } catch (error) {
        return toActionFailure(error, 'Fetch patient', 'Patient not found');
    }
}
