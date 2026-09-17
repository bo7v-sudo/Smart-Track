'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  HelpCircle,
  FileText,
  Headphones,
  PencilLine,
  Plus,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { studyTasks, type StudyTask } from '@/lib/dashboard-data';

const typeIcons: Record<StudyTask['type'], LucideIcon> = {
  reading: BookOpen,
  quiz: HelpCircle,
  review: PencilLine,
  assignment: FileText,
  lecture: Headphones,
  summary: FileText,
};

const priorityStyle: Record<StudyTask['priority'], string> = {
  high: 'bg-red-500/15 text-red-400 dark:text-red-400',
  medium: 'bg-amber-500/15 text-amber-500',
  low: 'bg-emerald-500/15 text-emerald-500',
};

export function TodayTasks() {
  const [tasks, setTasks] = React.useState<StudyTask[]>(studyTasks);

  const toggle = (id: string) =>
    setTasks((ts) =>
      ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );

  const completed = tasks.filter((t) => t.done).length;
  const total = tasks.length;

  return (
    <div className="flex h-full flex-col rounded-2xl glass-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-semibold">Today's tasks</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {completed} of {total} completed
          </p>
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/20">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          animate={{ width: `${(completed / total) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
        />
      </div>

      {/* Task list */}
      <div className="mt-4 flex-1 space-y-2 overflow-y-auto pr-1">
        {tasks.map((task, i) => {
          const Icon = typeIcons[task.type] ?? BookOpen;
          return (
            <motion.button
              key={task.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              onClick={() => toggle(task.id)}
              className={cn(
                'group flex w-full items-center gap-3 rounded-xl border border-transparent p-3 text-left transition-all',
                task.done
                  ? 'bg-muted/30'
                  : 'hover:border-border hover:bg-muted/40',
              )}
            >
              {task.done ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
              )}
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground',
                  !task.done && 'text-primary',
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    'truncate text-sm font-medium',
                    task.done && 'text-muted-foreground line-through',
                  )}
                >
                  {task.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {task.subject}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize',
                    priorityStyle[task.priority],
                  )}
                >
                  {task.priority}
                </span>
                <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
                  <Clock className="h-3 w-3" />
                  {task.duration}m
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
