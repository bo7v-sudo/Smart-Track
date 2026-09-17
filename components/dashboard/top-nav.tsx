'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Menu, Search, Sparkles, Command } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { notifications, student } from '@/lib/dashboard-data';

export function TopNav({
  onOpenMobile,
  onOpenChat,
}: {
  onOpenMobile: () => void;
  onOpenChat: () => void;
}) {
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        {/* Mobile menu */}
        <button
          onClick={onOpenMobile}
          aria-label="Open menu"
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <div className="relative hidden flex-1 sm:block sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, tasks, lectures..."
            className="h-10 w-full rounded-xl border border-border bg-muted/40 pl-10 pr-16 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/50 focus:bg-background"
          />
          <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:flex">
            <Command className="h-3 w-3" />K
          </kbd>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
          {/* AI chat button */}
          <button
            onClick={onOpenChat}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen((v) => !v)}
              aria-label="Notifications"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted/40 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Bell className="h-[18px] w-[18px]" />
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                  {unread}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotifOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-border bg-popover shadow-soft"
                  >
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                      <p className="text-sm font-semibold">Notifications</p>
                      <span className="text-xs text-muted-foreground">
                        {unread} unread
                      </span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={cn(
                            'flex gap-3 border-b border-border/60 px-4 py-3 transition-colors hover:bg-muted/40',
                            !n.read && 'bg-primary/[0.04]',
                          )}
                        >
                          {!n.read && (
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                          )}
                          <div className={cn(!n.read && 'pl-0', n.read && 'pl-5')}>
                            <p className="text-sm font-medium">{n.title}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {n.detail}
                            </p>
                            <p className="mt-1 text-[11px] text-muted-foreground/70">
                              {n.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-2.5 text-center text-xs font-medium text-primary transition-colors hover:bg-primary/5">
                      Mark all as read
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <ThemeToggle />

          {/* Avatar */}
          <button className="hidden items-center gap-2 rounded-xl border border-border bg-muted/40 py-1.5 pl-1.5 pr-3 transition-colors hover:bg-muted sm:flex">
            <img
              src={student.avatar}
              alt={student.name}
              className="h-7 w-7 rounded-lg object-cover"
            />
            <span className="text-sm font-medium">{student.name.split(' ')[0]}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
