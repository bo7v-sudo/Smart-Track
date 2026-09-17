'use client';

import { motion } from 'framer-motion';
import { Sparkles, Twitter, Linkedin, Github, ArrowRight } from 'lucide-react';

const footerNav = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'Security', href: '#' },
      { label: 'Student data', href: '#' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-12 overflow-hidden">
      {/* CTA band */}
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-accent px-6 py-14 text-center shadow-glow sm:px-12 sm:py-20"
        >
          <div className="pointer-events-none absolute inset-0 bg-dots opacity-20" />
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Ready to study smarter?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/85">
            Join 500,000+ students using Smart Track to stay ahead, lift their
            grades, and never fall behind again.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/register"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-primary shadow-lg transition-transform hover:scale-[1.03]"
            >
              Start free trial
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              See how it works
            </a>
          </div>
        </motion.div>
      </div>

      {/* Footer links */}
      <div className="mx-auto mt-20 max-w-6xl px-4 pb-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <a href="#top" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                <Sparkles className="h-5 w-5" />
              </span>
              <span className="font-display text-lg font-semibold">
                Smart<span className="text-primary">Track</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The AI-powered academic operating system that helps students
              study smarter, stay organized, and achieve higher grades.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Linkedin, label: 'LinkedIn' },
                { Icon: Github, label: 'GitHub' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full glass text-foreground/70 transition-colors hover:bg-primary/10 hover:text-foreground"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {footerNav.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Smart Track, Inc. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built for students who study smarter.
          </p>
        </div>
      </div>
    </footer>
  );
}
