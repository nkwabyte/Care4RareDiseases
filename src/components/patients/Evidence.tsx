import { Check } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { acmgTone, type AcmgTone, type PhenotypeFit } from '@/lib/evidence';

const TONE_FILL: Record<AcmgTone, string> = {
    pathogenic: 'bg-pathogenic border-pathogenic',
    'likely-pathogenic': 'bg-card border-likely-pathogenic',
    uncertain: 'bg-uncertain border-uncertain',
    none: 'border-dashed border-input bg-transparent',
};

const TONE_TEXT: Record<AcmgTone, string> = {
    pathogenic: 'text-primary-foreground',
    'likely-pathogenic': 'text-pathogenic',
    uncertain: 'text-primary-foreground',
    none: 'text-muted-foreground',
};

function fitSummary(fit: PhenotypeFit[]) {
    const explained = fit.filter((f) => f.explained).length;
    return { explained, total: fit.length };
}

/**
 * Compact woven strip for the case list: one block per observed phenotype, filled when the
 * variant explains it, hollow when it does not, ending in a block for the ACMG class.
 */
export function EvidenceStrip({
    fit,
    classification,
    status,
}: {
    fit: PhenotypeFit[];
    classification: string | null;
    status?: string | null;
}) {
    const tone = acmgTone(classification);
    const { explained, total } = fitSummary(fit);
    const pending = isPending(status);
    return (
        <div
            role="img"
            aria-label={`${explained} of ${total} phenotypes are known features of the gene${pending ? ', analysis not run' : ''}; ${classification ?? 'not classified'}`}
            className="flex h-2.5 gap-px"
        >
            {fit.length === 0 ? (
                <span className="flex-1 border border-dashed border-input" />
            ) : (
                fit.map((f, i) => (
                    <span
                        key={i}
                        className={cn(
                            'flex-1 border border-primary',
                            pending && 'border-dashed',
                            f.explained && (pending ? 'bg-primary/30' : 'bg-primary')
                        )}
                    />
                ))
            )}
            <span className={cn('w-[18px] shrink-0 border-[1.5px]', TONE_FILL[tone])} />
        </div>
    );
}

/** Full-width weave for the case header: every observed phenotype as a labelled block plus the classification. */
export function EvidenceWeave({
    fit,
    classification,
    gene,
    status,
}: {
    fit: PhenotypeFit[];
    classification: string | null;
    gene: string | null;
    status?: string | null;
}) {
    const tone = acmgTone(classification);
    const { explained, total } = fitSummary(fit);
    const pending = isPending(status);
    return (
        <figure className="space-y-1.5">
            <figcaption className="text-[13px] text-muted-foreground">
                <span className="font-semibold text-foreground">
                    {explained} of {total}
                </span>{' '}
                observed phenotypes are known features of {gene ?? 'the primary variant’s gene'}
                {pending && <span className="font-semibold text-foreground"> · analysis not run</span>}
            </figcaption>
            <ul className="flex flex-wrap gap-0.5">
                {fit.map((f) => (
                    <li
                        key={f.term}
                        className={cn(
                            'min-w-[150px] flex-1 border-[1.5px] border-primary px-2.5 py-1.5 leading-tight',
                            pending && 'border-dashed',
                            f.explained
                                ? pending
                                    ? 'bg-success-soft text-foreground'
                                    : 'bg-primary text-primary-foreground'
                                : 'bg-card text-foreground'
                        )}
                    >
                        <span className="block text-[13px] font-semibold">{f.term}</span>
                        <span
                            className={cn(
                                'block text-xs',
                                f.explained && !pending ? 'text-primary-foreground/85' : 'text-muted-foreground'
                            )}
                        >
                            {f.explained ? 'Known feature' : 'Not a known feature'}
                        </span>
                    </li>
                ))}
                <li className={cn('w-[150px] shrink-0 border-[1.5px] px-2.5 py-1.5 leading-tight', TONE_FILL[tone], TONE_TEXT[tone])}>
                    <span className="block text-[13px] font-bold">{classification ?? 'Not classified'}</span>
                    <span className="block text-xs opacity-90">ACMG{gene ? ` · ${gene}` : ''}</span>
                </li>
            </ul>
        </figure>
    );
}

const isPending = (status: string | null | undefined) => !status || status === 'Pending Analysis';

const STAGES = ['Pending Analysis', 'Results Ready', 'Reviewed'] as const;
const STAGE_LABEL: Record<(typeof STAGES)[number], string> = {
    'Pending Analysis': 'Pending analysis',
    'Results Ready': 'Results ready',
    Reviewed: 'Reviewed',
};

/** Three-cell case lifecycle. Completed stages carry a tick, the current stage is outlined in ink. */
export function LifecycleStrip({ status }: { status: string | null | undefined }) {
    const current = Math.max(0, STAGES.indexOf((status ?? 'Pending Analysis') as (typeof STAGES)[number]));
    return (
        <ol aria-label="Case status" className="inline-flex text-[13px] font-semibold">
            {STAGES.map((stage, i) => {
                const done = i < current;
                const now = i === current;
                return (
                    <li
                        key={stage}
                        aria-current={now ? 'step' : undefined}
                        className={cn(
                            'flex items-center gap-1.5 border px-3 py-1 -ml-px first:ml-0',
                            now ? 'relative z-10 border-foreground text-foreground' : 'border-border',
                            done ? 'text-foreground' : !now && 'text-muted-foreground'
                        )}
                    >
                        <span
                            aria-hidden
                            className={cn(
                                'grid size-3 place-items-center rounded-full border-[1.5px]',
                                done && 'border-foreground bg-foreground text-card',
                                now && 'border-foreground bg-card ring-2 ring-inset ring-foreground',
                                !done && !now && 'border-current'
                            )}
                        >
                            {done && <Check className="size-2" strokeWidth={4} />}
                        </span>
                        {STAGE_LABEL[stage]}
                        {done && <span className="sr-only">(complete)</span>}
                        {now && <span className="sr-only">(current)</span>}
                    </li>
                );
            })}
        </ol>
    );
}
