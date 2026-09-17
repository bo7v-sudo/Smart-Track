'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Eye,
  Ear,
  BookOpen,
  Hand,
  Check,
  Plus,
  X,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  sunrise: Sunrise,
  sun: Sun,
  sunset: Sunset,
  moon: Moon,
  eye: Eye,
  ear: Ear,
  book: BookOpen,
  hand: Hand,
};

/* ---------- Single-select option card grid ---------- */

export function OptionCards<T extends string>({
  options,
  value,
  onChange,
  columns = 2,
}: {
  options: { value: T; label: string; icon?: string; desc?: string }[];
  value: T | '';
  onChange: (v: T) => void;
  columns?: 2 | 3 | 4;
}) {
  const colClass =
    columns === 3 ? 'sm:grid-cols-3' : columns === 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-2';

  return (
    <div className={cn('grid grid-cols-1 gap-3', colClass)}>
      {options.map((opt, i) => {
        const Icon = opt.icon ? iconMap[opt.icon] : undefined;
        const selected = value === opt.value;
        return (
          <motion.button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            whileHover={{ y: -2 }}
            className={cn(
              'group relative flex items-center gap-3 rounded-2xl border p-4 text-left transition-all',
              selected
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-border hover:border-primary/40 hover:bg-muted/30',
            )}
          >
            {Icon && (
              <span
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors',
                  selected
                    ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground'
                    : 'bg-muted text-muted-foreground group-hover:text-foreground',
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{opt.label}</p>
              {opt.desc && (
                <p className="mt-0.5 text-xs text-muted-foreground">{opt.desc}</p>
              )}
            </div>
            {selected && (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3 w-3" />
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

/* ---------- Dropdown select ---------- */

export function SelectField({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  allowCustom = false,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  allowCustom?: boolean;
}) {
  const [custom, setCustom] = React.useState(false);
  const [customValue, setCustomValue] = React.useState('');

  if (custom || (allowCustom && value && !options.includes(value))) {
    return (
      <div className="flex gap-2">
        <input
          autoFocus
          value={customValue || value}
          onChange={(e) => {
            setCustomValue(e.target.value);
            onChange(e.target.value);
          }}
          placeholder="Type your answer..."
          className="h-12 flex-1 rounded-xl border border-border bg-muted/30 px-4 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary/60 focus:bg-background focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="button"
          onClick={() => {
            setCustom(false);
            setCustomValue('');
            onChange('');
          }}
          className="rounded-xl border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
        >
          List
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'h-12 w-full appearance-none rounded-xl border border-border bg-muted/30 px-4 pr-10 text-sm outline-none transition-all focus:border-primary/60 focus:bg-background focus:ring-2 focus:ring-primary/20',
            !value && 'text-muted-foreground/60',
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-background text-foreground">
              {opt}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      {allowCustom && (
        <button
          type="button"
          onClick={() => setCustom(true)}
          className="rounded-xl border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
        >
          Custom
        </button>
      )}
    </div>
  );
}

/* ---------- Text input ---------- */

export function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  prefix,
  suffix,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="relative">
      {prefix && (
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
          {prefix}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'h-12 w-full rounded-xl border border-border bg-muted/30 px-4 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary/60 focus:bg-background focus:ring-2 focus:ring-primary/20',
          prefix && 'pl-10',
          suffix && 'pr-12',
        )}
      />
      {suffix && (
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
          {suffix}
        </span>
      )}
    </div>
  );
}

/* ---------- Number input with stepper ---------- */

export function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={() => onChange(clamp(value - step))}
        className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted/30 text-lg font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        −
      </button>
      <div className="flex min-w-[120px] flex-col items-center">
        <span className="font-display text-4xl font-semibold tabular-nums">
          {value}
        </span>
        {suffix && (
          <span className="mt-0.5 text-xs text-muted-foreground">{suffix}</span>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(clamp(value + step))}
        className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted/30 text-lg font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        +
      </button>
    </div>
  );
}

/* ---------- Slider ---------- */

export function RangeSlider({
  value,
  onChange,
  min = 0,
  max = 40,
  step = 1,
  formatValue,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  formatValue?: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="w-full">
      <div className="mb-3 flex items-baseline justify-center gap-1">
        <span className="font-display text-4xl font-semibold tabular-nums">
          {formatValue ? formatValue(value) : value}
        </span>
      </div>
      <div className="relative">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-2 w-full cursor-pointer opacity-0"
        />
        <div
          className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-background shadow-soft"
          style={{ left: `${pct}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{formatValue ? formatValue(min) : min}</span>
        <span>{formatValue ? formatValue(max) : max}</span>
      </div>
    </div>
  );
}

/* ---------- Chip multi-select ---------- */

export function ChipMultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Add your own...',
  allowCustom = true,
}: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  allowCustom?: boolean;
}) {
  const [custom, setCustom] = React.useState('');

  const toggle = (item: string) => {
    if (selected.includes(item)) {
      onChange(selected.filter((s) => s !== item));
    } else {
      onChange([...selected, item]);
    }
  };

  const addCustom = () => {
    const trimmed = custom.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
    }
    setCustom('');
  };

  const available = options.filter((o) => !selected.includes(o));

  return (
    <div className="space-y-4">
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((item) => (
            <motion.span
              key={item}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 px-3 py-1.5 text-sm font-medium text-foreground ring-1 ring-primary/20"
            >
              {item}
              <button
                type="button"
                onClick={() => toggle(item)}
                aria-label={`Remove ${item}`}
                className="text-muted-foreground transition-colors hover:text-destructive"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.span>
          ))}
        </div>
      )}

      {/* Available options */}
      {available.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {available.map((opt, i) => (
            <motion.button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/20 px-3 py-1.5 text-sm text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
              {opt}
            </motion.button>
          ))}
        </div>
      )}

      {/* Custom input */}
      {allowCustom && (
        <div className="flex gap-2">
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustom();
              }
            }}
            placeholder={placeholder}
            className="h-11 flex-1 rounded-xl border border-border bg-muted/30 px-4 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary/60 focus:bg-background focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="button"
            onClick={addCustom}
            disabled={!custom.trim()}
            className="rounded-xl bg-primary/10 px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- Textarea ---------- */

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-none rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary/60 focus:bg-background focus:ring-2 focus:ring-primary/20"
    />
  );
}
