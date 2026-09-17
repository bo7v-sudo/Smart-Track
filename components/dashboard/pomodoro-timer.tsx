'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

type Mode = 'focus' | 'break';

const MODES: Record<Mode, { label: string; minutes: number; icon: typeof Brain }> = {
  focus: { label: 'Focus', minutes: 25, icon: Brain },
  break: { label: 'Break', minutes: 5, icon: Coffee },
};

export function PomodoroTimer() {
  const [mode, setMode] = React.useState<Mode>('focus');
  const [secondsLeft, setSecondsLeft] = React.useState(MODES.focus.minutes * 60);
  const [running, setRunning] = React.useState(false);
  const [sessions, setSessions] = React.useState(3);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  React.useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (mode === 'focus') setSessions((n) => n + 1);
          const nextMode: Mode = mode === 'focus' ? 'break' : 'focus';
          setMode(nextMode);
          return MODES[nextMode].minutes * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, mode]);

  const switchMode = (m: Mode) => {
    setMode(m);
    setSecondsLeft(MODES[m].minutes * 60);
    setRunning(false);
  };

  const reset = () => {
    setSecondsLeft(MODES[mode].minutes * 60);
    setRunning(false);
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const total = MODES[mode].minutes * 60;
  const progress = ((total - secondsLeft) / total) * 100;
  const circumference = 2 * Math.PI * 70;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex h-full flex-col rounded-2xl glass-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-semibold">Focus timer</h3>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          {sessions} sessions
        </span>
      </div>

      {/* Mode toggle */}
      <div className="mt-4 flex gap-1 rounded-xl bg-muted/50 p-1">
        {(Object.keys(MODES) as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-all',
              mode === m
                ? 'bg-background text-foreground shadow-soft'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {React.createElement(MODES[m].icon, { className: 'h-4 w-4' })}
            {MODES[m].label}
          </button>
        ))}
      </div>

      {/* Timer ring */}
      <div className="relative mx-auto mt-6 flex h-44 w-44 items-center justify-center">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            strokeWidth="8"
            className="stroke-muted"
          />
          <motion.circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            stroke="url(#timerGradient)"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 0.5, ease: 'linear' }}
          />
          <defs>
            <linearGradient id="timerGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center">
          <motion.span
            key={timeStr}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            className="font-display text-3xl font-semibold tabular-nums"
          >
            {timeStr}
          </motion.span>
          <span className="mt-1 text-xs text-muted-foreground">
            {mode === 'focus' ? 'Stay focused' : 'Relax'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={reset}
          aria-label="Reset"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted/40 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <RotateCcw className="h-[18px] w-[18px]" />
        </button>
        <button
          onClick={() => setRunning((r) => !r)}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow transition-transform hover:scale-105"
          aria-label={running ? 'Pause' : 'Start'}
        >
          {running ? (
            <Pause className="h-5 w-5 fill-current" />
          ) : (
            <Play className="h-5 w-5 fill-current" />
          )}
        </button>
        <button
          onClick={() => switchMode(mode === 'focus' ? 'break' : 'focus')}
          aria-label="Skip"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted/40 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Coffee className="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  );
}
