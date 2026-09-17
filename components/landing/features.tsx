'use client';

import { motion } from 'framer-motion';
import {
  Brain,
  LineChart,
  FileText,
  HelpCircle,
  CalendarCheck,
  TrendingUp,
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Predictive study risk detection',
    desc: 'AI analyzes your progress and patterns to flag when you are likely to fall behind — weeks before it shows up on a transcript.',
  },
  {
    icon: LineChart,
    title: 'Real-time GPA prediction',
    desc: 'See exactly where you stand. Smart Track forecasts your GPA every week based on assignments, quizzes, and exam performance.',
  },
  {
    icon: FileText,
    title: 'Lecture summaries in seconds',
    desc: 'Upload recordings or notes and get clean, structured summaries with key concepts, definitions, and takeaways instantly.',
  },
  {
    icon: HelpCircle,
    title: 'Auto-generated practice quizzes',
    desc: 'Turn any lecture, chapter, or syllabus into a personalized quiz with instant feedback to test what you actually know.',
  },
  {
    icon: CalendarCheck,
    title: 'Smart exam preparation',
    desc: 'Countdowns, spaced repetition, and adaptive review plans built around your exam schedule and weak spots.',
  },
  {
    icon: TrendingUp,
    title: 'Personalized study plans',
    desc: 'Daily study schedules generated from your courses, deadlines, and learning style — so every hour counts.',
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Features"
          title="Your entire academic life, on autopilot"
          subtitle="One AI workspace that organizes every course, deadline, and lecture — so you can focus on learning, not logistics."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="group relative rounded-2xl glass-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
            >
              <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-primary/0 to-accent/0 opacity-0 transition-opacity duration-300 group-hover:from-primary/5 group-hover:to-accent/10 group-hover:opacity-100" />
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-2xl text-center"
    >
      <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
        {eyebrow}
      </span>
      <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
