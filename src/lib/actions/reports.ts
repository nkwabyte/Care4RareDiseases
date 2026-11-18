'use server';

import { and, eq, like } from 'drizzle-orm';
import { db } from '@/lib/db';
import { patients, reports, type Report } from '@/lib/db/schema';
import { requireRole, requireUser } from '@/lib/auth/session';
import { getPatientScope, requirePatientAccess, scopeIncludes } from '@/lib/auth/access';
import { patientIdSchema, reportIdSchema, toActionFailure } from '@/lib/auth/validation';
import { loadScopedReports } from '@/lib/data/scoped';
import { audit } from '@/lib/audit';

export async function getReportsAction(): Promise<{ success: boolean; reports?: Report[]; error?: string }> {
    try {
        return { success: true, reports: await loadScopedReports(await requireUser()) };
    } catch (error) {
        return toActionFailure(error, 'Fetch reports');
    }
}

export async function getReportByIdAction(id: string): Promise<{ success: boolean; report?: Report; error?: string }> {
    try {
        const reportId = reportIdSchema.parse(id);
        const user = await requireUser();

        const [report] = await db.select().from(reports).where(eq(reports.id, reportId)).limit(1);
        if (!report || !scopeIncludes(await getPatientScope(user), report.patientId)) {
            return { success: false, error: 'Report not found' };
        }
        return { success: true, report };
    } catch (error) {
        return toActionFailure(error, 'Fetch report', 'Report not found');
    }
}

export async function getPatientReportsAction(
    id: string
): Promise<{ success: boolean; reports?: Report[]; error?: string }> {
    try {
        const patientId = patientIdSchema.parse(id);
        await requirePatientAccess(patientId);
        return {
            success: true,
            reports: await db.select().from(reports).where(eq(reports.patientId, patientId)),
        };
    } catch (error) {
        return toActionFailure(error, 'Fetch patient reports', 'Patient not found');
    }
}

/** Records a generated report for a patient. Report IDs are allocated per year inside a transaction. */
export async function generateReportAction(
    id: string
): Promise<{ success: boolean; reportId?: string; error?: string }> {
    try {
        const patientId = patientIdSchema.parse(id);
        const user = await requireRole('admin', 'clinician');
        await requirePatientAccess(patientId);

        const reportId = db.transaction((tx) => {
            const [patient] = tx.select({ id: patients.id }).from(patients).where(eq(patients.id, patientId)).all();
            if (!patient) return null;

            const prefix = `RPT-${new Date().getFullYear()}-`;
            const existing = tx
                .select({ id: reports.id })
                .from(reports)
                .where(and(like(reports.id, `${prefix}%`)))
                .all();
            const next = existing.reduce((max, r) => Math.max(max, Number(r.id.slice(prefix.length)) || 0), 0) + 1;
            const newId = `${prefix}${String(next).padStart(3, '0')}`;

            tx.insert(reports)
                .values({
                    id: newId,
                    patientId,
                    patientName: patient.id,
                    dateGenerated: new Date().toISOString(),
                    generatedBy: user.name,
                })
                .run();
            return newId;
        });

        if (!reportId) return { success: false, error: 'Patient not found' };
        await audit({ action: 'report.create', outcome: 'success', userId: user.id, patientId, detail: { reportId } });
        return { success: true, reportId };
    } catch (error) {
        return toActionFailure(error, 'Generate report', 'Patient not found');
    }
}
