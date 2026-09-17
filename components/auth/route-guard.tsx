'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';

/**
 * Wraps a protected route. Redirects to /login when unauthenticated.
 * Shows a loading state only while the session is being resolved.
 */
export function RouteGuard({
  children,
}: {
  children: React.ReactNode;
  require?: 'student' | 'professor';
}) {
  const router = useRouter();
  const { session, loading } = useAuth();
  const [redirecting, setRedirecting] = React.useState(false);

  React.useEffect(() => {
    if (loading) return;

    if (!session) {
      setRedirecting(true);
      router.replace('/login');
    }
  }, [loading, session, router]);

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
