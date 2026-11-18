'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, FileText, Settings, Database, LayoutDashboard, HelpCircle, type LucideIcon } from 'lucide-react';
import { useAppSelector } from '@/lib/store/hooks';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/components/ui/utils';

type NavItem = { href: string; icon: LucideIcon; label: string };

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/patients', icon: Users, label: 'Patients' },
  { href: '/reports', icon: FileText, label: 'Reports' },
  { href: '/database', icon: Database, label: 'Database' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];
const BOTTOM_ITEMS: NavItem[] = [{ href: '/help', icon: HelpCircle, label: 'Help & documentation' }];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={item.href}
          aria-label={item.label}
          aria-current={active ? 'page' : undefined}
          className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-200',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
            active
              ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/40'
              : 'text-slate-400 hover:text-white hover:bg-surface'
          )}
        >
          <Icon size={20} aria-hidden />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}

/** Icon rail navigation. Active item is derived from the URL. */
export function Sidebar() {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.doctor);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const initials = user?.name
    .replace(/^Dr\.?\s+/i, '')
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <TooltipProvider delayDuration={150}>
      <nav
        aria-label="Main"
        className="w-16 bg-sidebar h-screen flex flex-col items-center py-6 border-r border-border shrink-0"
      >
        <Link
          href="/dashboard"
          aria-label="Care4RareDiseases home"
          className="mb-4 w-10 h-10 bg-linear-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center shadow-lg"
        >
          <span className="text-white font-semibold text-xs" aria-hidden>C4RD</span>
        </Link>

        <ul className="flex flex-col gap-4 flex-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <NavLink item={item} active={isActive(item.href)} />
            </li>
          ))}
        </ul>

        <ul className="flex flex-col gap-4 mt-4 items-center">
          {BOTTOM_ITEMS.map((item) => (
            <li key={item.href}>
              <NavLink item={item} active={isActive(item.href)} />
            </li>
          ))}
          {user && (
            <li>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/settings"
                    aria-label={`Account: ${user.name}`}
                    className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mt-2 hover:bg-purple-500/30"
                  >
                    <span className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs">
                      {initials}
                    </span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{user.name}</TooltipContent>
              </Tooltip>
            </li>
          )}
        </ul>
      </nav>
    </TooltipProvider>
  );
}
