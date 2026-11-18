'use server';

import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { analysisJobs, patients } from '@/lib/db/schema';
import { requireRole } from '@/lib/auth/session';
import { requirePatientAccess } from '@/lib/auth/access';
import { patientIdSchema, toActionFailure } from '@/lib/auth/validation';
import { audit } from '@/lib/audit';
import { DEFAULT_ENGINE } from '@/lib/analysis/engine';
import { latestJob, settleDueAnalysisJobs, snapshot, type AnalysisSnapshot } from '@/lib/analysis/jobs';

type Result = { success: boolean; job?: AnalysisSnapshot | null; error?: string };

/** Latest analysis run for a case (settling it first if its time is up). */
export async function getAnalysisStatusAction(id: string): Promise<Result> {
    try {
        const patientId = patientIdSchema.parse(id);
        await requirePatientAccess(patientId);
        await settleDueAnalysisJobs([patientId]);
        const job = latestJob(patientId);
        return { success: true, job: job ? snapshot(job) : null };
    } catch (error) {
        return toActionFailure(error, 'Fetch analysis status', 'Patient not found');
    }
}

/** Starts an analysis run. If one is already running for the case, returns it instead. */
export async function startAnalysisAction(id: string): Promise<Result> {
    try {
        const patientId = patientIdSchema.parse(id);
        const user = await requireRole('admin', 'clinician');
        await requirePatientAccess(patientId);
        await settleDueAnalysisJobs([patientId]);

        const [patient] = db.select().from(patients).where(eq(patients.id, patientId)).limit(1).all();
        if (!patient) return { success: false, error: 'Patient not found' };

        const { expectedDurationMs } = DEFAULT_ENGINE.plan(patient);
        const { job, created } = db.transaction((tx) => {
            const running = tx
                .select()
                .from(analysisJobs)
                .where(and(eq(analysisJobs.patientId, patientId), eq(analysisJobs.status, 'running')))
                .limit(1)
                .all()[0];
            if (running) return { job: running, created: false };
            const inserted = tx
                .insert(analysisJobs)
                .values({
                    patientId,
                    requestedBy: user.id,
                    engine: DEFAULT_ENGINE.id,
                    status: 'running',
                    startedAt: new Date().toISOString(),
                    expectedDurationMs,
                })
                .returning()
                .all()[0];
            return { job: inserted, created: true };
        });

        if (created) {
            await audit({
                action: 'analysis.start',
                outcome: 'success',
                userId: user.id,
                patientId,
                detail: { jobId: job.id, engine: job.engine, expectedDurationMs },
            });
        }
        return { success: true, job: snapshot(job) };
    } catch (error) {
        return toActionFailure(error, 'Start analysis', 'Patient not found');
    }
}

/** Cancels the running analysis for a case, if any. */
export async function cancelAnalysisAction(id: string): Promise<Result> {
    try {
        const patientId = patientIdSchema.parse(id);
        const user = await requireRole('admin', 'clinician');
        await requirePatientAccess(patientId);
        await settleDueAnalysisJobs([patientId]);

        const now = new Date().toISOString();
        const cancelled = db
            .update(analysisJobs)
            .set({ status: 'cancelled', finishedAt: now })
            .where(and(eq(analysisJobs.patientId, patientId), eq(analysisJobs.status, 'running')))
            .returning()
            .all()[0];

        if (cancelled) {
            await audit({
                action: 'analysis.cancel',
                outcome: 'success',
                userId: user.id,
                patientId,
                detail: { jobId: cancelled.id },
            });
        }
        const job = latestJob(patientId);
        return { success: true, job: job ? snapshot(job) : null };
    } catch (error) {
        return toActionFailure(error, 'Cancel analysis', 'Patient not found');
    }
}
