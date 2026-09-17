'use client';

import { motion } from 'framer-motion';
import { Upload, BrainCircuit, GraduationCap } from 'lucide-react';
import { SectionHeading } from '@/components/landing/features';

const steps = [
  {
    icon: Upload,
    title: 'Connect your courses',
    desc: 'Import your syllabi, lecture recordings, and deadlines. Smart Track builds a complete picture of your semester in minutes.',
  },
  {
    icon: BrainCircuit,
    title: 'AI learns your patterns',
    desc: 'Smart Track analyzes your progress, strengths, and gaps to predict risks, generate study plans, and surface what matters next.',
  },
  {
    icon: GraduationCap,
    title: 'Achieve your goals',
    desc: 'Study smarter with daily plans, practice quizzes, lecture summaries, and real-time GPA predictions that keep you on track to graduate.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-dots [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="How it works"
          title="From overwhelmed to on track in three steps"
          subtitle="No spreadsheets, no sticky notes, no missed deadlines. Smart Track fits the way you already study."
        />

        <div className="relative mt-16 grid gap-8 lg:grid-cols-3">
          {/* Connecting line */}
          <div className="pointer-events-none absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative"
            >
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="relative">
                  <span className="flex h-18 w-18 items-center justify-center rounded-2xl glass-card p-5 shadow-soft">
                    <step.icon className="h-8 w-8 text-primary" />
                  </span>
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-primary-foreground shadow-glow">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
