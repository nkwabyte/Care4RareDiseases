'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Activity,
  Users,
  FileText,
  CheckCircle,
  ArrowUpRight,
  Database,
  HelpCircle,
  RefreshCw,
  type LucideIcon,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAppSelector } from '@/lib/store/hooks';
import { getDashboardAction, type DashboardData } from '@/lib/actions/dashboard';
import { acmgTone, type AcmgTone } from '@/lib/evidence';
import { EvidenceStrip } from '@/components/patients/Evidence';

interface DashboardScreenProps {
  /** Opens a patient in the Patients workspace. */
  onOpenPatient?: (patientId: string) => void;
}

const relativeTime = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
function timeAgo(iso: string): string {
  const diffMs = Date.parse(iso) - Date.now();
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31_536_000_000],
    ['month', 2_592_000_000],
    ['day', 86_400_000],
    ['hour', 3_600_000],
    ['minute', 60_000],
  ];
  for (const [unit, ms] of units) {
    if (Math.abs(diffMs) >= ms) return relativeTime.format(Math.round(diffMs / ms), unit);
  }
  return 'just now';
}

const ACMG_BAR: Record<AcmgTone, string> = {
  pathogenic: 'bg-pathogenic border-pathogenic',
  'likely-pathogenic': 'bg-card border-pathogenic',
  uncertain: 'bg-uncertain border-uncertain',
  none: 'bg-card border-input border-dashed',
};

const ACTIVITY_ICON: Record<DashboardData['recentActivity'][number]['kind'], { icon: LucideIcon; className: string }> = {
  report: { icon: FileText, className: 'text-muted-foreground' },
  status: { icon: CheckCircle, className: 'text-muted-foreground' },
  ai: { icon: FileText, className: 'text-muted-foreground' },
};

const QUICK_ACTIONS: { href: string; icon: LucideIcon; label: string }[] = [
  { href: '/patients', icon: Users, label: 'Open patients' },
  { href: '/reports', icon: FileText, label: 'Reports' },
  { href: '/database', icon: Database, label: 'Patient database' },
  { href: '/help', icon: HelpCircle, label: 'Help' },
];

export function DashboardScreen({ onOpenPatient }: DashboardScreenProps) {
  const user = useAppSelector((state) => state.auth.doctor);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const result = await getDashboardAction();
    if (result.success && result.data) setData(result.data);
    else setError(result.error ?? 'Could not load the dashboard');
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch on mount
    load();
  }, [load]);

  const totalReports = data?.reportsByMonth.reduce((sum, m) => sum + m.reports, 0) ?? 0;
  const maxPathogenicity = Math.max(1, ...(data?.pathogenicity.map((p) => p.count) ?? [1]));

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-[-0.01em] text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name ?? 'Doctor'}</p>
          </div>
          <p className="text-muted-foreground hidden sm:block">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {error && (
            <div role="alert" className="flex items-center justify-between gap-4 rounded-lg border border-destructive/30 bg-destructive-soft p-4">
              <p className="text-destructive">{error}</p>
              <Button variant="outline" size="sm" onClick={load} className="gap-2">
                <RefreshCw size={14} aria-hidden /> Retry
              </Button>
            </div>
          )}

          <section aria-label="Case summary" className="bg-card border border-border">
            {data ? (
              <dl className="grid grid-cols-2 lg:grid-cols-5 divide-x divide-y lg:divide-y-0 divide-border">
                {[
                  ['Your cases', data.stats.total],
                  ['Pending analysis', data.stats.pending],
                  ['Results ready', data.stats.ready],
                  ['Reviewed', data.stats.reviewed],
                  ['Reports this month', data.stats.reportsThisMonth],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between gap-3 px-5 py-4">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="text-2xl font-bold text-foreground tabular-nums">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <Skeleton className="h-16" />
            )}
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-card border-border lg:col-span-2">
              <div className="p-6">
                <h2 className="text-foreground font-medium">Reports generated</h2>
                <p className="text-muted-foreground text-sm mb-6">Last 12 months, for patients you can access</p>
                {!data ? (
                  <Skeleton className="h-[260px]" />
                ) : totalReports === 0 ? (
                  <div className="h-[260px] flex flex-col items-center justify-center text-center text-muted-foreground">
                    <FileText size={32} className="mb-2" aria-hidden />
                    <p>No reports in the last 12 months.</p>
                  </div>
                ) : (
                  <figure>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={data.reportsByMonth} margin={{ left: -16 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="label" stroke="var(--muted-foreground)" tickLine={false} />
                        <YAxis allowDecimals={false} stroke="var(--muted-foreground)" tickLine={false} />
                        <Tooltip
                          cursor={{ fill: 'var(--surface)', opacity: 0.4 }}
                          contentStyle={{
                            backgroundColor: 'var(--popover)',
                            border: '1px solid var(--border)',
                            borderRadius: 8,
                            color: 'var(--foreground)',
                          }}
                        />
                        <Bar dataKey="reports" name="Reports" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                    <figcaption className="sr-only">
                      {data.reportsByMonth.map((m) => `${m.label}: ${m.reports}`).join(', ')}
                    </figcaption>
                  </figure>
                )}
              </div>
            </Card>

            <Card className="bg-card border-border">
              <div className="p-6">
                <h2 className="text-foreground font-medium">Variant classification</h2>
                <p className="text-muted-foreground text-sm mb-6">Primary variant, by ACMG class</p>
                {!data ? (
                  <Skeleton className="h-40" />
                ) : data.pathogenicity.length === 0 ? (
                  <p className="text-muted-foreground">No patients yet.</p>
                ) : (
                  <ul className="space-y-4">
                    {data.pathogenicity.map((item) => (
                      <li key={item.classification}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-body">{item.classification}</span>
                          <span className="text-foreground tabular-nums">{item.count}</span>
                        </div>
                        <div className="w-full h-3" aria-hidden>
                          <div
                            className={`h-3 border-[1.5px] ${ACMG_BAR[acmgTone(item.classification)]}`}
                            style={{ width: `${(item.count / maxPathogenicity) * 100}%` }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-foreground font-medium">Pending cases</h2>
                    <p className="text-muted-foreground text-sm">Longest waiting first</p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/patients">
                      View all <ArrowUpRight size={16} className="ml-1" aria-hidden />
                    </Link>
                  </Button>
                </div>
                {!data ? (
                  <Skeleton className="h-40" />
                ) : data.pendingCases.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No cases waiting for analysis.</p>
                  </div>
                ) : (
                  <ul className="border-t border-border">
                    {data.pendingCases.map((c) => (
                      <li key={c.patientId}>
                        <button
                          type="button"
                          onClick={() => onOpenPatient?.(c.patientId)}
                          className="w-full grid grid-cols-[minmax(0,1fr)] gap-1.5 py-3 px-1 border-b border-border hover:bg-background transition-colors text-left"
                        >
                          <span className="flex items-baseline justify-between gap-3">
                            <span className="min-w-0 truncate">
                              <span className="font-semibold text-foreground">{c.patientId}</span>
                              <span className="text-sm text-muted-foreground">
                                {' '}· {c.age} y · {c.sex}
                                {c.gene ? ` · ${c.gene}` : ''}
                              </span>
                            </span>
                            <span className="text-sm text-body shrink-0 tabular-nums">
                              {c.daysWaiting} {c.daysWaiting === 1 ? 'day' : 'days'} waiting
                            </span>
                          </span>
                          <EvidenceStrip fit={c.fit} classification={c.classification} status="Pending Analysis" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Card>

            <Card className="bg-card border-border">
              <div className="p-6">
                <h2 className="text-foreground font-medium">Recent activity</h2>
                <p className="text-muted-foreground text-sm mb-6">Reports, analyses and status changes</p>
                {!data ? (
                  <Skeleton className="h-40" />
                ) : data.recentActivity.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity size={32} className="mx-auto mb-2" aria-hidden />
                    <p>No recent activity.</p>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {data.recentActivity.map((a) => {
                      const { icon: Icon, className } = ACTIVITY_ICON[a.kind];
                      return (
                        <li key={a.id} className="flex items-start gap-3">
                          <Icon size={16} className={`${className} shrink-0 mt-1`} aria-hidden />
                          <div className="min-w-0">
                            <p className="text-foreground">{a.message}</p>
                            <p className="text-muted-foreground text-sm">
                              <time dateTime={a.at} title={new Date(a.at).toLocaleString()}>
                                {timeAgo(a.at)}
                              </time>
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </Card>
          </div>

          <nav aria-label="Quick actions">
            <Card className="bg-card border-border">
              <div className="p-6">
                <h2 className="mb-6 text-foreground font-medium">Quick actions</h2>
                <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {QUICK_ACTIONS.map(({ href, icon: Icon, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="h-full py-6 flex flex-col items-center gap-2 rounded-lg border border-border text-foreground hover:bg-surface hover:border-primary transition-colors"
                      >
                        <Icon size={24} className="text-primary" aria-hidden />
                        <span>{label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </nav>
        </div>
      </main>
    </div>
  );
}
