import { Card } from '@/components/ui/card';
import { cn } from '@/components/ui/utils';
import { acmgTone } from '@/lib/evidence';
import { VariantInfo } from '@/lib/types';

interface DNAStructureVisualizationProps {
  variantInfo?: VariantInfo;
}

const PLATE_LABEL = 'mb-4 text-[13px] font-bold uppercase tracking-[0.06em] text-muted-foreground';

/** ACMG class as a word plus a mark: filled red = Pathogenic, outlined red = Likely pathogenic, grey = other. */
export function AcmgTag({ classification, className }: { classification: string; className?: string }) {
  const tone = acmgTone(classification);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 border-[1.5px] px-2.5 py-1 text-[13px] font-bold leading-none',
        tone === 'pathogenic' || tone === 'likely-pathogenic' ? 'border-pathogenic text-pathogenic' : 'border-input text-body',
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          'size-2.5 border-[1.5px]',
          tone === 'pathogenic' && 'border-pathogenic bg-pathogenic',
          tone === 'likely-pathogenic' && 'border-pathogenic bg-card',
          (tone === 'uncertain' || tone === 'none') && 'border-uncertain bg-uncertain'
        )}
      />
      {classification}
    </span>
  );
}

export function DNAStructureVisualization({ variantInfo }: DNAStructureVisualizationProps) {
  if (!variantInfo) {
    return (
      <Card className="p-6 bg-card border-border">
        <h3 className={PLATE_LABEL}>Primary variant</h3>
        <p className="text-muted-foreground">No variant recorded for this case.</p>
      </Card>
    );
  }

  const rows: [string, string, boolean?][] = [
    ['cDNA', variantInfo.cdnaChange, true],
    ['Protein', variantInfo.proteinChange, true],
    ['Location', `Chr ${variantInfo.chromosome} (${variantInfo.position})`],
    ['Type', variantInfo.variantType],
    ['Zygosity', variantInfo.zygosity],
    ['Inheritance', variantInfo.inheritance],
  ];

  return (
    <Card className="p-6 bg-card border-border gap-0">
      <h3 className={PLATE_LABEL}>Primary variant</h3>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-[32px] leading-none font-bold tracking-[-0.01em] text-foreground">{variantInfo.gene}</p>
        <AcmgTag classification={variantInfo.pathogenicity} />
      </div>

      <dl className="mt-5 grid grid-cols-[130px_1fr] border-t border-border">
        {rows.map(([label, value, mono]) => (
          <div key={label} className="contents">
            <dt className="py-2.5 border-b border-border text-muted-foreground">{label}</dt>
            <dd className={cn('py-2.5 border-b border-border font-semibold text-foreground', mono && 'font-mono font-medium')}>
              {value}
            </dd>
          </div>
        ))}
      </dl>

      {variantInfo.affectedPhenotypes.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-sm text-muted-foreground">Known features of {variantInfo.gene}</p>
          <p className="text-body">{variantInfo.affectedPhenotypes.join(' · ')}</p>
        </div>
      )}
    </Card>
  );
}
