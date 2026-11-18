'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, FileText, Settings, Database, LayoutDashboard, HelpCircle, type LucideIcon } from 'lucide-react';
import { useAppSelector } from '@/lib/store/hooks';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/components/ui/utils';
import { BrandMark } from './BrandMark';

type NavItem = { href: string; icon: LucideIcon; label: string };

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { href: '/patients', icon: Users, label: 'Cases' },
  { href: '/reports', icon: FileText, label: 'Reports' },
  { href: '/database', icon: Database, label: 'Data' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];
const BOTTOM_ITEMS: NavItem[] = [{ href: '/help', icon: HelpCircle, label: 'Help' }];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative flex h-14 w-full flex-col items-center justify-center gap-1 text-xs font-semibold tracking-[0.02em] transition-colors',
        'focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-primary-foreground',
        active
          ? 'bg-primary-hover text-primary-foreground before:absolute before:inset-y-2 before:left-0 before:w-1 before:bg-gold'
          : 'text-sidebar-foreground hover:bg-primary-hover/60 hover:text-primary-foreground'
      )}
    >
      <Icon size={20} strokeWidth={1.75} aria-hidden />
      {item.label}
    </Link>
  );
}

/** Forest-green navigation rail. The active item carries the gold selection bar. */
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
      <nav aria-label="Main" className="w-[76px] bg-sidebar h-screen flex flex-col items-center pt-5 pb-4 shrink-0">
        <Link
          href="/dashboard"
          aria-label="Care4RareDiseases home"
          className="mb-6 focus-visible:outline-primary-foreground"
        >
          <BrandMark className="size-10" />
        </Link>

        <ul className="flex w-full flex-col gap-1 flex-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <NavLink item={item} active={isActive(item.href)} />
            </li>
          ))}
        </ul>

        <ul className="flex w-full flex-col gap-1 items-center">
          {BOTTOM_ITEMS.map((item) => (
            <li key={item.href} className="w-full">
              <NavLink item={item} active={isActive(item.href)} />
            </li>
          ))}
          {user && (
            <li className="mt-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/settings"
                    aria-label={`Account: ${user.name}`}
                    className="grid size-10 place-items-center border border-sidebar-foreground/50 text-[13px] font-semibold text-primary-foreground hover:bg-primary-hover focus-visible:outline-primary-foreground"
                  >
                    {initials}
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
