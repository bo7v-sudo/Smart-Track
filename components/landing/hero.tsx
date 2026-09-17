'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Play,
  Sparkles,
  TrendingUp,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  Calendar,
  Brain,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const courses = [
  { name: 'Organic Chemistry', progress: 78, color: 'from-primary to-accent' },
  { name: 'Linear Algebra', progress: 64, color: 'from-accent to-primary' },
  { name: 'Microeconomics', progress: 91, color: 'from-primary to-accent' },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-radial from-primary/30 via-accent/10 to-transparent blur-3xl" />
        <div className="absolute -left-20 top-40 h-72 w-72 rounded-full bg-primary/20 blur-[100px] animate-blob" />
        <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-accent/20 blur-[100px] animate-blob animation-delay-2000" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2 lg:gap-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start"
        >
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs font-medium text-foreground/80"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            AI-powered academic operating system
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Study Smarter.{' '}
            <span className="text-gradient">Never Fall Behind Again.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            Smart Track uses AI to predict study risks, organize your academic
            life, generate personalized study plans, summarize lectures, create
            quizzes, and help students achieve higher grades.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <a
              href="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
            >
              Start free trial
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#how-it-works"
              className="group inline-flex items-center justify-center gap-2 rounded-xl glass px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-primary/10"
            >
              <Play className="h-4 w-4 fill-current" />
              Watch demo
            </a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Free for students
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              No credit card
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Cancel anytime
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="relative"
        >
          <HeroIllustration />
        </motion.div>
      </div>
    </section>
  );
}

function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      {/* Glow */}
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary/30 via-accent/20 to-transparent blur-2xl" />

      {/* Main glass card — student learning dashboard */}
      <div className="glass-card rounded-3xl p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
              <GraduationCap className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">My semester</p>
              <p className="text-xs text-muted-foreground">Fall 2026 · 4 courses</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent">
            <TrendingUp className="h-3 w-3" />
            GPA 3.7
          </span>
        </div>

        {/* GPA prediction gauge */}
        <div className="mt-5 rounded-2xl bg-muted/40 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Predicted GPA</p>
              <p className="font-display text-2xl font-semibold">3.74</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Trend</p>
              <p className="text-sm font-semibold text-accent">+0.21</p>
            </div>
          </div>
          <div className="relative mt-3 h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '82%' }}
              transition={{ duration: 1.1, delay: 0.7, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-accent"
            />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            On track for Dean's List
          </p>
        </div>

        {/* Course progress */}
        <div className="mt-4 space-y-3">
          {courses.map((c, i) => (
            <div key={c.name}>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium">
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                  {c.name}
                </span>
                <span className="text-muted-foreground">{c.progress}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.progress}%` }}
                  transition={{ duration: 0.9, delay: 0.8 + i * 0.15, ease: 'easeOut' }}
                  className={cn('h-full rounded-full bg-gradient-to-r', c.color)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming exam */}
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-primary/10 p-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
            <Calendar className="h-4 w-4" />
          </span>
          <div className="flex-1">
            <p className="text-xs font-semibold">Organic Chem Midterm</p>
            <p className="text-[11px] text-muted-foreground">In 4 days · 8 chapters to review</p>
          </div>
          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-accent">
            Prep ready
          </span>
        </div>
      </div>

      {/* Floating: AI study assistant */}
      <motion.div
        initial={{ opacity: 0, x: 30, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, delay: 0.9 }}
        className="absolute -right-4 -top-6 w-48 rounded-2xl glass p-3 shadow-soft sm:-right-10"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <span className="text-xs font-semibold">AI study assistant</span>
        </div>
        <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
          You're 2 chapters behind in Linear Algebra. I made a 3-day catch-up plan.
        </p>
        <div className="mt-2.5 flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              className="h-1.5 w-1.5 rounded-full bg-accent"
            />
          ))}
          <span className="ml-1 text-[10px] text-muted-foreground">typing</span>
        </div>
      </motion.div>

      {/* Floating: quiz score */}
      <motion.div
        initial={{ opacity: 0, x: -30, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, delay: 1.1 }}
        className="absolute -bottom-8 -left-4 w-44 rounded-2xl glass p-3 shadow-soft sm:-left-10"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/20 text-accent">
            <Brain className="h-3.5 w-3.5" />
          </span>
          <div>
            <p className="text-xs font-semibold">Practice quiz</p>
            <p className="text-[11px] text-muted-foreground">Auto-generated</p>
          </div>
        </div>
        <div className="mt-2 flex items-end justify-between">
          <p className="font-display text-2xl font-semibold text-gradient">94%</p>
          <p className="text-[11px] text-muted-foreground">12/13 correct</p>
        </div>
      </motion.div>
    </div>
  );
}
