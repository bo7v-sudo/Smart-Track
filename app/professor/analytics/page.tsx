'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, FileText, Clock } from 'lucide-react';
import { ProfessorLayout } from '@/components/professor/professor-layout';
import { RouteGuard } from '@/components/auth/route-guard';
import { useProfessorData } from '@/components/professor/use-professor-data';
import { Skeleton } from '@/components/professor/shared';
import { cn } from '@/lib/utils';

export default function AnalyticsPage() {
  return (
    <RouteGuard require="professor">
      <ProfessorLayout>
        <AnalyticsContent />
      </ProfessorLayout>
    </RouteGuard>
  );
}

function AnalyticsContent() {
  const { courses, lectures, loading } = useProfessorData();
  const published = lectures.filter((l) => l.status === 'published').length;
  const inReview = lectures.filter((l) => l.status === 'review').length;
  const avgQuality = lectures.filter((l) => l.quality_score).reduce((sum, l) => sum + (l.quality_score?.overall ?? 0), 0) / (lectures.filter((l) => l.quality_score).length || 1);

  const stats = [
    { label: 'Total Lectures', value: lectures.length, icon: FileText, color: 'from-primary to-accent' },
    { label: 'Published', value: published, icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
    { label: 'In Review', value: inReview, icon: Clock, color: 'from-amber-500 to-orange-500' },
    { label: 'Avg Quality', value: `${Math.round(avgQuality)}`, icon: BarChart3, color: 'from-blue-500 to-cyan-500' },
  ];

  // Mock engagement chart data
  const engagementData = [
    { day: 'Mon', value: 65 },
    { day: 'Tue', value: 72 },
    { day: 'Wed', value: 58 },
    { day: 'Thu', value: 81 },
    { day: 'Fri', value: 76 },
    { day: 'Sat', value: 92 },
    { day: 'Sun', value: 68 },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Analytics</h1>
      <p className="mt-1 text-sm text-muted-foreground">Track your lecture performance and student engagement.</p>

      {loading ? (
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-2xl glass-card p-5 shadow-soft">
              <span className={cn('flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-white', s.color)}>
                <s.icon className="h-[18px] w-[18px]" />
              </span>
              <p className="mt-3 font-display text-2xl font-semibold sm:text-3xl">{s.value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Engagement chart */}
        <div className="rounded-2xl glass-card p-5 shadow-soft">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="font-display text-base font-semibold">Student engagement</h3>
          </div>
          <div className="mt-6 flex h-48 items-end justify-between gap-3">
            {engagementData.map((d, i) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-full w-full items-end justify-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${d.value}%` }}
                    transition={{ duration: 0.7, delay: i * 0.08, ease: 'easeOut' }}
                    className="w-full max-w-[36px] rounded-lg bg-gradient-to-t from-primary/40 to-accent"
                  />
                </div>
                <span className="text-[11px] text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top courses */}
        <div className="rounded-2xl glass-card p-5 shadow-soft">
          <h3 className="font-display text-base font-semibold">Course performance</h3>
          <div className="mt-4 space-y-3">
            {courses.slice(0, 5).map((c, i) => {
              const courseLectures = lectures.filter((l) => l.course_id === c.id);
              const score = 60 + ((i * 37) % 40);
              return (
                <div key={c.id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-muted-foreground">{courseLectures.length} lectures</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} className={cn('h-full rounded-full bg-gradient-to-r', c.color)} />
                  </div>
                </div>
              );
            })}
            {courses.length === 0 && <p className="text-sm text-muted-foreground">No courses yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
