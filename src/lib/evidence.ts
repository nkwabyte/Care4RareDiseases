/** One observed phenotype and whether the primary variant's gene is known to produce it. */
export type PhenotypeFit = { term: string; explained: boolean };

export type CaseSummary = {
    id: string;
    gene: string | null;
    status: 'Pending Analysis' | 'Results Ready' | 'Reviewed';
    classification: string | null;
    fit: PhenotypeFit[];
    analysisRunning?: boolean;
};

const norm = (s: string) => s.trim().toLowerCase();

/** Observed phenotypes marked explained when the variant's gene lists them as affected. */
export function phenotypeFit(phenotypes: string[] | null | undefined, affected: string[] | null | undefined): PhenotypeFit[] {
    const known = new Set((affected ?? []).map(norm));
    return (phenotypes ?? []).map((term) => ({ term, explained: known.has(norm(term)) }));
}

export type AcmgTone = 'pathogenic' | 'likely-pathogenic' | 'uncertain' | 'none';

export function acmgTone(classification: string | null | undefined): AcmgTone {
    const c = norm(classification ?? '');
    if (!c) return 'none';
    if (c.startsWith('likely pathogenic')) return 'likely-pathogenic';
    if (c.startsWith('pathogenic')) return 'pathogenic';
    return 'uncertain';
}
