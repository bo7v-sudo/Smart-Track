'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { exams } from '@/lib/dashboard-data';

export function ExamCalendar() {
  const urgent = exams.filter((e) => e.daysAway <= 6).length;

  return (
    <div className="rounded-2xl glass-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="font-display text-base font-semibold">
            Upcoming exams
          </h3>
        </div>
        {urgent > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-1 text-xs font-semibold text-red-400">
            <AlertCircle className="h-3 w-3" />
            {urgent} soon
          </span>
        )}
      </div>

      <div className="mt-4 space-y-2.5">
        {exams.map((exam, i) => (
          <motion.div
            key={exam.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            className="group flex items-center gap-3 rounded-xl border border-border/60 p-3 transition-colors hover:border-primary/30 hover:bg-primary/[0.03]"
          >
            {/* Date block */}
            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-muted/50">
              <span className="text-[10px] font-medium uppercase text-muted-foreground">
                {exam.date.split(' ')[0]}
              </span>
              <span className="font-display text-lg font-semibold leading-none">
                {exam.date.split(' ')[1]}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{exam.title}</p>
              <p className="truncate text-xs text-muted-foreground">
                {exam.subject}
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-end">
              <span
                className={
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ' +
                  (exam.daysAway <= 4
                    ? 'bg-red-500/15 text-red-400'
                    : exam.daysAway <= 9
                      ? 'bg-amber-500/15 text-amber-500'
                      : 'bg-muted text-muted-foreground')
                }
              >
                <Clock className="h-3 w-3" />
                {exam.daysAway}d
              </span>
              <span className="mt-1 h-1.5 w-1.5 rounded-full" />
            </div>
          </motion.div>
        ))}
      </div>

      <button className="mt-4 w-full rounded-xl border border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground">
        View full calendar
      </button>
    </div>
  );
}
