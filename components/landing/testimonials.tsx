'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { SectionHeading } from '@/components/landing/features';

const testimonials = [
  {
    quote:
      "Smart Track flagged that I was falling behind in Organic Chem three weeks before the midterm. I followed the catch-up plan and ended with an A-. I genuinely don't think I'd have caught it in time otherwise.",
    name: 'Maya Chen',
    role: 'Pre-med, UCLA',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop',
  },
  {
    quote:
      'The lecture summaries are unreal. I upload a recording after class and get a clean breakdown of every concept in under a minute. It turned my review sessions from chaotic to actually useful.',
    name: 'Daniel Okafor',
    role: 'Computer Science, Georgia Tech',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop',
  },
  {
    quote:
      'I was working two part-time jobs and honestly drowning. The daily study plan told me exactly what to focus on each day so I stopped wasting time. My GPA went from 2.9 to 3.5 in one semester.',
    name: 'Priya Raman',
    role: 'Economics, NYU',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop',
  },
  {
    quote:
      'I tried every study app out there. Smart Track was the only one that actually felt built around how students learn — the quiz generator alone is worth it. I walk into exams knowing I am ready.',
    name: 'Lukas Bauer',
    role: 'Mechanical Engineering, TU Munich',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop',
  },
  {
    quote:
      'The GPA predictor kept me honest. Seeing it dip when I skipped a week was the push I needed. By finals week it said 3.8 and I got exactly that. It feels like having a personal academic coach.',
    name: 'Sofia Alvarez',
    role: 'Psychology, UC Berkeley',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop',
  },
  {
    quote:
      "Exam prep used to mean cramming the night before. Smart Track's spaced repetition plan had me reviewing the right things weeks ahead. I walked into my finals calm for the first time in my life.",
    name: 'Tom Whitfield',
    role: 'Law, University of Edinburgh',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop',
  },
];

function Avatar({ src, name }: { src: string; name: string }) {
  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      className="h-11 w-11 rounded-full object-cover ring-2 ring-white/40 dark:ring-white/10"
    />
  );
}

export function Testimonials() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by students who study smarter"
          subtitle="Half a million students use Smart Track to stay ahead of their coursework and lift their grades."
        />

        <div className="mt-16 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="group break-inside-avoid rounded-2xl glass-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
            >
              <Quote className="h-7 w-7 text-primary/30" />
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground/90">
                {t.quote}
              </blockquote>
              <div className="mt-5 flex items-center gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <figcaption className="mt-4 flex items-center gap-3">
                <Avatar src={t.avatar} name={t.name} />
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
