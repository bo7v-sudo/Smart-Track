'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import type { UserRole } from '@/components/auth/auth-provider';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    (async () => {
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !data.session?.user) {
        router.replace('/login');
        return;
      }

      const userId = data.session.user.id;
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, onboarding_completed')
        .eq('id', userId)
        .maybeSingle();

      const role = (profile?.role as UserRole) ?? 'student';
      if (role === 'professor') {
        router.replace('/professor');
      } else if (!profile?.onboarding_completed) {
        router.replace('/onboarding');
      } else {
        router.replace('/dashboard');
      }
    })();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
        <p className="text-sm text-muted-foreground">
          Finishing sign in...
        </p>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}
