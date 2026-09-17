'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { AuthLayout } from '@/components/auth/auth-layout';
import { AuthField } from '@/components/auth/form-fields';
import { GoogleButton, AuthDivider, SubmitButton } from '@/components/auth/auth-buttons';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/components/auth/auth-provider';

function mapAuthError(message: string): string {
  if (message.includes('Invalid login credentials')) {
    return 'Incorrect email or password. Please try again.';
  }
  if (message.includes('Email not confirmed')) {
    return 'Please verify your email before signing in.';
  }
  if (message.includes('rate limit')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  return message;
}

export default function LoginPage() {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setFormError('');
    if (!validate()) return;
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setFormError(mapAuthError(error.message));
      setLoading(false);
      return;
    }

    if (data.user) {
      // Kick off profile fetch in the background (don't block the redirect)
      refreshProfile(data.user.id);
      // Redirect all users straight to the dashboard
      router.replace('/dashboard');
      return;
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setFormError('');
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setFormError(mapAuthError(error.message));
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout
      heading="Welcome back"
      subheading="Sign in to continue to your Smart Track dashboard."
    >
      <GoogleButton onClick={handleGoogle} loading={googleLoading} />
      <AuthDivider label="or sign in with email" />

      {formError && (
        <div className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {formError}
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
          onBlur={() => email && validate()}
          placeholder="you@university.edu"
          autoComplete="email"
          required
          error={errors.email}
        />
        <div>
          <AuthField
            id="password"
            label="Password"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => password && validate()}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            error={errors.password}
          />
          <div className="mt-2 flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <SubmitButton loading={loading}>
          Sign in
          <ArrowRight className="h-4 w-4" />
        </SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-semibold text-primary transition-colors hover:text-primary/80"
        >
          Create one
        </Link>
      </p>

      <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        Free for students · No credit card required
      </div>
    </AuthLayout>
  );
}
