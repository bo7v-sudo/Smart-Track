'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, GraduationCap, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';

export type StepDef = {
  id: number;
  title: string;
  subtitle: string;
};

export function WizardShell({
  steps,
  current,
  canProceed,
  onNext,
  onBack,
  isLast,
  isGenerating,
  onFinish,
  children,
}: {
  steps: StepDef[];
  current: number;
  canProceed: boolean;
  onNext: () => void;
  onBack: () => void;
  isLast: boolean;
  isGenerating: boolean;
  onFinish: () => void;
  children: React.ReactNode;
}) {
  const step = steps[current];
  const progress = ((current + 1) / steps.length) * 100;

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-radial from-primary/10 via-accent/5 to-transparent blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -right-20 top-1/3 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />
      </div>

      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <a href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="font-display text-base font-semibold">
            Smart<span className="text-primary">Track</span>
          </span>
        </a>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-medium text-muted-foreground sm:block">
            Step {current + 1} of {steps.length}
          </span>
          <ThemeToggle />
        </div>
      </header>

      {/* Progress bar */}
      <div className="px-4 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          {/* Step dots */}
          <div className="mt-3 hidden justify-between sm:flex">
            {steps.map((s, i) => (
              <button
                key={s.id}
                onClick={() => i < current && onBack()}
                disabled={i >= current}
                className={cn(
                  'flex items-center gap-1.5 text-xs font-medium transition-colors',
                  i < current
                    ? 'cursor-pointer text-primary'
                    : i === current
                      ? 'text-foreground'
                      : 'text-muted-foreground/50',
                )}
              >
                <span
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-all',
                    i < current
                      ? 'bg-primary text-primary-foreground'
                      : i === current
                        ? 'bg-primary/20 text-primary ring-2 ring-primary/30'
                        : 'bg-muted text-muted-foreground',
                  )}
                >
                  {i < current ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span className="hidden lg:block">{s.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="rounded-3xl glass-card p-6 shadow-soft sm:p-8">
                <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  {step.title}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">{step.subtitle}</p>
                <div className="mt-6">{children}</div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={onBack}
              disabled={current === 0 || isGenerating}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all',
                current === 0
                  ? 'pointer-events-none opacity-0'
                  : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground',
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {!isLast ? (
              <button
                onClick={onNext}
                disabled={!canProceed}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
              >
                Continue
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            ) : (
              <motion.button
                onClick={onFinish}
                disabled={isGenerating}
                whileHover={{ scale: isGenerating ? 1 : 1.02 }}
                whileTap={{ scale: isGenerating ? 1 : 0.98 }}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-70"
              >
                {isGenerating ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate My AI Study Profile
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
