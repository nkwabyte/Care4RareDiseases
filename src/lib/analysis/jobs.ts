import 'server-only';

import { and, desc, eq, inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import { analysisJobs, auditEvents, patients, type AnalysisJob } from '@/lib/db/schema';
import { getEngine } from './engine';

export type AnalysisSnapshot = {
    jobId: number;
    status: AnalysisJob['status'];
    simulated: boolean;
    startedAt: string;
    expectedFinishAt: string;
    finishedAt: string | null;
    /** Server time when the snapshot was taken, so clients can correct for clock skew. */
    serverNow: string;
    /** 0–1. Running jobs stop at 0.99 until the engine reports completion. */
    progress: number;
    stages: { label: string; weight: number }[];
    stageIndex: number;
    error: string | null;
};

const finishTime = (job: AnalysisJob) => Date.parse(job.startedAt) + job.expectedDurationMs;

/**
 * Marks running jobs whose expected duration has elapsed as completed and moves their case
 * from "Pending Analysis" to "Results Ready". Cheap: only running jobs are read.
 */
export async function settleDueAnalysisJobs(patientIds?: string[]): Promise<void> {
    const where = patientIds
        ? and(eq(analysisJobs.status, 'running'), inArray(analysisJobs.patientId, patientIds))
        : eq(analysisJobs.status, 'running');
    if (patientIds && patientIds.length === 0) return;

    const now = Date.now();
    const due = db.select().from(analysisJobs).where(where).all().filter((j) => finishTime(j) <= now);

    for (const job of due) {
        const [patient] = db.select().from(patients).where(eq(patients.id, job.patientId)).limit(1).all();
        if (!patient) continue;
        const result = await getEngine(job.engine).complete(patient);
        const finishedAt = new Date(finishTime(job)).toISOString();

        db.transaction((tx) => {
            const updated = tx
                .update(analysisJobs)
                .set({ status: 'completed', finishedAt, result })
                .where(and(eq(analysisJobs.id, job.id), eq(analysisJobs.status, 'running')))
                .run();
            if (updated.changes === 0) return; // settled concurrently or cancelled

            if (patient.status === 'Pending Analysis') {
                tx.update(patients)
                    .set({ status: 'Results Ready', lastUpdated: finishedAt, updatedAt: finishedAt })
                    .where(eq(patients.id, job.patientId))
                    .run();
            }
            tx.insert(auditEvents)
                .values({
                    at: new Date().toISOString(),
                    userId: job.requestedBy,
                    action: 'analysis.complete',
                    patientId: job.patientId,
                    outcome: 'success',
                    detail: { jobId: job.id, engine: job.engine },
                })
                .run();
        });
    }
}

export function latestJob(patientId: string): AnalysisJob | undefined {
    return db
        .select()
        .from(analysisJobs)
        .where(eq(analysisJobs.patientId, patientId))
        .orderBy(desc(analysisJobs.id))
        .limit(1)
        .all()[0];
}

export function runningPatientIds(patientIds: string[]): Set<string> {
    if (patientIds.length === 0) return new Set();
    const rows = db
        .select({ patientId: analysisJobs.patientId })
        .from(analysisJobs)
        .where(and(eq(analysisJobs.status, 'running'), inArray(analysisJobs.patientId, patientIds)))
        .all();
    return new Set(rows.map((r) => r.patientId));
}

export function snapshot(job: AnalysisJob): AnalysisSnapshot {
    const engine = getEngine(job.engine);
    const now = Date.now();
    const done = job.status === 'completed';
    const raw = done ? 1 : Math.min(0.99, Math.max(0, (now - Date.parse(job.startedAt)) / job.expectedDurationMs));

    let stageIndex = engine.stages.length - 1;
    let cumulative = 0;
    for (let i = 0; i < engine.stages.length; i++) {
        cumulative += engine.stages[i].weight;
        if (raw < cumulative) {
            stageIndex = i;
            break;
        }
    }

    return {
        jobId: job.id,
        status: job.status,
        simulated: engine.simulated,
        startedAt: job.startedAt,
        expectedFinishAt: new Date(finishTime(job)).toISOString(),
        finishedAt: job.finishedAt,
        serverNow: new Date(now).toISOString(),
        progress: raw,
        stages: engine.stages.map((s) => ({ label: s.label, weight: s.weight })),
        stageIndex,
        error: job.error,
    };
}
