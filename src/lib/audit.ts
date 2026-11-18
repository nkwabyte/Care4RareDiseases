import 'server-only';

import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { auditEvents } from '@/lib/db/schema';

export type AuditAction =
    | 'auth.login'
    | 'auth.logout'
    | 'auth.locked'
    | 'auth.password_change'
    | 'auth.logout_all'
    | 'patient.view'
    | 'patient.status_update'
    | 'patient.access_denied'
    | 'report.create'
    | 'ai.report'
    | 'ai.chat'
    | 'ai.genotype_analysis'
    | 'analysis.start'
    | 'analysis.complete'
    | 'analysis.cancel';

/**
 * Client IP as reported by the reverse proxy. Only trustworthy when the app is deployed behind
 * a proxy that overwrites X-Forwarded-For; used for audit context and as a secondary rate-limit key.
 */
export async function getClientIp(): Promise<string | null> {
    const h = await headers();
    return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || null;
}

export async function audit(event: {
    action: AuditAction;
    outcome: 'success' | 'failure' | 'denied';
    userId?: number | null;
    patientId?: string | null;
    detail?: Record<string, unknown>;
}): Promise<void> {
    // Synchronous SQLite insert; failures propagate so PHI access is never silently unaudited.
    db.insert(auditEvents)
        .values({
            at: new Date().toISOString(),
            userId: event.userId ?? null,
            action: event.action,
            patientId: event.patientId ?? null,
            outcome: event.outcome,
            detail: event.detail ?? null,
            ip: await getClientIp(),
        })
        .run();
}
