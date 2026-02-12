import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
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

// Doctors table (existing)
export const doctors = sqliteTable('doctors', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    name: text('name').notNull(),
    specialty: text('specialty'),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Sessions table (existing)
export const sessions = sqliteTable('sessions', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
    doctorId: integer('doctor_id').references(() => doctors.id, { onDelete: 'cascade' }),
    token: text('token').notNull().unique(),
    expiresAt: text('expires_at').notNull(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Doctor-Patient assignments table (existing)
export const doctorPatientAssignments = sqliteTable('doctor_patient_assignments', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    doctorId: integer('doctor_id').notNull().references(() => doctors.id, { onDelete: 'cascade' }),
    patientId: text('patient_id').notNull(),
    assignedAt: text('assigned_at').default(sql`CURRENT_TIMESTAMP`),
});

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

export type Doctor = typeof doctors.$inferSelect;
export type NewDoctor = typeof doctors.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type DoctorPatientAssignment = typeof doctorPatientAssignments.$inferSelect;
export type NewDoctorPatientAssignment = typeof doctorPatientAssignments.$inferInsert;

export type Patient = typeof patients.$inferSelect;
export type NewPatient = typeof patients.$inferInsert;

export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;
