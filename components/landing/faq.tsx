'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { SectionHeading } from '@/components/landing/features';
import { cn } from '@/lib/utils';

const faqs = [
  {
    q: 'How does Smart Track predict my GPA?',
    a: 'Smart Track analyzes your assignment scores, quiz performance, study consistency, and historical grade patterns. It combines those signals to forecast your GPA every week — and explains the reasoning so you know exactly what to improve.',
  },
  {
    q: 'What can the AI study assistant do?',
    a: 'It summarizes lectures into clean notes, generates practice quizzes from any material, builds personalized daily study plans, predicts study risks before they hurt your grades, and answers questions about your course content 24/7.',
  },
  {
    q: 'Is Smart Track free for students?',
    a: 'Yes. The Free plan is free forever and includes one course, lecture summaries, a basic GPA tracker, and practice quizzes. Plus unlocks unlimited everything for the price of a couple coffees a month, with special pricing for verified students.',
  },
  {
    q: 'Which file types can I upload?',
    a: 'You can upload lecture recordings (audio and video), PDFs, slides, handwritten note scans, and syllabi. Smart Track extracts the key concepts and turns them into summaries, flashcards, and quizzes automatically.',
  },
  {
    q: 'Will it work for my major?',
    a: 'Absolutely. Smart Track is used by students across STEM, humanities, business, law, and medicine. The AI adapts to each subject — from problem sets to case readings to lab reports.',
  },
  {
    q: 'Is my academic data private?',
    a: 'Completely. Your notes, grades, and recordings are encrypted and never shared with your university or third parties. You can export or delete everything at any time. Campus plans give institutions aggregate, anonymized insights only.',
  },
];

function FaqRow({ faq, index }: { faq: { q: string; a: string }; index: number }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="overflow-hidden rounded-2xl glass-card">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="font-medium">{faq.q}</span>
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors',
            open ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground/70'
          )}
        >
          <Plus className="h-4 w-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <p className="px-5 pb-5 pl-[3.75rem] text-sm leading-relaxed text-muted-foreground">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          subtitle="Everything you need to know about Smart Track. Can't find an answer? Reach out to our team."
        />

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <FaqRow faq={faq} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
