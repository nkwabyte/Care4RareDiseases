import { useEffect, useMemo, useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/components/ui/utils';
import { getCaseSummariesAction } from '@/lib/actions/patients';
import type { CaseSummary } from '@/lib/evidence';
import { EvidenceStrip } from './Evidence';

interface PatientListProps {
  selectedPatientId: string;
  onPatientSelect: (patientId: string) => void;
  onNewPatient?: () => void;
  /** Change to reload the list (e.g. after an analysis completes). */
  refreshKey?: number;
}

const STATUS_LABEL: Record<CaseSummary['status'], string> = {
  'Pending Analysis': 'Pending analysis',
  'Results Ready': 'Results ready',
  Reviewed: 'Reviewed',
};

export function PatientList({ selectedPatientId, onPatientSelect, onNewPatient, refreshKey = 0 }: PatientListProps) {
  const [cases, setCases] = useState<CaseSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    getCaseSummariesAction().then((res) => {
      if (cancelled) return;
      if (res.success) setCases(res.cases ?? []);
      else setError(res.error ?? 'Could not load cases');
    });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!cases || !q) return cases ?? [];
    return cases.filter((c) => c.id.toLowerCase().includes(q) || c.gene?.toLowerCase().includes(q));
  }, [cases, searchQuery]);

  return (
    <aside aria-label="Cases" className="w-[300px] shrink-0 bg-background border-r border-border h-screen flex flex-col">
      <div className="px-5 pt-6 pb-3">
        <h2 className="mb-3 text-[13px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
          Your cases{cases ? ` · ${cases.length}` : ''}
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} aria-hidden />
          <Input
            aria-label="Search cases by ID or gene"
            placeholder="Search case ID or gene"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-card"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0 border-t border-border">
        {error ? (
          <p role="alert" className="px-5 py-8 text-sm text-destructive">{error}</p>
        ) : !cases ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-5 py-3 border-b border-border space-y-2">
              <Skeleton className="h-4 w-2/3 bg-muted" />
              <Skeleton className="h-2.5 w-full bg-muted" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            {searchQuery ? 'No cases match your search' : 'No cases assigned to you yet'}
          </p>
        ) : (
          <ul>
            {filtered.map((c) => {
              const isSelected = c.id === selectedPatientId;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => onPatientSelect(c.id)}
                    aria-current={isSelected ? 'true' : undefined}
                    className={cn(
                      'w-full text-left px-5 py-3 border-b border-border grid grid-cols-[minmax(0,1fr)] gap-1.5 transition-colors',
                      'focus-visible:outline-offset-[-2px]',
                      isSelected ? 'bg-card shadow-[inset_4px_0_0_var(--gold)]' : 'hover:bg-card/70'
                    )}
                  >
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="shrink-0 whitespace-nowrap text-base font-semibold text-foreground">{c.id}</span>
                      <span className="min-w-0 truncate text-[13px] text-muted-foreground">
                        {c.gene ? <span className="font-medium text-body">{c.gene}</span> : 'No variant'} ·{' '}
                        {c.analysisRunning ? <span className="font-semibold text-foreground">Analysis running</span> : STATUS_LABEL[c.status]}
                      </span>
                    </span>
                    <EvidenceStrip fit={c.fit} classification={c.classification} status={c.status} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <Button onClick={onNewPatient} variant="outline" className="w-full">
          <Plus size={16} aria-hidden />
          New case
        </Button>
      </div>
    </aside>
  );
}
