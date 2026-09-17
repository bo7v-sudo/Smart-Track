'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MailOpen, CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react';
import { AuthLayout } from '@/components/auth/auth-layout';
import { SubmitButton } from '@/components/auth/auth-buttons';
import { supabase } from '@/lib/supabase-client';
import { useAuth, type UserRole } from '@/components/auth/auth-provider';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { session, refreshProfile } = useAuth();
  const [checking, setChecking] = React.useState(false);
  const [resending, setResending] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  const email = session?.user?.email ?? 'your email';

  const handleContinue = async () => {
    setChecking(true);
    setError('');
    await refreshProfile();

    if (session?.user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role, onboarding_completed')
        .eq('id', session.user.id)
        .maybeSingle();
      const role = (profileData?.role as UserRole) ?? 'student';
      if (role === 'professor') {
        router.push('/professor');
      } else if (!profileData?.onboarding_completed) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    } else {
      router.push('/login');
    }
    setChecking(false);
  };

  const handleResend = async () => {
    if (!session?.user?.email) {
      setError('No email on file. Please sign up again.');
      return;
    }
    setResending(true);
    setError('');
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: session.user.email,
    });
    if (error) {
      setError(error.message);
    } else {
      setMessage('Verification email sent. Check your inbox.');
    }
    setResending(false);
  };

  return (
    <AuthLayout
      heading="Verify your email"
      subheading="One last step before you can start studying smarter."
    >
      <div className="space-y-6">
        {/* Icon + message */}
        <div className="flex flex-col items-center rounded-2xl glass-card p-6 text-center shadow-soft">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary">
            <MailOpen className="h-7 w-7" />
          </span>
          <h2 className="mt-4 font-display text-lg font-semibold">
            Check your inbox
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a verification link to{' '}
            <span className="font-medium text-foreground">{email}</span>. Click
            the link in the email to confirm your account.
          </p>
        </div>

        {/* Tips */}
        <div className="rounded-2xl border border-border bg-muted/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Didn&apos;t get the email?
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              Check your spam or junk folder
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              Make sure you entered the correct email address
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              Wait a minute — it can take a moment to arrive
            </li>
          </ul>
        </div>

        {message && (
          <div className="rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">
            {message}
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <SubmitButton loading={checking} onClick={handleContinue}>
            I&apos;ve verified my email
            <ArrowRight className="h-4 w-4" />
          </SubmitButton>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground disabled:opacity-60"
          >
            <RefreshCw className={resending ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
            Resend verification email
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          <Link
            href="/login"
            className="font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
