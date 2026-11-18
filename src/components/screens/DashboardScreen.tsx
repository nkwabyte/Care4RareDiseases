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
  Clock,
  CheckCircle,
  Sparkles,
  ArrowUpRight,
  Database,
  HelpCircle,
  RefreshCw,
  type LucideIcon,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAppSelector } from '@/lib/store/hooks';
import { getDashboardAction, type DashboardData } from '@/lib/actions/dashboard';

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

function StatCard({ icon: Icon, label, value, tone }: { icon: LucideIcon; label: string; value: number; tone: string }) {
  return (
    <Card className="bg-card border-border">
      <div className="p-6 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${tone}`}>
          <Icon size={24} aria-hidden />
        </div>
        <div>
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="text-3xl font-semibold text-foreground tabular-nums">{value}</p>
        </div>
      </div>
    </Card>
  );
}

const ACTIVITY_ICON: Record<DashboardData['recentActivity'][number]['kind'], { icon: LucideIcon; className: string }> = {
  report: { icon: FileText, className: 'text-cyan-400' },
  status: { icon: CheckCircle, className: 'text-green-400' },
  ai: { icon: Sparkles, className: 'text-purple-400' },
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
            <h1 className="text-foreground text-xl font-semibold">Dashboard</h1>
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
            <div role="alert" className="flex items-center justify-between gap-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
              <p className="text-red-300">{error}</p>
              <Button variant="outline" size="sm" onClick={load} className="gap-2">
                <RefreshCw size={14} aria-hidden /> Retry
              </Button>
            </div>
          )}

          <section aria-label="Case summary" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {data ? (
              <>
                <StatCard icon={Users} label="Your patients" value={data.stats.total} tone="bg-purple-500/20 text-purple-400" />
                <StatCard icon={Clock} label="Pending analysis" value={data.stats.pending} tone="bg-amber-500/20 text-amber-400" />
                <StatCard icon={CheckCircle} label="Results ready" value={data.stats.ready} tone="bg-green-500/20 text-green-400" />
                <StatCard icon={FileText} label="Reports this month" value={data.stats.reportsThisMonth} tone="bg-cyan-500/20 text-cyan-400" />
              </>
            ) : (
              Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
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
                          <span className="text-slate-300">{item.classification}</span>
                          <span className="text-foreground tabular-nums">{item.count}</span>
                        </div>
                        <div className="w-full bg-surface rounded-full h-2" aria-hidden>
                          <div
                            className="bg-purple-500 h-2 rounded-full"
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
                  <Button asChild variant="outline" size="sm" className="text-purple-300 border-purple-700 hover:bg-surface">
                    <Link href="/patients">
                      View all <ArrowUpRight size={16} className="ml-1" aria-hidden />
                    </Link>
                  </Button>
                </div>
                {!data ? (
                  <Skeleton className="h-40" />
                ) : data.pendingCases.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle size={32} className="mx-auto mb-2 text-green-400" aria-hidden />
                    <p>No cases waiting for analysis.</p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {data.pendingCases.map((c) => (
                      <li key={c.patientId}>
                        <button
                          type="button"
                          onClick={() => onOpenPatient?.(c.patientId)}
                          className="w-full flex items-center justify-between gap-3 p-3 bg-surface rounded-lg hover:bg-purple-900/40 transition-colors text-left"
                        >
                          <span className="flex items-center gap-3 min-w-0">
                            <span className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center shrink-0">
                              <Users size={18} className="text-purple-400" aria-hidden />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-foreground">{c.patientId}</span>
                              <span className="block text-muted-foreground text-sm truncate">
                                {c.age} y · {c.sex}
                                {c.gene ? ` · ${c.gene}` : ''}
                              </span>
                            </span>
                          </span>
                          <span className="text-sm text-amber-300 shrink-0 tabular-nums">
                            {c.daysWaiting} {c.daysWaiting === 1 ? 'day' : 'days'} waiting
                          </span>
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
                          <span className="w-8 h-8 bg-surface rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                            <Icon size={16} className={className} aria-hidden />
                          </span>
                          <div className="min-w-0">
                            <p className="text-slate-200">{a.message}</p>
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
                        className="h-full py-6 flex flex-col items-center gap-2 rounded-lg border border-border text-slate-200 hover:bg-surface hover:border-purple-700 transition-colors"
                      >
                        <Icon size={24} className="text-purple-400" aria-hidden />
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
