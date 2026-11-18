'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/ui/utils';
import { cancelAnalysisAction, getAnalysisStatusAction, startAnalysisAction } from '@/lib/actions/analysis';
import type { AnalysisSnapshot } from '@/lib/analysis/jobs';

const POLL_MS = 5_000;
const clock = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Accra' });
const fmtTime = (iso: string) => clock.format(new Date(iso));

function fmtRemaining(ms: number): string {
  if (ms <= 30_000) return 'Finishing up';
  if (ms < 90_000) return 'About 1 min left';
  return `About ${Math.round(ms / 60_000)} min left`;
}

function fmtDuration(ms: number): string {
  const min = Math.round(ms / 60_000);
  return min < 1 ? 'under a minute' : `${min} min`;
}

interface AnalysisRunProps {
  patientId: string;
  /** Only clinicians and administrators may start or cancel runs. */
  canRun: boolean;
  /** Called once when a run that was being watched completes. */
  onCompleted?: () => void;
  onViewResults?: () => void;
}

/**
 * Genotype–phenotype analysis run: start, live progress with ETA, cancel, and the finished state.
 * The run lives on the server, so leaving the page does not stop it.
 */
export function AnalysisRun({ patientId, canRun, onCompleted, onViewResults }: AnalysisRunProps) {
  const [job, setJob] = useState<AnalysisSnapshot | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [skew, setSkew] = useState(0); // server clock minus client clock
  const watched = useRef<number | null>(null); // id of a run seen running in this view

  const accept = useCallback(
    (next: AnalysisSnapshot | null | undefined) => {
      if (next) setSkew(Date.parse(next.serverNow) - Date.now());
      setJob(next ?? null);
      if (next?.status === 'running') watched.current = next.jobId;
      else if (next?.status === 'completed' && watched.current === next.jobId) {
        watched.current = null;
        toast.success(`Analysis complete for ${patientId}`, { description: 'Results are ready to review.' });
        onCompleted?.();
      }
    },
    [patientId, onCompleted]
  );

  const refresh = useCallback(async () => {
    const res = await getAnalysisStatusAction(patientId);
    if (res.success) accept(res.job);
  }, [patientId, accept]);

  // Load once; the parent keys this component by case, so a new case remounts it.
  useEffect(() => {
    let cancelled = false;
    getAnalysisStatusAction(patientId).then((res) => {
      if (!cancelled && res.success) accept(res.job);
    });
    return () => {
      cancelled = true;
    };
  }, [patientId, accept]);

  const running = job?.status === 'running';

  // While running: tick every second for the countdown, poll the server every few seconds.
  useEffect(() => {
    if (!running) return;
    const tick = setInterval(() => setNow(Date.now()), 1_000);
    const poll = setInterval(refresh, POLL_MS);
    return () => {
      clearInterval(tick);
      clearInterval(poll);
    };
  }, [running, refresh]);

  const start = async () => {
    setBusy(true);
    const res = await startAnalysisAction(patientId);
    setBusy(false);
    if (res.success) accept(res.job);
    else toast.error('Could not start the analysis', { description: res.error });
  };

  const cancel = async () => {
    setBusy(true);
    const res = await cancelAnalysisAction(patientId);
    setBusy(false);
    if (res.success) {
      watched.current = null;
      accept(res.job);
    } else toast.error('Could not cancel the analysis', { description: res.error });
  };

  if (job === undefined) {
    return <div className="h-12 bg-muted" aria-hidden />;
  }

  // Progress is re-derived locally between polls so the bar and countdown move smoothly.
  const serverNow = now + skew;
  const progress =
    job?.status === 'running'
      ? Math.min(0.99, Math.max(0, (serverNow - Date.parse(job.startedAt)) / (Date.parse(job.expectedFinishAt) - Date.parse(job.startedAt))))
      : job?.progress ?? 0;
  const remainingMs = job ? Date.parse(job.expectedFinishAt) - serverNow : 0;

  if (running && job) {
    let acc = 0;
    let stageIndex = job.stages.length - 1;
    for (let i = 0; i < job.stages.length; i++) {
      acc += job.stages[i].weight;
      if (progress < acc) {
        stageIndex = i;
        break;
      }
    }

    return (
      <section aria-labelledby="analysis-run-title" className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h4 id="analysis-run-title" className="font-semibold text-foreground">
            Analysis running
          </h4>
          <p className="text-sm text-muted-foreground">Started {fmtTime(job.startedAt)}</p>
        </div>

        <p aria-live="polite" className="text-body">
          Step {stageIndex + 1} of {job.stages.length}: {job.stages[stageIndex].label}
        </p>

        <StageBar stages={job.stages} progress={progress} />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-foreground">
            <span className="font-semibold">{fmtRemaining(remainingMs)}</span>
            <span className="text-muted-foreground"> · expected around {fmtTime(job.expectedFinishAt)}</span>
          </p>
          {canRun && (
            <Button variant="ghost" size="sm" onClick={cancel} disabled={busy} className="text-muted-foreground hover:text-destructive">
              Cancel run
            </Button>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          You can leave this page; the run continues.
          {job.simulated && ' Simulated run: the analysis engine is not connected yet, so no new findings are produced.'}
        </p>
      </section>
    );
  }

  const last =
    job?.status === 'completed' ? (
      <p className="text-body">
        Last run finished at {fmtTime(job.finishedAt ?? job.expectedFinishAt)} (took{' '}
        {fmtDuration(Date.parse(job.finishedAt ?? job.expectedFinishAt) - Date.parse(job.startedAt))}).
      </p>
    ) : job?.status === 'cancelled' ? (
      <p className="text-body">Last run was cancelled at {fmtTime(job.finishedAt ?? job.startedAt)}.</p>
    ) : job?.status === 'failed' ? (
      <p role="alert" className="text-destructive">Last run failed{job.error ? `: ${job.error}` : '.'}</p>
    ) : null;

  return (
    <section aria-label="Genotype–phenotype analysis" className="space-y-3">
      {last}
      {job?.status === 'completed' && onViewResults && (
        <Button onClick={onViewResults} className="w-full h-12 text-[15px]">
          View analysis results
        </Button>
      )}
      {canRun ? (
        <>
          <Button
            onClick={start}
            disabled={busy}
            variant={job?.status === 'completed' ? 'outline' : 'default'}
            className="w-full h-12 text-[15px]"
          >
            {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Play className="size-4 fill-current" aria-hidden />}
            {job?.status === 'completed' ? 'Run analysis again' : 'Run genotype–phenotype analysis'}
          </Button>
          <p className="text-sm text-muted-foreground">Takes about 8–12 minutes. You can keep working while it runs.</p>
        </>
      ) : (
        !last && <p className="text-sm text-muted-foreground">No analysis has been run for this case yet.</p>
      )}
    </section>
  );
}

/** Woven progress bar: one segment per stage, sized by its share of the run. */
function StageBar({ stages, progress }: { stages: { label: string; weight: number }[]; progress: number }) {
  const starts = stages.map((_, i) => stages.slice(0, i).reduce((sum, st) => sum + st.weight, 0));
  return (
    <div
      role="progressbar"
      aria-label="Analysis progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      className="flex h-3 gap-0.5"
    >
      {stages.map((s, i) => {
        const fill = Math.min(1, Math.max(0, (progress - starts[i]) / s.weight));
        return (
          <span key={s.label} className="relative border border-primary" style={{ flexGrow: s.weight, flexBasis: 0 }}>
            <span
              className={cn('absolute inset-y-0 left-0 bg-primary', fill > 0 && fill < 1 && 'transition-[width] duration-1000 ease-linear')}
              style={{ width: `${fill * 100}%` }}
            />
          </span>
        );
      })}
    </div>
  );
}
