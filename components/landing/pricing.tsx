'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/landing/features';

const plans = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    description: 'For students getting started with smarter studying.',
    features: [
      '1 course tracked',
      '5 lecture summaries / month',
      'Basic GPA tracker',
      '10 practice quizzes / month',
      'Community support',
    ],
    cta: 'Get started free',
    featured: false,
  },
  {
    name: 'Plus',
    price: { monthly: 8, yearly: 6 },
    description: 'For students who want the full AI study toolkit.',
    features: [
      'Unlimited courses',
      'Unlimited lecture summaries',
      'Predictive GPA & risk alerts',
      'Unlimited practice quizzes',
      'Personalized study plans',
      'Priority support',
    ],
    cta: 'Start free trial',
    featured: true,
  },
  {
    name: 'Campus',
    price: { monthly: null, yearly: null },
    description: 'For universities and departments at scale.',
    features: [
      'Everything in Plus, for all students',
      'Faculty analytics dashboard',
      'SSO & institutional access',
      'Early-alert interventions',
      'Custom integrations',
      'Dedicated success manager',
    ],
    cta: 'Contact us',
    featured: false,
  },
];

export function Pricing() {
  const [yearly, setYearly] = React.useState(true);

  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Pricing"
          title="Priced for student budgets"
          subtitle="Start free forever. Upgrade when you want the full AI study toolkit. Special pricing for verified students."
        />

        {/* Billing toggle */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span
            className={cn(
              'text-sm font-medium transition-colors',
              !yearly ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            Monthly
          </span>
          <button
            onClick={() => setYearly((v) => !v)}
            className={cn(
              'relative h-7 w-12 rounded-full transition-colors',
              yearly ? 'bg-gradient-to-r from-primary to-accent' : 'bg-muted'
            )}
            aria-label="Toggle billing period"
          >
            <motion.span
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={cn(
                'absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm',
                yearly ? 'left-6' : 'left-1'
              )}
            />
          </button>
          <span
            className={cn(
              'text-sm font-medium transition-colors',
              yearly ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            Yearly
          </span>
          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent">
            Save 25%
          </span>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                'relative flex flex-col rounded-3xl p-7 shadow-soft transition-all duration-300 hover:-translate-y-1',
                plan.featured
                  ? 'glass-card ring-2 ring-primary/40 hover:shadow-glow lg:scale-[1.03]'
                  : 'glass-card hover:shadow-glow'
              )}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1 text-xs font-semibold text-primary-foreground shadow-glow">
                  <Sparkles className="h-3 w-3" />
                  Most popular
                </span>
              )}

              <h3 className="font-display text-lg font-semibold">{plan.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                {plan.price.monthly === null ? (
                  <span className="font-display text-4xl font-semibold">
                    Custom
                  </span>
                ) : (
                  <>
                    <span className="font-display text-4xl font-semibold">
                      ${yearly ? plan.price.yearly : plan.price.monthly}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      /mo
                    </span>
                  </>
                )}
              </div>
              {plan.price.monthly !== null && plan.price.monthly > 0 && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {yearly ? 'billed annually' : 'billed monthly'}
                </p>
              )}

              <a
                href="#top"
                className={cn(
                  'mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all',
                  plan.featured
                    ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-glow hover:scale-[1.03]'
                    : 'glass hover:bg-primary/10'
                )}
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4" />
              </a>

              <ul className="mt-7 space-y-3">
                {plan.features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-start gap-2.5 text-sm text-foreground/85"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                      <Check className="h-3 w-3" />
                    </span>
                    {feat}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
