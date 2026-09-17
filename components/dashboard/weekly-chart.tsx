'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp } from 'lucide-react';
import { weeklyProgress } from '@/lib/dashboard-data';

export function WeeklyChart() {
  const [metric, setMetric] = React.useState<'hours' | 'focus'>('hours');
  const maxVal = Math.max(...weeklyProgress.map((d) => d[metric]));
  const avg =
    weeklyProgress.reduce((sum, d) => sum + d[metric], 0) /
    weeklyProgress.length;

  return (
    <div className="rounded-2xl glass-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="font-display text-base font-semibold">
            Weekly progress
          </h3>
        </div>
        <div className="flex gap-1 rounded-lg bg-muted/50 p-1">
          {(['hours', 'focus'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={
                'rounded-md px-3 py-1 text-xs font-medium capitalize transition-all ' +
                (metric === m
                  ? 'bg-background text-foreground shadow-soft'
                  : 'text-muted-foreground hover:text-foreground')
              }
            >
              {m === 'hours' ? 'Hours' : 'Focus %'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="font-display text-2xl font-semibold">
          {avg.toFixed(1)}
          {metric === 'hours' ? 'h' : '%'}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
          <TrendingUp className="h-3 w-3" />
          {metric === 'hours' ? '+18%' : '+6%'} vs last week
        </span>
      </div>

      {/* Chart */}
      <div className="mt-6 flex h-40 items-end justify-between gap-2 sm:gap-3">
        {weeklyProgress.map((d, i) => {
          const heightPct = (d[metric] / maxVal) * 100;
          const isToday = i === 5;
          return (
            <div
              key={d.day}
              className="group flex flex-1 flex-col items-center gap-2"
            >
              <div className="relative flex h-full w-full items-end justify-center">
                <div className="absolute -top-7 hidden rounded-md bg-foreground px-1.5 py-0.5 text-[10px] font-medium text-background opacity-0 transition-opacity group-hover:opacity-100 sm:block">
                  {d[metric]}
                  {metric === 'hours' ? 'h' : '%'}
                </div>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: 'easeOut' }}
                  className={
                    'w-full max-w-[34px] rounded-lg bg-gradient-to-t transition-all ' +
                    (isToday
                      ? 'from-accent to-primary'
                      : 'from-primary/40 to-accent/60 group-hover:from-primary/60 group-hover:to-accent')
                  }
                />
              </div>
              <span
                className={
                  'text-[11px] ' +
                  (isToday ? 'font-semibold text-foreground' : 'text-muted-foreground')
                }
              >
                {d.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
