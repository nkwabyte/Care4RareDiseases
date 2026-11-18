'use server';

import { and, desc, eq, inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import { auditEvents, users } from '@/lib/db/schema';
import { requireUser } from '@/lib/auth/session';
import { getPatientScope } from '@/lib/auth/access';
import { toActionFailure } from '@/lib/auth/validation';
import { loadScopedPatients, loadScopedReports } from '@/lib/data/scoped';

export type DashboardData = {
    stats: { total: number; pending: number; ready: number; reviewed: number; reportsThisMonth: number };
    reportsByMonth: { month: string; label: string; reports: number }[];
    pathogenicity: { classification: string; count: number }[];
    pendingCases: { patientId: string; age: number; sex: string; gene: string | null; daysWaiting: number }[];
    recentActivity: { id: string; kind: 'report' | 'status' | 'ai'; patientId: string; message: string; at: string }[];
};

const ACTIVITY_ACTIONS = ['patient.status_update', 'ai.report', 'ai.genotype_analysis', 'report.create'] as const;

const monthKey = (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;

/** Parses both ISO timestamps and SQLite "YYYY-MM-DD HH:MM:SS" (UTC) values. */
const parseDbDate = (s: string | null | undefined) => (s ? new Date(s.includes('T') ? s : `${s.replace(' ', 'T')}Z`) : null);

export async function getDashboardAction(): Promise<{ success: boolean; data?: DashboardData; error?: string }> {
    try {
        const user = await requireUser();
        const [patientRows, reportRows, scope] = await Promise.all([
            loadScopedPatients(user),
            loadScopedReports(user),
            getPatientScope(user),
        ]);
        const now = new Date();

        // Reports per month, last 12 months (oldest first).
        const months = Array.from({ length: 12 }, (_, i) => {
            const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (11 - i), 1));
            return { month: monthKey(d), label: d.toLocaleString('en', { month: 'short', timeZone: 'UTC' }), reports: 0 };
        });
        const byMonth = new Map(months.map((m) => [m.month, m]));
        for (const r of reportRows) {
            const d = parseDbDate(r.dateGenerated);
            if (d) {
                const bucket = byMonth.get(monthKey(d));
                if (bucket) bucket.reports++;
            }
        }

        const pathogenicityCounts = new Map<string, number>();
        for (const p of patientRows) {
            const c = p.variantInfo?.pathogenicity?.trim() || 'Not classified';
            pathogenicityCounts.set(c, (pathogenicityCounts.get(c) ?? 0) + 1);
        }

        const pendingCases = patientRows
            .filter((p) => p.status === 'Pending Analysis')
            .map((p) => {
                const since = parseDbDate(p.lastUpdated ?? p.createdAt);
                return {
                    patientId: p.id,
                    age: p.age,
                    sex: p.sex,
                    gene: p.variantInfo?.gene ?? null,
                    daysWaiting: since ? Math.max(0, Math.floor((now.getTime() - since.getTime()) / 86_400_000)) : 0,
                };
            })
            .sort((a, b) => b.daysWaiting - a.daysWaiting)
            .slice(0, 5);

        // Activity: audit events on in-scope patients, plus historical report records.
        const auditFilter =
            scope.kind === 'all'
                ? inArray(auditEvents.action, [...ACTIVITY_ACTIONS])
                : scope.ids.length
                  ? and(inArray(auditEvents.action, [...ACTIVITY_ACTIONS]), inArray(auditEvents.patientId, scope.ids))
                  : undefined;
        const auditRows = auditFilter
            ? await db
                  .select({
                      id: auditEvents.id,
                      at: auditEvents.at,
                      action: auditEvents.action,
                      patientId: auditEvents.patientId,
                      detail: auditEvents.detail,
                      actor: users.name,
                  })
                  .from(auditEvents)
                  .leftJoin(users, eq(users.id, auditEvents.userId))
                  .where(and(auditFilter, eq(auditEvents.outcome, 'success')))
                  .orderBy(desc(auditEvents.at))
                  .limit(10)
            : [];

        const activity: DashboardData['recentActivity'] = [
            ...auditRows
                .filter((a) => a.action !== 'report.create') // covered by the reports table below
                .map((a) => ({
                    id: `audit-${a.id}`,
                    kind: (a.action === 'patient.status_update' ? 'status' : 'ai') as 'status' | 'ai',
                    patientId: a.patientId ?? '',
                    at: a.at,
                    message:
                        a.action === 'patient.status_update'
                            ? `${a.patientId} marked “${String((a.detail as { status?: string } | null)?.status ?? 'updated')}”${a.actor ? ` by ${a.actor}` : ''}`
                            : `AI ${a.action === 'ai.report' ? 'report' : 'genotype–phenotype analysis'} generated for ${a.patientId}${a.actor ? ` by ${a.actor}` : ''}`,
                })),
            ...reportRows.map((r) => ({
                id: `report-${r.id}`,
                kind: 'report' as const,
                patientId: r.patientId,
                at: parseDbDate(r.dateGenerated)?.toISOString() ?? r.dateGenerated,
                message: `Report ${r.id} generated for ${r.patientId} by ${r.generatedBy}`,
            })),
        ]
            .sort((a, b) => b.at.localeCompare(a.at))
            .slice(0, 6);

        const thisMonth = monthKey(now);
        return {
            success: true,
            data: {
                stats: {
                    total: patientRows.length,
                    pending: patientRows.filter((p) => p.status === 'Pending Analysis').length,
                    ready: patientRows.filter((p) => p.status === 'Results Ready').length,
                    reviewed: patientRows.filter((p) => p.status === 'Reviewed').length,
                    reportsThisMonth: byMonth.get(thisMonth)?.reports ?? 0,
                },
                reportsByMonth: months,
                pathogenicity: [...pathogenicityCounts]
                    .map(([classification, count]) => ({ classification, count }))
                    .sort((a, b) => b.count - a.count),
                pendingCases,
                recentActivity: activity,
            },
        };
    } catch (error) {
        return toActionFailure(error, 'Load dashboard');
    }
}
