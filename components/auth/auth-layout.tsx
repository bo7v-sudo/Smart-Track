'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Sparkles, TrendingUp, BookOpen, Brain } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

const features = [
  { icon: Brain, text: 'AI predicts study risks before they hurt your grades' },
  { icon: TrendingUp, text: 'Real-time GPA tracking and personalized study plans' },
  { icon: BookOpen, text: 'Lecture summaries and quizzes in seconds' },
];

export function AuthLayout({
  children,
  heading,
  subheading,
}: {
  children: React.ReactNode;
  heading: string;
  subheading: string;
}) {
  return (
    <div className="relative flex min-h-screen bg-background">
      {/* Brand panel — hidden on mobile */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent" />
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-20" />
        <div className="pointer-events-none absolute -left-10 top-20 h-72 w-72 rounded-full bg-white/15 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-10 right-0 h-80 w-80 rounded-full bg-accent/30 blur-[120px]" />

        <div className="relative flex h-full flex-col p-12 text-white">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <GraduationCap className="h-6 w-6" />
            </span>
            <span className="font-display text-xl font-semibold">
              Smart<span className="text-white/80">Track</span>
            </span>
          </a>

          {/* Hero text */}
          <div className="mt-auto max-w-md">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display text-4xl font-semibold leading-tight"
            >
              Study smarter.
              <br />
              Never fall behind again.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 text-lg text-white/80"
            >
              The AI-powered academic operating system trusted by 500,000+
              students worldwide.
            </motion.p>

            {/* Features */}
            <div className="mt-10 space-y-4">
              {features.map((f, i) => (
                <motion.div
                  key={f.text}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm text-white/90">{f.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer stat */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-auto flex items-center gap-6 pt-10"
          >
            <div>
              <p className="font-display text-2xl font-semibold">500K+</p>
              <p className="text-xs text-white/70">Students</p>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <p className="font-display text-2xl font-semibold">+0.4 GPA</p>
              <p className="text-xs text-white/70">Avg. lift</p>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <p className="font-display text-2xl font-semibold">4.9/5</p>
              <p className="text-xs text-white/70">Rating</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex w-full flex-col items-center justify-center px-4 py-10 sm:px-6 lg:w-1/2">
        {/* Background accents */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-radial from-primary/10 via-accent/5 to-transparent blur-3xl" />
        </div>

        {/* Mobile logo + theme toggle */}
        <div className="absolute left-4 top-4 flex items-center justify-between sm:left-6">
          <a href="/" className="flex items-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="font-display text-base font-semibold">
              Smart<span className="text-primary">Track</span>
            </span>
          </a>
        </div>
        <div className="absolute right-4 top-4 sm:right-6">
          <ThemeToggle />
        </div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <div className="mb-6 flex items-center gap-2 lg:hidden">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">
              AI-powered academic OS
            </span>
          </div>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {heading}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{subheading}</p>

          <div className="mt-8">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}
