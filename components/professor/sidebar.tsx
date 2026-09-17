'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  BarChart3,
  Users,
  Settings,
  LifeBuoy,
  GraduationCap,
  ChevronLeft,
  X,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/auth-provider';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/professor' },
  { label: 'Courses', icon: BookOpen, href: '/professor/courses' },
  { label: 'AI Assistant', icon: Sparkles, href: '/professor/assistant' },
  { label: 'Analytics', icon: BarChart3, href: '/professor/analytics' },
  { label: 'Students', icon: Users, href: '/professor/students' },
];

export function ProfessorSidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onCloseMobile,
}: {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 76 : 256 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="fixed left-0 top-0 z-50 hidden h-screen flex-col border-r border-border bg-card/80 backdrop-blur-xl md:flex"
      >
        <SidebarContent collapsed={collapsed} onToggle={onToggle} />
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-border bg-card/95 backdrop-blur-xl md:hidden"
          >
            <SidebarContent collapsed={false} onToggle={onCloseMobile} forceClose />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarContent({
  collapsed,
  onToggle,
  forceClose = false,
}: {
  collapsed: boolean;
  onToggle: () => void;
  forceClose?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  return (
    <div className="flex h-full flex-col">
      <div className={cn('flex h-16 items-center border-b border-border px-4', collapsed ? 'justify-center' : 'justify-between')}>
        <button onClick={() => router.push('/professor')} className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow">
            <GraduationCap className="h-5 w-5" />
          </span>
          {!collapsed && (
            <span className="font-display text-base font-semibold">
              Smart<span className="text-primary">Track</span>
            </span>
          )}
        </button>
        {!collapsed && !forceClose && (
          <button onClick={onToggle} aria-label="Collapse sidebar" className="hidden rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:block">
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        {forceClose && (
          <button onClick={onToggle} aria-label="Close" className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {collapsed && (
          <button onClick={onToggle} aria-label="Expand sidebar" className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <ChevronLeft className="h-4 w-4 rotate-180" />
          </button>
        )}
        {!collapsed && (
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Professor</p>
        )}
        <div className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/professor' && pathname.startsWith(item.href));
            return (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className={cn(
                  'group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  collapsed && 'justify-center',
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
                {collapsed && active && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-border px-3 py-3">
        <div className="space-y-1">
          <button className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground', collapsed && 'justify-center')} title={collapsed ? 'Settings' : undefined}>
            <Settings className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && 'Settings'}
          </button>
          <button className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground', collapsed && 'justify-center')} title={collapsed ? 'Help' : undefined}>
            <LifeBuoy className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && 'Help'}
          </button>
        </div>
      </div>

      <div className="border-t border-border p-3">
        <div className={cn('flex items-center gap-3 rounded-xl px-2 py-2', collapsed && 'justify-center')}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-primary-foreground">
            {(profile?.full_name || 'P')[0]}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{profile?.full_name || 'Professor'}</p>
              <button onClick={() => signOut()} className="truncate text-xs text-muted-foreground hover:text-foreground">
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
