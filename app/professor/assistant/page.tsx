'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, BookOpen } from 'lucide-react';
import { ProfessorLayout } from '@/components/professor/professor-layout';
import { UploadZone, type UploadedFile } from '@/components/professor/upload-zone';
import { ProcessingAnimation } from '@/components/professor/processing';
import { RouteGuard } from '@/components/auth/route-guard';
import { useProfessorData } from '@/components/professor/use-professor-data';
import { processingSteps, generateLectureContent, detectFileType, formatFileSize } from '@/lib/professor-ai';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/components/auth/auth-provider';
import { cn } from '@/lib/utils';

type Phase = 'upload' | 'processing' | 'done';

export default function AssistantPage() {
  return (
    <RouteGuard require="professor">
      <ProfessorLayout>
        <AssistantContent />
      </ProfessorLayout>
    </RouteGuard>
  );
}

function AssistantContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCourse = searchParams.get('course');
  const { user } = useAuth();
  const { courses, createLecture, updateLecture, saveVersion } = useProfessorData();
  const [phase, setPhase] = React.useState<Phase>('upload');
  const [selectedCourse, setSelectedCourse] = React.useState(preselectedCourse || '');
  const [createdLectureId, setCreatedLectureId] = React.useState<string | null>(null);

  const handleFilesComplete = async (files: UploadedFile[]) => {
    if (!user || files.length === 0) return;
    const file = files[0];

    // Determine title from filename
    const baseName = file.name.replace(/\.[^.]+$/, '');
    const title = baseName.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    // Create lecture in DB with processing status
    const lecture = await createLecture({
      course_id: selectedCourse || courses[0]?.id || '',
      title,
      file_name: file.name,
      file_type: file.type,
      file_size: formatFileSize(file.size),
    });

    if (lecture) {
      setCreatedLectureId(lecture.id);
      setPhase('processing');
    }
  };

  const handleProcessingComplete = async () => {
    if (!createdLectureId) return;
    // Generate AI content
    const { content, meta, quality } = generateLectureContent(
      courses.find((c) => c.id === selectedCourse)?.name || 'lecture',
    );

    // Update lecture with generated content
    await updateLecture(createdLectureId, {
      status: 'review',
      content,
      quality_score: quality,
      difficulty: meta.difficulty,
      estimated_study_time: meta.estimatedStudyTime,
      title: meta.title,
      description: meta.description,
    });

    // Save initial AI version
    await saveVersion(createdLectureId, content, 'ai', 'Initial AI generation');

    // Navigate to review page
    router.push(`/professor/lectures/${createdLectureId}`);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={() => router.push('/professor')} className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </button>

      {phase === 'upload' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow">
              <Sparkles className="h-7 w-7" />
            </span>
            <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight sm:text-3xl">AI Lecture Assistant</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Upload your lecture materials and let AI transform them into engaging learning content.
            </p>
          </div>

          {/* Course selector */}
          {courses.length > 0 && (
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium">Select course</label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {courses.filter((c) => !c.archived).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCourse(c.id)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border p-3 text-left transition-all',
                      selectedCourse === c.id ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:border-primary/40 hover:bg-muted/30',
                    )}
                  >
                    <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white', c.color)}>
                      <BookOpen className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{c.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{c.code}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl glass-card p-6 shadow-soft sm:p-8">
            <h2 className="font-display text-lg font-semibold">Upload lecture materials</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Drag and drop your files below. We support PDF, PowerPoint, Word, images, video, and text notes.
            </p>
            <div className="mt-6">
              <UploadZone onFilesComplete={handleFilesComplete} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { title: '1. Upload', desc: 'Drag & drop your lecture files' },
              { title: '2. AI Processing', desc: 'AI extracts and generates content' },
              { title: '3. Review & Publish', desc: 'You review, edit, and approve' },
            ].map((step, i) => (
              <div key={step.title} className="rounded-xl border border-border bg-muted/20 p-4">
                <p className="text-xs font-semibold text-primary">{step.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {phase === 'processing' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <ProcessingAnimation
            steps={processingSteps}
            title="AI is processing your lecture"
            subtitle="Analyzing content and generating learning materials..."
            onComplete={handleProcessingComplete}
            stepDuration={700}
          />
        </motion.div>
      )}
    </div>
  );
}
