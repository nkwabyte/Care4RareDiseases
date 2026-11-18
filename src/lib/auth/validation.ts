import 'server-only';

import { z } from 'zod';
import { AuthError } from './session';

export const patientIdSchema = z.string().trim().regex(/^[A-Za-z0-9-]{1,64}$/, 'Invalid patient ID');
export const reportIdSchema = z.string().trim().regex(/^[A-Za-z0-9-]{1,64}$/, 'Invalid report ID');
export const patientStatusSchema = z.enum(['Pending Analysis', 'Results Ready', 'Reviewed']);

export type ActionFailure = { success: false; error: string };

/**
 * Maps thrown errors to a safe client-facing result. Access denial is reported as "not found"
 * so callers cannot discover which patient or report IDs exist.
 */
export function toActionFailure(error: unknown, context: string, notFound = 'Not found'): ActionFailure {
    if (error instanceof AuthError) {
        return { success: false, error: error.code === 'UNAUTHENTICATED' ? 'Unauthorized' : notFound };
    }
    if (error instanceof z.ZodError) {
        return { success: false, error: error.issues[0]?.message ?? 'Invalid input' };
    }
    console.error(`${context}:`, error);
    return { success: false, error: `${context} failed` };
}
