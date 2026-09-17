'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Quote,
  HelpCircle,
  FileText,
  CalendarCheck,
  Award,
  Flame,
  AlertTriangle,
  Lightbulb,
  CalendarPlus,
  RefreshCw,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  motivationQuotes,
  activities,
  recommendations,
  type Activity,
  type AIRecommendation,
} from '@/lib/dashboard-data';
import * as React from 'react';

const activityIcons: Record<Activity['icon'], LucideIcon> = {
  quiz: HelpCircle,
  summary: FileText,
  plan: CalendarCheck,
  grade: Award,
  streak: Flame,
};

const activityColors: Record<Activity['icon'], string> = {
  quiz: 'bg-accent/15 text-accent',
  summary: 'bg-primary/15 text-primary',
  plan: 'bg-violet-500/15 text-violet-400',
  grade: 'bg-emerald-500/15 text-emerald-500',
  streak: 'bg-orange-400/15 text-orange-400',
};

const recIcons: Record<AIRecommendation['icon'], LucideIcon> = {
  alert: AlertTriangle,
  tip: Lightbulb,
  plan: CalendarPlus,
  quiz: HelpCircle,
};

const recColors: Record<AIRecommendation['icon'], string> = {
  alert: 'bg-red-500/15 text-red-400',
  tip: 'bg-amber-500/15 text-amber-500',
  plan: 'bg-primary/15 text-primary',
  quiz: 'bg-accent/15 text-accent',
};

export function DailyMotivation() {
  const [idx, setIdx] = React.useState(0);
  const quote = motivationQuotes[idx];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-accent/15 p-5">
      <Quote className="h-8 w-8 text-primary/30" />
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          <p className="mt-3 text-sm font-medium leading-relaxed">
            &ldquo;{quote.quote}&rdquo;
          </p>
          <p className="mt-2 text-xs text-muted-foreground">— {quote.author}</p>
        </motion.div>
      </AnimatePresence>
      <button
        onClick={() => setIdx((i) => (i + 1) % motivationQuotes.length)}
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/80"
      >
        <RefreshCw className="h-3 w-3" />
        New quote
      </button>
    </div>
  );
}

export function RecentActivity() {
  return (
    <div className="rounded-2xl glass-card p-5 shadow-soft">
      <h3 className="font-display text-base font-semibold">Recent activity</h3>
      <div className="mt-4 space-y-1">
        {activities.map((a, i) => {
          const Icon = activityIcons[a.icon] ?? FileText;
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/40"
            >
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                  activityColors[a.icon],
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug text-foreground/90">
                  {a.text}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function AIRecommendations() {
  return (
    <div className="rounded-2xl glass-card p-5 shadow-soft">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <Lightbulb className="h-4 w-4" />
        </span>
        <h3 className="font-display text-base font-semibold">
          AI recommendations
        </h3>
      </div>
      <div className="mt-4 space-y-3">
        {recommendations.map((rec, i) => {
          const Icon = recIcons[rec.icon] ?? Lightbulb;
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="group rounded-xl border border-border/60 p-3.5 transition-colors hover:border-primary/30"
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                    recColors[rec.icon],
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{rec.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {rec.detail}
                  </p>
                  <button className="mt-2.5 inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/20">
                    {rec.action}
                    <span className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
