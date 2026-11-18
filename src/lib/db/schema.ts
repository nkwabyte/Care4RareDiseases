import { sqliteTable, text, integer, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Users table - for authentication and authorization
export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    name: text('name').notNull(),
    role: text('role', { enum: ['admin', 'clinician', 'researcher', 'user'] }).notNull().default('user'),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Sessions - opaque random token in the cookie; only its SHA-256 hash is stored.
export const sessions = sqliteTable('sessions', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull().unique(),
    expiresAt: text('expires_at').notNull(),
    lastSeenAt: text('last_seen_at').notNull(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
}, (t) => [index('sessions_user_idx').on(t.userId)]);

// Clinician <-> patient assignments (column kept as doctor_id for continuity; references users.id)
export const doctorPatientAssignments = sqliteTable('doctor_patient_assignments', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    clinicianId: integer('doctor_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    patientId: text('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
    assignedAt: text('assigned_at').default(sql`CURRENT_TIMESTAMP`),
}, (t) => [uniqueIndex('assignment_clinician_patient_uq').on(t.clinicianId, t.patientId)]);

// Patients table - stores all patient data
export const patients = sqliteTable('patients', {
    id: text('id').primaryKey(), // e.g., 'UDN-P4'
    age: integer('age').notNull(),
    sex: text('sex', { enum: ['male', 'female', 'other'] }).notNull(),
    genomicFile: text('genomic_file'),
    clinicalNotes: text('clinical_notes'),

    // Status tracking
    status: text('status', { enum: ['Pending Analysis', 'Results Ready', 'Reviewed'] }).default('Pending Analysis'),
    lastUpdated: text('last_updated').default(sql`CURRENT_TIMESTAMP`),
    assignedClinician: text('assigned_clinician'),

    // Complex data stored as JSON
    phenotypes: text('phenotypes', { mode: 'json' }).$type<string[]>(),
    variantInfo: text('variant_info', { mode: 'json' }).$type<{
        gene: string;
        chromosome: string;
        position: string;
        cdnaChange: string;
        proteinChange: string;
        variantType: string;
        zygosity: string;
        pathogenicity: string;
        affectedPhenotypes: string[];
        inheritance: string;
    } | null>(),
    knowledgeGraph: text('knowledge_graph', { mode: 'json' }).$type<{
        nodes: Array<{
            id: string;
            label: string;
            x: number;
            y: number;
            type: 'disease' | 'gene-primary' | 'gene-secondary' | 'gene-tertiary' | 'phenotype';
            size: number;
        }>;
        edges: Array<{
            from: string;
            to: string;
            strength: 'strong' | 'medium' | 'weak';
        }>;
    } | null>(),

    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Reports table
export const reports = sqliteTable('reports', {
    id: text('id').primaryKey(), // e.g., 'RPT-2025-001'
    patientId: text('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
    patientName: text('patient_name').notNull(),
    dateGenerated: text('date_generated').notNull(),
    generatedBy: text('generated_by').notNull(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Type exports for use in application
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type DoctorPatientAssignment = typeof doctorPatientAssignments.$inferSelect;
export type NewDoctorPatientAssignment = typeof doctorPatientAssignments.$inferInsert;

export type Patient = typeof patients.$inferSelect;
export type NewPatient = typeof patients.$inferInsert;

export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;

// Append-only audit trail of security-relevant and PHI-access events.
// patient_id intentionally has no FK so history survives patient deletion.
export const auditEvents = sqliteTable('audit_events', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    at: text('at').notNull(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
    action: text('action').notNull(),
    patientId: text('patient_id'),
    outcome: text('outcome', { enum: ['success', 'failure', 'denied'] }).notNull(),
    detail: text('detail', { mode: 'json' }).$type<Record<string, unknown> | null>(),
    ip: text('ip'),
}, (t) => [
    index('audit_at_idx').on(t.at),
    index('audit_user_idx').on(t.userId),
    index('audit_patient_idx').on(t.patientId),
]);

export type AuditEvent = typeof auditEvents.$inferSelect;

// Genotype–phenotype analysis runs. Progress is derived from timestamps, so a run survives reloads and restarts.
export const analysisJobs = sqliteTable('analysis_jobs', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    patientId: text('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
    requestedBy: integer('requested_by').references(() => users.id, { onDelete: 'set null' }),
    engine: text('engine').notNull(), // e.g. 'simulated'; the ML engine will register its own id
    status: text('status', { enum: ['running', 'completed', 'failed', 'cancelled'] }).notNull(),
    startedAt: text('started_at').notNull(),
    expectedDurationMs: integer('expected_duration_ms').notNull(),
    finishedAt: text('finished_at'),
    error: text('error'),
    result: text('result', { mode: 'json' }).$type<Record<string, unknown> | null>(),
}, (t) => [
    index('analysis_jobs_patient_idx').on(t.patientId),
    index('analysis_jobs_status_idx').on(t.status),
]);

export type AnalysisJob = typeof analysisJobs.$inferSelect;
