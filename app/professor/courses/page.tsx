'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { BookOpen, Plus, Search, Archive, MoreVertical, FileText, Users, Trash2, Edit3, X, Check } from 'lucide-react';
import { ProfessorLayout } from '@/components/professor/professor-layout';
import { useProfessorData, type Course } from '@/components/professor/use-professor-data';
import { EmptyState, Skeleton } from '@/components/professor/shared';
import { RouteGuard } from '@/components/auth/route-guard';
import { courseColors, semesters } from '@/lib/professor-ai';
import { cn } from '@/lib/utils';

export default function CoursesPage() {
  return (
    <RouteGuard require="professor">
      <ProfessorLayout>
        <CoursesContent />
      </ProfessorLayout>
    </RouteGuard>
  );
}

function CoursesContent() {
  const router = useRouter();
  const { courses, lectures, loading, createCourse, updateCourse, deleteCourse } = useProfessorData();
  const [search, setSearch] = React.useState('');
  const [showArchived, setShowArchived] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState<string | null>(null);

  const filtered = courses.filter((c) => {
    if (c.archived !== showArchived) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.code?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">My Courses</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your courses and lectures.</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
        >
          <Plus className="h-4 w-4" />
          New Course
        </button>
      </div>

      {/* Search + filter */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="h-10 w-full rounded-xl border border-border bg-muted/40 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary/50 focus:bg-background"
          />
        </div>
        <div className="flex gap-1 rounded-xl bg-muted/50 p-1">
          <button onClick={() => setShowArchived(false)} className={cn('rounded-lg px-4 py-2 text-sm font-medium transition-all', !showArchived ? 'bg-background text-foreground shadow-soft' : 'text-muted-foreground')}>
            Active
          </button>
          <button onClick={() => setShowArchived(true)} className={cn('rounded-lg px-4 py-2 text-sm font-medium transition-all', showArchived ? 'bg-background text-foreground shadow-soft' : 'text-muted-foreground')}>
            Archived
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-48" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={showArchived ? 'No archived courses' : 'No courses yet'}
          description={showArchived ? 'Archived courses will appear here.' : 'Create your first course to start uploading lectures.'}
          action={!showArchived && (
            <button onClick={() => setCreateOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]">
              <Plus className="h-4 w-4" />
              Create Course
            </button>
          )}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-2xl glass-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow"
            >
              <div className={cn('pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-15 blur-2xl', course.color)} />
              <div className="relative flex items-start justify-between">
                <span className={cn('flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-soft', course.color)}>
                  <BookOpen className="h-5 w-5" />
                </span>
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === course.id ? null : course.id); }}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  <AnimatePresence>
                    {menuOpen === course.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 top-8 z-20 w-44 overflow-hidden rounded-xl border border-border bg-popover shadow-soft"
                      >
                        <button
                          onClick={() => { setMenuOpen(null); updateCourse(course.id, { archived: !course.archived }); }}
                          className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-muted/40"
                        >
                          <Archive className="h-4 w-4" />
                          {course.archived ? 'Unarchive' : 'Archive'}
                        </button>
                        <button
                          onClick={() => {
                            setMenuOpen(null);
                            if (confirm('Delete this course and all its lectures?')) deleteCourse(course.id);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <button onClick={() => router.push(`/professor/courses/${course.id}`)} className="relative mt-4 block w-full text-left">
                <p className="font-display text-base font-semibold">{course.name}</p>
                <p className="mt-0.5 text-xs font-medium text-primary">{course.code}</p>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    {course.lecture_count ?? 0} lectures
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {course.student_count ?? 0} students
                  </span>
                  <span className="ml-auto">{course.semester}</span>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {createOpen && (
        <CreateCourseModal
          onClose={() => setCreateOpen(false)}
          onCreate={async (data) => {
            await createCourse(data);
            setCreateOpen(false);
          }}
        />
      )}
    </div>
  );
}

function CreateCourseModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (data: { name: string; code: string; description: string; semester: string; color: string }) => Promise<void>;
}) {
  const [name, setName] = React.useState('');
  const [code, setCode] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [semester, setSemester] = React.useState(semesters[0]);
  const [color, setColor] = React.useState(courseColors[0]);
  const [saving, setSaving] = React.useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await onCreate({ name: name.trim(), code: code.trim(), description: description.trim(), semester, color });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-soft"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Create new course</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Course name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Organic Chemistry" className="h-11 w-full rounded-xl border border-border bg-muted/30 px-4 text-sm outline-none focus:border-primary/60 focus:bg-background focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Course code</label>
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="CHEM 230" className="h-11 w-full rounded-xl border border-border bg-muted/30 px-4 text-sm outline-none focus:border-primary/60 focus:bg-background focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Semester</label>
              <select value={semester} onChange={(e) => setSemester(e.target.value)} className="h-11 w-full rounded-xl border border-border bg-muted/30 px-4 text-sm outline-none focus:border-primary/60 focus:bg-background">
                {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the course..." rows={3} className="w-full resize-none rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm outline-none focus:border-primary/60 focus:bg-background focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Color theme</label>
            <div className="flex gap-2">
              {courseColors.map((c) => (
                <button key={c} onClick={() => setColor(c)} className={cn('h-9 w-9 rounded-lg bg-gradient-to-br transition-all', c, color === c ? 'ring-2 ring-offset-2 ring-offset-background ring-primary scale-110' : '')} />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/40">Cancel</button>
          <button onClick={handleCreate} disabled={!name.trim() || saving} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-50">
            {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Check className="h-4 w-4" />}
            Create Course
          </button>
        </div>
      </motion.div>
    </div>
  );
}
