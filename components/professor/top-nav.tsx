'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Menu, Search, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/components/auth/auth-provider';

export function ProfessorTopNav({
  onOpenMobile,
  onOpenChat,
}: {
  onOpenMobile: () => void;
  onOpenChat: () => void;
}) {
  const [query, setQuery] = React.useState('');
  const { profile } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button onClick={onOpenMobile} aria-label="Open menu" className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden">
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative hidden flex-1 sm:block sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lectures, courses..."
            className="h-10 w-full rounded-xl border border-border bg-muted/40 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/50 focus:bg-background"
          />
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
          <button
            onClick={onOpenChat}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">AI Assistant</span>
          </button>

          <button aria-label="Notifications" className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted/40 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">3</span>
          </button>

          <ThemeToggle />

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-primary-foreground">
            {(profile?.full_name || 'P')[0]}
          </div>
        </div>
      </div>
    </header>
  );
}
