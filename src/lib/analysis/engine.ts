import 'server-only';

import type { Patient } from '@/lib/db/schema';

export type AnalysisStage = { key: string; label: string; weight: number };

/**
 * An analysis engine runs a genotype–phenotype analysis for one case.
 * Today only the simulated engine exists; the ML pipeline will implement this interface
 * and report real progress/results instead of deriving them from elapsed time.
 */
export interface AnalysisEngine {
    id: string;
    /** True when progress and results are not produced by a real analysis. */
    simulated: boolean;
    stages: AnalysisStage[];
    /** Expected run length for this case. */
    plan(patient: Patient): { expectedDurationMs: number };
    /** Produces the result payload once the run has finished. */
    complete(patient: Patient): Promise<Record<string, unknown>>;
}

const MIN_MS = 8 * 60_000;
const MAX_MS = 12 * 60_000;

export const simulatedEngine: AnalysisEngine = {
    id: 'simulated',
    simulated: true,
    stages: [
        { key: 'validate', label: 'Validating case data', weight: 0.06 },
        { key: 'annotate', label: 'Annotating variants', weight: 0.3 },
        { key: 'phenotype', label: 'Matching HPO phenotypes', weight: 0.24 },
        { key: 'rank', label: 'Ranking candidate genes', weight: 0.3 },
        { key: 'compile', label: 'Compiling results', weight: 0.1 },
    ],
    plan() {
        return { expectedDurationMs: Math.round(MIN_MS + Math.random() * (MAX_MS - MIN_MS)) };
    },
    async complete() {
        // No findings are fabricated: the simulated run only records that it finished.
        return { simulated: true };
    },
};

const ENGINES: Record<string, AnalysisEngine> = { [simulatedEngine.id]: simulatedEngine };

export const DEFAULT_ENGINE = simulatedEngine;

export function getEngine(id: string): AnalysisEngine {
    return ENGINES[id] ?? simulatedEngine;
}
