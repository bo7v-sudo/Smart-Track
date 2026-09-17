'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { BookOpen, FileText, Users, TrendingUp, Sparkles, Plus, ArrowRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { ProfessorLayout } from '@/components/professor/professor-layout';
import { useProfessorData } from '@/components/professor/use-professor-data';
import { StatusBadge, EmptyState, Skeleton } from '@/components/professor/shared';
import { RouteGuard } from '@/components/auth/route-guard';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/auth-provider';

export default function ProfessorPage() {
  return (
    <RouteGuard require="professor">
      <ProfessorLayout>
        <ProfessorHome />
      </ProfessorLayout>
    </RouteGuard>
  );
}

function ProfessorHome() {
  const router = useRouter();
  const { profile } = useAuth();
  const { courses, lectures, loading } = useProfessorData();

  const publishedCount = lectures.filter((l) => l.status === 'published').length;
  const reviewCount = lectures.filter((l) => l.status === 'review').length;
  const totalStudents = courses.reduce((sum, c) => sum + (c.student_count ?? 0), 0);

  const stats = [
    { label: 'Active Courses', value: courses.filter((c) => !c.archived).length, icon: BookOpen, color: 'from-primary to-accent' },
    { label: 'Total Lectures', value: lectures.length, icon: FileText, color: 'from-blue-500 to-cyan-500' },
    { label: 'Published', value: publishedCount, icon: CheckCircle2, color: 'from-emerald-500 to-teal-500' },
    { label: 'Enrolled Students', value: totalStudents, icon: Users, color: 'from-amber-500 to-orange-500' },
  ];

  const recentLectures = lectures.slice(0, 5);
  const firstName = (profile?.full_name || 'Professor').split(' ')[0];

  return (
    <div>
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {reviewCount > 0 ? `${reviewCount} lecture${reviewCount === 1 ? '' : 's'} awaiting your review.` : 'Everything is up to date. Ready to create some magic?'}
          </p>
        </div>
        <button
          onClick={() => router.push('/professor/assistant')}
          className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
        >
          <Sparkles className="h-4 w-4" />
          Upload New Lecture
        </button>
      </motion.div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl glass-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow sm:p-5"
            >
              <div className={cn('pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-20 blur-2xl', s.color)} />
              <span className={cn('flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-white', s.color)}>
                <s.icon className="h-[18px] w-[18px]" />
              </span>
              <p className="relative mt-3 font-display text-2xl font-semibold sm:text-3xl">{s.value}</p>
              <p className="relative mt-0.5 text-xs text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Recent lectures */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl glass-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold">Recent lectures</h3>
              <button onClick={() => router.push('/professor/courses')} className="text-xs font-medium text-primary hover:text-primary/80">
                View all
              </button>
            </div>
            {loading ? (
              <div className="mt-4 space-y-3">
                {[0, 1, 2].map((i) => <Skeleton key={i} className="h-16" />)}
              </div>
            ) : recentLectures.length === 0 ? (
              <div className="mt-4">
                <EmptyState
                  icon={FileText}
                  title="No lectures yet"
                  description="Upload your first lecture and let AI transform it into learning content for your students."
                  action={
                    <button onClick={() => router.push('/professor/assistant')} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]">
                      <Plus className="h-4 w-4" />
                      Upload Lecture
                    </button>
                  }
                />
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                {recentLectures.map((lecture, i) => (
                  <motion.button
                    key={lecture.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => router.push(`/professor/lectures/${lecture.id}`)}
                    className="group flex w-full items-center gap-3 rounded-xl border border-border/60 p-3 text-left transition-all hover:border-primary/30 hover:bg-primary/[0.03]"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
                      <FileText className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{lecture.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{lecture.file_name}</p>
                    </div>
                    <StatusBadge status={lecture.status} animate />
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* AI assistant card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-accent/15 p-5">
            <Sparkles className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-display text-base font-semibold">AI Lecture Assistant</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Transform raw lecture materials into quizzes, summaries, and flashcards in seconds.
            </p>
            <button
              onClick={() => router.push('/professor/assistant')}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Quick stats */}
          <div className="rounded-2xl glass-card p-5 shadow-soft">
            <h3 className="font-display text-base font-semibold">This week</h3>
            <div className="mt-4 space-y-3">
              {[
                { label: 'Lectures published', value: publishedCount, icon: CheckCircle2, color: 'text-emerald-500' },
                { label: 'Awaiting review', value: reviewCount, icon: AlertCircle, color: 'text-amber-500' },
                { label: 'Avg. processing time', value: '12s', icon: Clock, color: 'text-primary' },
                { label: 'Student engagement', value: '+18%', icon: TrendingUp, color: 'text-accent' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <item.icon className={cn('h-4 w-4', item.color)} />
                  <span className="flex-1 text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
