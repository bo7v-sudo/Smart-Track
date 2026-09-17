'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { statusConfig, type LectureStatus } from '@/lib/professor-ai';

export function StatusBadge({ status, animate = false }: { status: LectureStatus; animate?: boolean }) {
  const cfg = statusConfig[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', cfg.color)}>
      <span className="relative flex h-1.5 w-1.5">
        {animate && (status === 'processing' || status === 'uploading') && (
          <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-75', cfg.dot)} />
        )}
        <span className={cn('relative inline-flex h-1.5 w-1.5 rounded-full', cfg.dot)} />
      </span>
      {cfg.label}
    </span>
  );
}

export function QualityScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-amber-500' : 'text-destructive';
  const strokeColor = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="-rotate-90" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} className="stroke-muted" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke={strokeColor}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={cn('font-display text-2xl font-bold', color)}>{score}</span>
        <span className="text-[10px] text-muted-foreground">Quality</span>
      </div>
    </div>
  );
}

export function QualityBars({ quality }: {
  quality: { readability: number; completeness: number; difficulty: number; studentFriendliness: number; overall: number };
}) {
  const bars = [
    { label: 'Readability', value: quality.readability, color: 'from-primary to-accent' },
    { label: 'Completeness', value: quality.completeness, color: 'from-emerald-500 to-teal-500' },
    { label: 'Difficulty', value: quality.difficulty, color: 'from-amber-500 to-orange-500' },
    { label: 'Student Friendly', value: quality.studentFriendliness, color: 'from-blue-500 to-cyan-500' },
  ];
  return (
    <div className="space-y-3">
      {bars.map((b) => (
        <div key={b.label}>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-muted-foreground">{b.label}</span>
            <span className="font-semibold">{b.value}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${b.value}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={cn('h-full rounded-full bg-gradient-to-r', b.color)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground">
        <Icon className="h-8 w-8" />
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-muted/60', className)} />;
}

export { AnimatePresence, motion };
