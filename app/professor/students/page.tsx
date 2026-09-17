'use client';

import { motion } from 'framer-motion';
import { Users, BookOpen, TrendingUp } from 'lucide-react';
import { ProfessorLayout } from '@/components/professor/professor-layout';
import { RouteGuard } from '@/components/auth/route-guard';
import { useProfessorData } from '@/components/professor/use-professor-data';
import { EmptyState, Skeleton } from '@/components/professor/shared';
import { cn } from '@/lib/utils';

export default function StudentsPage() {
  return (
    <RouteGuard require="professor">
      <ProfessorLayout>
        <StudentsContent />
      </ProfessorLayout>
    </RouteGuard>
  );
}

function StudentsContent() {
  const { courses, loading } = useProfessorData();
  const totalStudents = courses.reduce((sum, c) => sum + (c.student_count ?? 0), 0);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Students</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage enrolled students across your courses.</p>

      {loading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-40" />)}
        </div>
      ) : totalStudents === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={Users}
            title="No students enrolled yet"
            description="Students will appear here once they join your courses. Share your course code with them to get started."
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl glass-card p-5 shadow-soft">
              <div className="flex items-center gap-3">
                <span className={cn('flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white', c.color)}>
                  <BookOpen className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.code}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-display text-2xl font-semibold">{c.student_count ?? 0}</p>
                  <p className="text-xs text-muted-foreground">enrolled</p>
                </div>
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
