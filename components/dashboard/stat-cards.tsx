'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Flame, Gauge, Clock } from 'lucide-react';
import { student } from '@/lib/dashboard-data';

const cards = [
  {
    id: 'gpa',
    label: 'Predicted GPA',
    value: student.gpa.toFixed(2),
    sub: '+0.21 this month',
    icon: TrendingUp,
    accent: 'text-accent',
    ring: 'from-primary/20 to-accent/20',
  },
  {
    id: 'streak',
    label: 'Study streak',
    value: `${student.streak} days`,
    sub: '3 days to record',
    icon: Flame,
    accent: 'text-orange-400',
    ring: 'from-orange-400/20 to-amber-400/20',
  },
  {
    id: 'productivity',
    label: 'Productivity score',
    value: `${student.productivity}`,
    sub: 'Top 8% of students',
    icon: Gauge,
    accent: 'text-primary',
    ring: 'from-primary/20 to-primary/10',
  },
  {
    id: 'focus',
    label: 'Focus time today',
    value: '3h 42m',
    sub: 'Goal: 5h 00m',
    icon: Clock,
    accent: 'text-accent',
    ring: 'from-accent/20 to-accent/10',
  },
];

export function StatCards() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="group relative overflow-hidden rounded-2xl glass-card p-4 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow sm:p-5"
        >
          <div
            className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${c.ring} opacity-60 blur-2xl transition-opacity group-hover:opacity-100`}
          />
          <div className="relative flex items-center justify-between">
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl bg-muted/50 ${c.accent}`}
            >
              <c.icon className="h-[18px] w-[18px]" />
            </span>
            <span className={`text-xs font-medium ${c.accent}`}>{c.sub}</span>
          </div>
          <p className="relative mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {c.value}
          </p>
          <p className="relative mt-0.5 text-xs text-muted-foreground">
            {c.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
