'use client';

import * as React from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '@/components/auth/auth-layout';
import { AuthField } from '@/components/auth/form-fields';
import { SubmitButton } from '@/components/auth/auth-buttons';
import { supabase } from '@/lib/supabase-client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const validate = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <AuthLayout
      heading="Reset your password"
      subheading="Enter your email and we'll send you a secure link to reset your password."
    >
      {sent ? (
        <div className="space-y-6">
          <div className="flex flex-col items-center rounded-2xl border border-accent/30 bg-accent/10 p-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent">
              <CheckCircle2 className="h-6 w-6" />
            </span>
            <h2 className="mt-4 font-display text-lg font-semibold">
              Check your inbox
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We sent a password reset link to{' '}
              <span className="font-medium text-foreground">{email}</span>. The
              link expires in 60 minutes.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <AuthField
              id="email"
              label="Email address"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              autoComplete="email"
              required
              error={error}
            />
            <SubmitButton loading={loading}>
              Send reset link
              <ArrowRight className="h-4 w-4" />
            </SubmitButton>
          </form>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </>
      )}
    </AuthLayout>
  );
}
