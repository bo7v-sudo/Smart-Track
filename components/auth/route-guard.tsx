'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, type UserRole } from '@/components/auth/auth-provider';

/**
 * Wraps a protected route. Redirects to /login when unauthenticated and
 * to the role-appropriate page when the user's role does not match the
 * `require` prop. Shows a loading state while the session resolves.
 */
export function RouteGuard({
  children,
  require = 'student',
}: {
  children: React.ReactNode;
  require?: UserRole;
}) {
  const router = useRouter();
  const { session, role, profile, loading } = useAuth();
  const [redirecting, setRedirecting] = React.useState(false);

  React.useEffect(() => {
    if (loading) return;

    if (!session) {
      setRedirecting(true);
      router.replace('/login');
      return;
    }

    if (role && role !== require) {
      setRedirecting(true);
      router.replace(role === 'professor' ? '/professor' : '/dashboard');
      return;
    }

    // Students must complete onboarding before accessing the dashboard
    if (require === 'student' && profile && !profile.onboarding_completed) {
      setRedirecting(true);
      router.replace('/onboarding');
    }
  }, [loading, session, role, require, profile, router]);

  if (loading || redirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
