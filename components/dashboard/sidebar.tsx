'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  CheckSquare,
  HelpCircle,
  FileText,
  BarChart3,
  TrendingUp,
  Sparkles,
  ChevronLeft,
  Settings,
  LifeBuoy,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { navSections, student } from '@/lib/dashboard-data';

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Calendar,
  BookOpen,
  CheckSquare,
  HelpCircle,
  FileText,
  BarChart3,
  TrendingUp,
};

export function Sidebar({
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
      {/* Mobile overlay */}
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
        className={cn(
          'fixed left-0 top-0 z-50 hidden h-screen flex-col border-r border-border bg-card/80 backdrop-blur-xl md:flex',
        )}
      >
        <SidebarContent collapsed={collapsed} onToggle={onToggle} />
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-border bg-card/95 backdrop-blur-xl md:hidden"
          >
            <SidebarContent
              collapsed={false}
              onToggle={onCloseMobile}
              forceLogoClose
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarContent({
  collapsed,
  onToggle,
  forceLogoClose = false,
}: {
  collapsed: boolean;
  onToggle: () => void;
  forceLogoClose?: boolean;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div
        className={cn(
          'flex h-16 items-center border-b border-border px-4',
          collapsed ? 'justify-center' : 'justify-between',
        )}
      >
        <a href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow">
            <GraduationCap className="h-5 w-5" />
          </span>
          {!collapsed && (
            <span className="font-display text-base font-semibold">
              Smart<span className="text-primary">Track</span>
            </span>
          )}
        </a>
        {!collapsed && !forceLogoClose && (
          <button
            onClick={onToggle}
            aria-label="Collapse sidebar"
            className="hidden rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:block"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {collapsed && (
          <button
            onClick={onToggle}
            aria-label="Expand sidebar"
            className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4 rotate-180" />
          </button>
        )}
        {navSections.map((section) => (
          <div key={section.title} className="mb-5">
            {!collapsed && (
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = iconMap[item.icon] ?? LayoutDashboard;
                return (
                  <button
                    key={item.label}
                    className={cn(
                      'group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      'active' in item && item.active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      collapsed && 'justify-center',
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" />
                    {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
                    {!collapsed && 'badge' in item && item.badge && (
                      <span className="rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                        {item.badge}
                      </span>
                    )}
                    {collapsed && 'badge' in item && item.badge && (
                      <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Upgrade card */}
      {!collapsed && (
        <div className="px-3 pb-3">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 p-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <p className="mt-2 text-sm font-semibold">Upgrade to Plus</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Unlimited quizzes, summaries & AI plans.
            </p>
            <button className="mt-3 w-full rounded-lg bg-gradient-to-r from-primary to-accent py-2 text-xs font-semibold text-primary-foreground transition-transform hover:scale-[1.02]">
              Upgrade
            </button>
          </div>
        </div>
      )}

      {/* Bottom: settings & help */}
      <div className="border-t border-border px-3 py-3">
        <div className="space-y-1">
          <button
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
              collapsed && 'justify-center',
            )}
            title={collapsed ? 'Settings' : undefined}
          >
            <Settings className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && 'Settings'}
          </button>
          <button
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
              collapsed && 'justify-center',
            )}
            title={collapsed ? 'Help' : undefined}
          >
            <LifeBuoy className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && 'Help'}
          </button>
        </div>
      </div>

      {/* User */}
      <div className="border-t border-border p-3">
        <div
          className={cn(
            'flex items-center gap-3 rounded-xl px-2 py-2',
            collapsed && 'justify-center',
          )}
        >
          <img
            src={student.avatar}
            alt={student.name}
            className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-primary/30"
          />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{student.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {student.major}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
