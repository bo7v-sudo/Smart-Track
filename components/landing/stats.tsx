'use client';

import { motion, useInView } from 'framer-motion';
import * as React from 'react';

const stats = [
  { value: 500, suffix: 'K+', label: 'Students onboard' },
  { value: 1.2, suffix: 'M', label: 'Lectures summarized', decimals: 1 },
  { value: 0.4, suffix: ' GPA', label: 'Average grade lift', decimals: 1 },
  { value: 4.9, suffix: '/5', label: 'Student rating', decimals: 1 },
];

function CountUp({
  end,
  decimals = 0,
  suffix = '',
}: {
  end: number;
  decimals?: number;
  suffix?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const duration = 1600;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(end * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end]);

  const formatted =
    decimals > 0
      ? count.toFixed(decimals)
      : Math.round(count).toLocaleString();

  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-3xl glass-card p-8 shadow-soft sm:p-12">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <p className="font-display text-4xl font-semibold tracking-tight text-gradient sm:text-5xl">
                  <CountUp
                    end={s.value}
                    decimals={s.decimals}
                    suffix={s.suffix}
                  />
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
