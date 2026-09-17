'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Layout,
  Lightbulb,
  AlignLeft,
  MessageSquare,
  HelpCircle,
  Layers,
  BookOpen,
  Target,
  BarChart3,
  Check,
  type LucideIcon,
  UploadCloud,
  Bell,
  Calendar,
  Package,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { processingSteps, publishSteps, type ProcessingStep } from '@/lib/professor-ai';

const iconMap: Record<string, LucideIcon> = {
  file: FileText,
  layout: Layout,
  lightbulb: Lightbulb,
  'align-left': AlignLeft,
  message: MessageSquare,
  help: HelpCircle,
  layers: Layers,
  book: BookOpen,
  target: Target,
  chart: BarChart3,
  upload: UploadCloud,
  bell: Bell,
  calendar: Calendar,
  package: Package,
  trending: TrendingUp,
  check: Check,
};

export function ProcessingAnimation({
  steps,
  title,
  subtitle,
  onComplete,
  stepDuration = 600,
}: {
  steps: ProcessingStep[];
  title: string;
  subtitle: string;
  onComplete: () => void;
  stepDuration?: number;
}) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const completedRef = React.useRef(false);

  React.useEffect(() => {
    if (currentStep >= steps.length) {
      if (!completedRef.current) {
        completedRef.current = true;
        const t = setTimeout(onComplete, 400);
        return () => clearTimeout(t);
      }
      return;
    }
    const t = setTimeout(() => setCurrentStep((s) => s + 1), stepDuration);
    return () => clearTimeout(t);
  }, [currentStep, steps.length, onComplete, stepDuration]);

  return (
    <div className="relative flex min-h-[60vh] flex-col items-center justify-center px-4">
      {/* Pulsing orb */}
      <div className="relative mb-10 flex h-32 w-32 items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent blur-2xl"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-3 rounded-full border-2 border-dashed border-accent/20"
        />
        <motion.span
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow"
        >
          <Lightbulb className="h-7 w-7" />
        </motion.span>
      </div>

      <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>

      {/* Steps */}
      <div className="mt-10 w-full max-w-md space-y-2.5">
        {steps.map((step, i) => {
          const Icon = iconMap[step.icon] ?? Check;
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: done || active ? 1 : 0.4, x: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'flex items-center gap-3 rounded-xl border p-3 transition-colors',
                done ? 'border-emerald-500/30 bg-emerald-500/5' : active ? 'border-primary/30 bg-primary/5' : 'border-border bg-muted/20',
              )}
            >
              <span className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
                done ? 'bg-emerald-500/15 text-emerald-500' : active ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground',
              )}>
                {done ? <Check className="h-4 w-4" /> : active ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                ) : <Icon className="h-4 w-4" />}
              </span>
              <span className={cn('flex-1 text-sm font-medium', done || active ? 'text-foreground' : 'text-muted-foreground')}>
                {step.label}
              </span>
              {active && (
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-xs text-primary"
                >
                  Working...
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-8 w-full max-w-md">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {Math.min(currentStep, steps.length)} of {steps.length} steps complete
        </p>
      </div>
    </div>
  );
}

export { processingSteps, publishSteps };
