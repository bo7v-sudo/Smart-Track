'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/dashboard/sidebar';
import { TopNav } from '@/components/dashboard/top-nav';
import { AIChat } from '@/components/dashboard/ai-chat';
import { StatCards } from '@/components/dashboard/stat-cards';
import { TodayTasks } from '@/components/dashboard/today-tasks';
import { PomodoroTimer } from '@/components/dashboard/pomodoro-timer';
import { WeeklyChart } from '@/components/dashboard/weekly-chart';
import { ExamCalendar } from '@/components/dashboard/exam-calendar';
import { SubjectCards } from '@/components/dashboard/subject-cards';
import {
  DailyMotivation,
  RecentActivity,
  AIRecommendations,
} from '@/components/dashboard/right-rail';
import { student } from '@/lib/dashboard-data';
import { cn } from '@/lib/utils';
import { RouteGuard } from '@/components/auth/route-guard';
import { useAuth } from '@/components/auth/auth-provider';

export default function DashboardPage() {
  return (
    <RouteGuard require="student">
      <DashboardContent />
    </RouteGuard>
  );
}

function DashboardContent() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [chatOpen, setChatOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          'transition-[padding] duration-300 ease-in-out',
          collapsed ? 'md:pl-[76px]' : 'md:pl-[256px]',
        )}
      >
        <TopNav
          onOpenMobile={() => setMobileOpen(true)}
          onOpenChat={() => setChatOpen(true)}
        />

        <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          <Greeting />
          <StatCards />

          {/* Main grid: left column + right rail */}
          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
            {/* Left column */}
            <div className="space-y-6">
              {/* Tasks + Pomodoro */}
              <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                <TodayTasks />
                <PomodoroTimer />
              </div>

              {/* Weekly chart + Exams */}
              <div className="grid gap-6 lg:grid-cols-2">
                <WeeklyChart />
                <ExamCalendar />
              </div>

              {/* Subjects */}
              <SubjectCards />
            </div>

            {/* Right rail */}
            <div className="space-y-6">
              <DailyMotivation />
              <AIRecommendations />
              <RecentActivity />
            </div>
          </div>
        </main>
      </div>

      <AIChat open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}

function Greeting() {
  const { profile } = useAuth();
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = (profile?.full_name || student.name).split(' ')[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {greeting}, {firstName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {student.semester} · You have 4 tasks and 2 exams coming up this week.
        </p>
      </div>
      <div className="hidden items-center gap-2 rounded-xl glass px-3 py-2 sm:flex">
        <span className="h-2 w-2 rounded-full bg-accent" />
        <span className="text-xs font-medium text-muted-foreground">
          All systems on track
        </span>
      </div>
    </motion.div>
  );
}
