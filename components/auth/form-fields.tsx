'use client';

import * as React from 'react';
import { Eye, EyeOff, AlertCircle, Check, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type FieldProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  icon?: LucideIcon;
  autoComplete?: string;
  required?: boolean;
};

export function AuthField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  icon: Icon,
  autoComplete,
  required,
}: FieldProps) {
  const [show, setShow] = React.useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (show ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-foreground/90"
      >
        {label}
        {required && <span className="ml-0.5 text-primary">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            className={cn(
              'pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 transition-colors',
              error ? 'text-destructive' : 'text-muted-foreground',
            )}
          />
        )}
        <input
          id={id}
          name={id}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            'h-12 w-full rounded-xl border bg-muted/30 px-4 text-sm outline-none transition-all placeholder:text-muted-foreground/60',
            'focus:border-primary/60 focus:bg-background focus:ring-2 focus:ring-primary/20',
            Icon && 'pl-11',
            isPassword && 'pr-11',
            error
              ? 'border-destructive/60 focus:border-destructive focus:ring-destructive/20'
              : 'border-border',
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            {show ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
          </button>
        )}
      </div>
      {error && (
        <p
          id={`${id}-error`}
          className="mt-1.5 flex items-center gap-1 text-xs text-destructive"
        >
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}

export function AuthCheckbox({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: React.ReactNode;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-2.5 text-sm text-muted-foreground"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        className={cn(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30',
          checked
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-muted/40',
        )}
      >
        {checked && <Check className="h-3 w-3" />}
      </span>
      <span className="select-none">{label}</span>
    </label>
  );
}

type StrengthResult = {
  score: number; // 0-4
  label: string;
  color: string;
  barColor: string;
  tips: string[];
};

export function evaluatePassword(pw: string): StrengthResult {
  const tips: string[] = [];
  let score = 0;
  if (pw.length >= 8) score++;
  else tips.push('At least 8 characters');
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  else tips.push('Upper and lower case');
  if (/\d/.test(pw)) score++;
  else tips.push('A number');
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  else tips.push('A symbol');

  const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = [
    'text-destructive',
    'text-destructive',
    'text-amber-500',
    'text-accent',
    'text-emerald-500',
  ];
  const barColors = [
    'bg-destructive',
    'bg-destructive',
    'bg-amber-500',
    'bg-accent',
    'bg-emerald-500',
  ];

  return {
    score,
    label: labels[score],
    color: colors[score],
    barColor: barColors[score],
    tips,
  };
}

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const { score, label, color, barColor, tips } = evaluatePassword(password);

  return (
    <div className="mt-2.5 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-all duration-300',
                i < score ? barColor : 'bg-muted',
              )}
            />
          ))}
        </div>
        <span className={cn('text-xs font-medium', color)}>{label}</span>
      </div>
      {tips.length > 0 && score < 4 && (
        <p className="text-xs text-muted-foreground">
          Add: {tips.join(' · ')}
        </p>
      )}
    </div>
  );
}
