'use client';

import * as React from 'react';
import { ProfessorSidebar } from '@/components/professor/sidebar';
import { ProfessorTopNav } from '@/components/professor/top-nav';
import { AIChat } from '@/components/dashboard/ai-chat';
import { cn } from '@/lib/utils';

export function ProfessorLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [chatOpen, setChatOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      <ProfessorSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className={cn('transition-[padding] duration-300 ease-in-out', collapsed ? 'md:pl-[76px]' : 'md:pl-[256px]')}>
        <ProfessorTopNav
          onOpenMobile={() => setMobileOpen(true)}
          onOpenChat={() => setChatOpen(true)}
        />
        <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
      <AIChat open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
