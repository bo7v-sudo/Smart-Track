'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, GraduationCap, Presentation } from 'lucide-react';
import { AuthLayout } from '@/components/auth/auth-layout';
import { AuthField, AuthCheckbox, PasswordStrength } from '@/components/auth/form-fields';
import { GoogleButton, AuthDivider, SubmitButton } from '@/components/auth/auth-buttons';
import { supabase } from '@/lib/supabase-client';
import type { UserRole } from '@/components/auth/auth-provider';
import { useAuth } from '@/components/auth/auth-provider';
import { cn } from '@/lib/utils';

function mapAuthError(message: string): string {
  if (message.includes('already') && message.includes('registered')) {
    return 'An account with this email already exists. Try signing in instead.';
  }
  if (message.includes('password') && message.includes('weak')) {
    return 'Password is too weak. Please choose a stronger password.';
  }
  if (message.includes('rate limit')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  return message;
}

const roleOptions = [
  {
    value: 'student' as UserRole,
    label: 'Student',
    desc: 'Track courses, get AI study plans, and boost your grades.',
    icon: GraduationCap,
  },
  {
    value: 'professor' as UserRole,
    label: 'Professor',
    desc: 'Monitor classes, send alerts, and support your students.',
    icon: Presentation,
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState<UserRole>('student');
  const [agreed, setAgreed] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [formError, setFormError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = 'Full name is required';
    else if (fullName.trim().length < 2) e.fullName = 'Name is too short';
    if (!email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 8) e.password = 'Password must be at least 8 characters';
    if (!agreed) e.agreed = 'You must accept the terms to continue';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setFormError('');
    if (!validate()) return;
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          role,
        },
      },
    });

    if (error) {
      setFormError(mapAuthError(error.message));
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        full_name: fullName.trim(),
        role,
      });
      if (profileError) {
        console.error('Profile creation warning:', profileError.message);
      }
      await refreshProfile(data.user.id);

      // Email confirmation is off, so a session is created immediately
      if (data.session) {
        if (role === 'professor') {
          router.push('/professor');
        } else {
          router.push('/onboarding');
        }
      } else {
        router.push('/verify-email');
      }
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
      heading="Create your account"
      subheading="Join 500,000+ students studying smarter with AI."
    >
      <GoogleButton onClick={handleGoogle} loading={googleLoading} />
      <AuthDivider label="or sign up with email" />

      {formError && (
        <div className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <AuthField
          id="fullName"
          label="Full name"
          icon={User}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Alex Rivera"
          autoComplete="name"
          required
          error={errors.fullName}
        />
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
            placeholder="Create a strong password"
            autoComplete="new-password"
            required
            error={errors.password}
          />
          <PasswordStrength password={password} />
        </div>

        {/* Role selection */}
        <div>
          <p className="mb-2 text-sm font-medium text-foreground/90">
            I am a<span className="text-primary">*</span>
          </p>
          <div className="grid grid-cols-2 gap-3">
            {roleOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRole(opt.value)}
                className={cn(
                  'group flex flex-col items-start gap-2 rounded-xl border p-3.5 text-left transition-all',
                  role === opt.value
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/40 hover:bg-muted/40',
                )}
              >
                <span
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                    role === opt.value
                      ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  <opt.icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold">{opt.label}</span>
                <span className="text-xs text-muted-foreground">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <AuthCheckbox
            id="terms"
            label={
              <>
                I agree to the{' '}
                <Link href="#" className="font-medium text-primary hover:underline">
                  Terms
                </Link>{' '}
                and{' '}
                <Link href="#" className="font-medium text-primary hover:underline">
                  Privacy Policy
                </Link>
              </>
            }
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              if (e.target.checked && errors.agreed) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.agreed;
                  return next;
                });
              }
            }}
          />
          {errors.agreed && (
            <p className="mt-1.5 text-xs text-destructive">{errors.agreed}</p>
          )}
        </div>

        <SubmitButton loading={loading}>
          Create account
          <ArrowRight className="h-4 w-4" />
        </SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-primary transition-colors hover:text-primary/80"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
