'use server';

import { db } from '@/lib/db';
import { reports, patients } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSessionAction } from './auth';

/**
 * Get all reports
 */
export async function getReportsAction(): Promise<{ success: boolean; reports?: any[]; error?: string }> {
    try {
        const session = await getSessionAction();

        if (!session.success || !session.user) {
            return { success: false, error: 'Unauthorized' };
        }

        const allReports = await db.select().from(reports);

        return { success: true, reports: allReports };
    } catch (error) {
        console.error('Get reports error:', error);
        return { success: false, error: 'Failed to fetch reports' };
    }
}

/**
 * Get a specific report by ID
 */
export async function getReportByIdAction(id: string): Promise<{ success: boolean; report?: any; error?: string }> {
    try {
        const session = await getSessionAction();

        if (!session.success || !session.user) {
            return { success: false, error: 'Unauthorized' };
        }

        const [report] = await db
            .select()
            .from(reports)
            .where(eq(reports.id, id))
            .limit(1);

        if (!report) {
            return { success: false, error: 'Report not found' };
        }

        return { success: true, report };
    } catch (error) {
        console.error('Get report error:', error);
        return { success: false, error: 'Failed to fetch report' };
    }
}

/**
 * Get reports for a specific patient
 */
export async function getPatientReportsAction(patientId: string): Promise<{ success: boolean; reports?: any[]; error?: string }> {
    try {
        const session = await getSessionAction();

        if (!session.success || !session.user) {
            return { success: false, error: 'Unauthorized' };
        }

        const patientReports = await db
            .select()
            .from(reports)
            .where(eq(reports.patientId, patientId));

        return { success: true, reports: patientReports };
    } catch (error) {
        console.error('Get patient reports error:', error);
        return { success: false, error: 'Failed to fetch patient reports' };
    }
}

/**
 * Generate a new report for a patient
 */
export async function generateReportAction(
    patientId: string,
    patientName: string
): Promise<{ success: boolean; reportId?: string; error?: string }> {
    try {
        const session = await getSessionAction();

        if (!session.success || !session.user) {
            return { success: false, error: 'Unauthorized' };
        }

        // Verify patient exists
        const [patient] = await db
            .select()
            .from(patients)
            .where(eq(patients.id, patientId))
            .limit(1);

        if (!patient) {
            return { success: false, error: 'Patient not found' };
        }

        // Generate report ID
        const reportCount = await db.select().from(reports);
        const reportId = `RPT-${new Date().getFullYear()}-${String(reportCount.length + 1).padStart(3, '0')}`;

        // Insert report
        await db.insert(reports).values({
            id: reportId,
            patientId,
            patientName,
            dateGenerated: new Date().toISOString(),
            generatedBy: session.user.name,
        });

        return { success: true, reportId };
    } catch (error) {
        console.error('Generate report error:', error);
        return { success: false, error: 'Failed to generate report' };
    }
}
