'use client';

import { motion } from 'framer-motion';
import { BookOpen, Clock, ArrowUpRight, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { subjects } from '@/lib/dashboard-data';

const gradeColor: Record<string, string> = {
  A: 'text-emerald-500 bg-emerald-500/10',
  'A-': 'text-emerald-500 bg-emerald-500/10',
  'B+': 'text-accent bg-accent/10',
  B: 'text-primary bg-primary/10',
  'C+': 'text-amber-500 bg-amber-500/10',
  C: 'text-orange-400 bg-orange-400/10',
};

export function SubjectCards() {
  return (
    <div className="rounded-2xl glass-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="font-display text-base font-semibold">My subjects</h3>
        </div>
        <button className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80">
          View all
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {subjects.map((subject, i) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border/60 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft"
          >
            <div
              className={cn(
                'pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-gradient-to-br opacity-10 blur-2xl transition-opacity group-hover:opacity-20',
                subject.color,
              )}
            />
            <div className="relative flex items-start justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{subject.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {subject.code}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'rounded-lg px-2 py-0.5 text-xs font-bold',
                    gradeColor[subject.grade] ?? 'bg-muted text-muted-foreground',
                  )}
                >
                  {subject.grade}
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>
            </div>

            {/* Progress */}
            <div className="relative mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Course progress</span>
                <span className="font-medium">{subject.progress}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${subject.progress}%` }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
                  className={cn('h-full rounded-full bg-gradient-to-r', subject.color)}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="relative mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {subject.hoursThisWeek}h this week
              </span>
              <span className="inline-flex items-center gap-1">
                Next: {subject.nextExam}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
