'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Sparkles, Check, Eye, History, X, RotateCcw,
  FileText, Clock, BarChart3, Send, ChevronDown, AlertCircle,
} from 'lucide-react';
import { ProfessorLayout } from '@/components/professor/professor-layout';
import { RouteGuard } from '@/components/auth/route-guard';
import { supabase } from '@/lib/supabase-client';
import {
  StatusBadge, QualityScoreRing, QualityBars, Skeleton,
} from '@/components/professor/shared';
import { ProcessingAnimation } from '@/components/professor/processing';
import {
  EditTextSection, EditListSection, EditObjectivesSection,
  EditTermsSection, EditFAQSection, EditFlashcardsSection,
  EditQuizSection, EditDiagramsSection, SectionWrapper, HiddenSectionPill,
} from '@/components/professor/section-editors';
import {
  type LectureContent, type ContentSection, type QualityScore,
  type Difficulty, type LectureStatus, generateLectureContent,
  defaultSections, publishSteps,
} from '@/lib/professor-ai';
import { cn } from '@/lib/utils';

type Version = {
  id: string;
  version_number: number;
  content: LectureContent;
  editor: string;
  label: string;
  created_at: string;
};

type Lecture = {
  id: string;
  course_id: string;
  title: string;
  description: string;
  status: LectureStatus;
  file_name: string;
  file_type: string;
  file_size: string;
  content: LectureContent;
  quality_score: QualityScore | null;
  difficulty: Difficulty | null;
  estimated_study_time: string | null;
  approved: boolean;
};

export default function LectureReviewPage() {
  return (
    <RouteGuard require="professor">
      <ProfessorLayout>
        <LectureReview />
      </ProfessorLayout>
    </RouteGuard>
  );
}

function LectureReview() {
  const params = useParams();
  const router = useRouter();
  const lectureId = params.id as string;
  const [lecture, setLecture] = React.useState<Lecture | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [sections, setSections] = React.useState<ContentSection[]>(defaultSections);
  const [content, setContent] = React.useState<LectureContent | null>(null);
  const [showPreview, setShowPreview] = React.useState(false);
  const [showHistory, setShowHistory] = React.useState(false);
  const [versions, setVersions] = React.useState<Version[]>([]);
  const [publishing, setPublishing] = React.useState(false);
  const [published, setPublished] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);

  const loadLecture = React.useCallback(async () => {
    const { data } = await supabase.from('professor_lectures').select('*').eq('id', lectureId).maybeSingle();
    if (data) {
      setLecture(data as Lecture);
      setContent((data as Lecture).content);
      if ((data as Lecture).status === 'published') setPublished(true);
    }
    setLoading(false);
  }, [lectureId]);

  const loadVersions = React.useCallback(async () => {
    const { data } = await supabase
      .from('lecture_versions')
      .select('*')
      .eq('lecture_id', lectureId)
      .order('version_number', { ascending: false });
    if (data) setVersions(data as Version[]);
  }, [lectureId]);

  React.useEffect(() => { loadLecture(); loadVersions(); }, [loadLecture, loadVersions]);

  const updateContent = (patch: Partial<LectureContent>) => {
    setContent((prev) => prev ? { ...prev, ...patch } : prev);
    setDirty(true);
  };

  const saveDraft = async () => {
    if (!content || !lecture) return;
    setSaving(true);
    await supabase.from('professor_lectures').update({ content }).eq('id', lectureId);
    await supabase.from('lecture_versions').insert({
      lecture_id: lectureId,
      version_number: (versions[0]?.version_number ?? 0) + 1,
      content,
      editor: 'professor',
      label: 'Professor edit',
    });
    setDirty(false);
    setSaving(false);
    loadVersions();
  };

  const regenerateSection = async (sectionType: ContentSection['type']) => {
    const fresh = generateLectureContent(lecture?.file_name || 'lecture');
    const patch: Partial<LectureContent> = {};
    if (sectionType === 'summary') patch.summary = fresh.content.summary;
    else if (sectionType === 'explanation') patch.explanation = fresh.content.explanation;
    else if (sectionType === 'concepts') patch.keyConcepts = fresh.content.keyConcepts;
    else if (sectionType === 'objectives') patch.learningObjectives = fresh.content.learningObjectives;
    else if (sectionType === 'terms') patch.academicTerms = fresh.content.academicTerms;
    else if (sectionType === 'faqs') patch.faqs = fresh.content.faqs;
    else if (sectionType === 'flashcards') patch.flashcards = fresh.content.flashcards;
    else if (sectionType === 'quiz') patch.quiz = fresh.content.quiz;
    else if (sectionType === 'diagrams') patch.diagrams = fresh.content.diagrams;
    updateContent(patch);
  };

  const toggleSectionVisible = (id: string) => {
    setSections((prev) => prev.map((s) => s.id === id ? { ...s, visible: !s.visible } : s));
  };

  const deleteSection = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const restoreVersion = async (version: Version) => {
    setContent(version.content);
    setDirty(true);
    setShowHistory(false);
  };

  const handlePublish = async () => {
    if (!content || !lecture) return;
    setPublishing(true);
    // First save the content
    await supabase.from('professor_lectures').update({
      content,
      status: 'published',
      approved: true,
      published_at: new Date().toISOString(),
    }).eq('id', lectureId);
    await supabase.from('lecture_versions').insert({
      lecture_id: lectureId,
      version_number: (versions[0]?.version_number ?? 0) + 1,
      content,
      editor: 'professor',
      label: 'Published version',
    });
  };

  const handlePublishComplete = () => {
    setPublishing(false);
    setPublished(true);
    setLecture((prev) => prev ? { ...prev, status: 'published', approved: true } : prev);
    loadVersions();
  };

  const requestRevision = async () => {
    await supabase.from('professor_lectures').update({ status: 'revision' }).eq('id', lectureId);
    setLecture((prev) => prev ? { ...prev, status: 'revision' } : prev);
  };

  if (loading) {
    return (
      <div>
        <Skeleton className="mb-6 h-10 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!lecture || !content) {
    return (
      <div>
        <button onClick={() => router.push('/professor')} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="mt-8 flex flex-col items-center text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground" />
          <p className="mt-3 font-display text-lg font-semibold">Lecture not found</p>
          <p className="text-sm text-muted-foreground">It may have been deleted.</p>
        </div>
      </div>
    );
  }

  // Publish success animation
  if (published && publishing === false) {
    return (
      <div className="mx-auto max-w-2xl py-12">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-glow"
          >
            <Check className="h-10 w-10" />
          </motion.span>
          <h1 className="mt-6 font-display text-3xl font-semibold">Lecture Published!</h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Your lecture "{lecture.title}" is now live. Students have been notified and their study plans updated.
          </p>
          <div className="mt-8 flex gap-3">
            <button onClick={() => router.push('/professor')} className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/40">
              Back to Dashboard
            </button>
            <button onClick={() => router.push('/professor/courses')} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">
              View Courses
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Publish processing animation
  if (publishing) {
    return (
      <ProcessingAnimation
        steps={publishSteps}
        title="Publishing your lecture"
        subtitle="Notifying students and updating their study materials..."
        onComplete={handlePublishComplete}
        stepDuration={600}
      />
    );
  }

  const hiddenSections = sections.filter((s) => !s.visible);

  return (
    <div>
      {/* Header */}
      <button onClick={() => router.back()} className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{lecture.title}</h1>
            <StatusBadge status={lecture.status} animate />
          </div>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{lecture.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><FileText className="h-3.5 w-3.5" />{lecture.file_name}</span>
            {lecture.estimated_study_time && <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{lecture.estimated_study_time}</span>}
            {lecture.difficulty && <span className="capitalize">{lecture.difficulty}</span>}
            {dirty && <span className="inline-flex items-center gap-1 text-amber-500"><AlertCircle className="h-3.5 w-3.5" />Unsaved changes</span>}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={saveDraft} disabled={!dirty || saving} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/40 disabled:opacity-50">
            {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-foreground" /> : <Check className="h-4 w-4" />}
            Save Draft
          </button>
          <button onClick={() => setShowHistory(true)} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/40">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </button>
          <button onClick={() => setShowPreview(true)} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/40">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Preview</span>
          </button>
          {lecture.status !== 'published' && (
            <button onClick={handlePublish} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]">
              <Send className="h-4 w-4" />
              Approve & Publish
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content sections */}
        <div className="space-y-4 lg:col-span-2">
          {sections.map((section) => (
            <SectionWrapper
              key={section.id}
              section={section}
              onToggleVisible={() => toggleSectionVisible(section.id)}
              onDelete={() => deleteSection(section.id)}
            >
              {section.type === 'summary' && (
                <EditTextSection title={section.title} value={content.summary} onChange={(v) => updateContent({ summary: v })} onRegenerate={() => regenerateSection('summary')} />
              )}
              {section.type === 'explanation' && (
                <EditTextSection title={section.title} value={content.explanation} onChange={(v) => updateContent({ explanation: v })} onRegenerate={() => regenerateSection('explanation')} />
              )}
              {section.type === 'concepts' && (
                <EditListSection title={section.title} items={content.keyConcepts} onChange={(v) => updateContent({ keyConcepts: v })} onRegenerate={() => regenerateSection('concepts')} />
              )}
              {section.type === 'objectives' && (
                <EditObjectivesSection title={section.title} items={content.learningObjectives} onChange={(v) => updateContent({ learningObjectives: v })} onRegenerate={() => regenerateSection('objectives')} />
              )}
              {section.type === 'terms' && (
                <EditTermsSection title={section.title} items={content.academicTerms} onChange={(v) => updateContent({ academicTerms: v })} onRegenerate={() => regenerateSection('terms')} />
              )}
              {section.type === 'faqs' && (
                <EditFAQSection title={section.title} items={content.faqs} onChange={(v) => updateContent({ faqs: v })} onRegenerate={() => regenerateSection('faqs')} />
              )}
              {section.type === 'flashcards' && (
                <EditFlashcardsSection title={section.title} items={content.flashcards} onChange={(v) => updateContent({ flashcards: v })} onRegenerate={() => regenerateSection('flashcards')} />
              )}
              {section.type === 'quiz' && (
                <EditQuizSection title={section.title} items={content.quiz} onChange={(v) => updateContent({ quiz: v })} onRegenerate={() => regenerateSection('quiz')} />
              )}
              {section.type === 'diagrams' && (
                <EditDiagramsSection title={section.title} items={content.diagrams} onRegenerate={() => regenerateSection('diagrams')} />
              )}
            </SectionWrapper>
          ))}

          {/* Hidden sections + add */}
          {hiddenSections.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-medium text-muted-foreground">Hidden:</span>
              {hiddenSections.map((s) => (
                <HiddenSectionPill key={s.id} section={s} onShow={() => toggleSectionVisible(s.id)} />
              ))}
            </div>
          )}

          {/* Request revision */}
          {lecture.status === 'review' && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Not happy with the AI output?</p>
              <p className="mt-1 text-xs text-muted-foreground">Mark this lecture for revision and the AI will regenerate content with different parameters.</p>
              <button onClick={requestRevision} className="mt-3 inline-flex items-center gap-2 rounded-xl border border-amber-500/40 px-4 py-2 text-sm font-medium text-amber-600 dark:text-amber-400 transition-colors hover:bg-amber-500/10">
                <RotateCcw className="h-4 w-4" />
                Request Revision
              </button>
            </div>
          )}
        </div>

        {/* Sidebar: quality score + meta */}
        <div className="space-y-6">
          {lecture.quality_score && (
            <div className="rounded-2xl glass-card p-5 shadow-soft">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h3 className="font-display text-base font-semibold">AI Quality Score</h3>
              </div>
              <div className="mt-4 flex justify-center">
                <QualityScoreRing score={lecture.quality_score.overall} />
              </div>
              <div className="mt-4">
                <QualityBars quality={lecture.quality_score} />
              </div>
            </div>
          )}

          <div className="rounded-2xl glass-card p-5 shadow-soft">
            <h3 className="font-display text-sm font-semibold">Lecture Info</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">File</dt><dd className="font-medium truncate max-w-[160px]">{lecture.file_name}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Size</dt><dd className="font-medium">{lecture.file_size}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Type</dt><dd className="font-medium uppercase">{lecture.file_type}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Difficulty</dt><dd className="font-medium capitalize">{lecture.difficulty}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Study time</dt><dd className="font-medium">{lecture.estimated_study_time}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Sections</dt><dd className="font-medium">{sections.filter(s => s.visible).length} visible</dd></div>
            </dl>
          </div>

          <div className="rounded-2xl glass-card p-5 shadow-soft">
            <h3 className="font-display text-sm font-semibold">Versions</h3>
            <p className="mt-1 text-xs text-muted-foreground">{versions.length} version{versions.length === 1 ? '' : 's'} saved</p>
            <button onClick={() => setShowHistory(true)} className="mt-3 w-full rounded-xl border border-border py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/40">
              View revision history
            </button>
          </div>
        </div>
      </div>

      {/* Student preview modal */}
      <AnimatePresence>
        {showPreview && (
          <PreviewModal content={content} title={lecture.title} onClose={() => setShowPreview(false)} />
        )}
      </AnimatePresence>

      {/* Revision history modal */}
      <AnimatePresence>
        {showHistory && (
          <HistoryModal versions={versions} onClose={() => setShowHistory(false)} onRestore={restoreVersion} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ===== Preview modal ===== */
function PreviewModal({ content, title, onClose }: { content: LectureContent; title: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-background"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-xs font-medium text-primary">Student Preview</p>
            <h2 className="font-display text-lg font-semibold">{title}</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5">
          <div className="space-y-6">
            <div><h3 className="font-display text-sm font-semibold">Summary</h3><p className="mt-2 text-sm text-muted-foreground">{content.summary}</p></div>
            <div><h3 className="font-display text-sm font-semibold">Explanation</h3><p className="mt-2 text-sm text-muted-foreground">{content.explanation}</p></div>
            <div>
              <h3 className="font-display text-sm font-semibold">Key Concepts</h3>
              <div className="mt-2 space-y-1.5">
                {content.keyConcepts.map((c, i) => <div key={i} className="flex gap-2 text-sm text-muted-foreground"><span className="h-1.5 w-1.5 mt-1.5 rounded-full bg-primary" />{c}</div>)}
              </div>
            </div>
            <div>
              <h3 className="font-display text-sm font-semibold">Learning Objectives</h3>
              <div className="mt-2 space-y-1.5">
                {content.learningObjectives.map((o, i) => <div key={o.id} className="flex gap-2 text-sm text-muted-foreground"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{i + 1}</span>{o.text}</div>)}
              </div>
            </div>
            <div>
              <h3 className="font-display text-sm font-semibold">Flashcards ({content.flashcards.length})</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {content.flashcards.map((fc) => (
                  <div key={fc.id} className="rounded-xl border border-border bg-muted/20 p-3">
                    <p className="text-xs font-medium">{fc.front}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{fc.back}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-display text-sm font-semibold">Quiz ({content.quiz.length} questions)</h3>
              <div className="mt-2 space-y-2">
                {content.quiz.map((q, i) => (
                  <div key={q.id} className="rounded-xl border border-border bg-muted/20 p-3">
                    <p className="text-sm font-medium">{i + 1}. {q.question}</p>
                    {q.options && <div className="mt-1.5 space-y-1">{q.options.map((o, oi) => <div key={oi} className={cn('text-xs px-2 py-1 rounded', o === q.answer ? 'text-emerald-500 font-medium' : 'text-muted-foreground')}>• {o}</div>)}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ===== History modal ===== */
function HistoryModal({ versions, onClose, onRestore }: { versions: Version[]; onClose: () => void; onRestore: (v: Version) => void }) {
  const [expanded, setExpanded] = React.useState<string | null>(null);
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-background"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold">Revision History</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <div className="overflow-y-auto px-5 py-4">
          {versions.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No versions saved yet.</p>
          ) : (
            <div className="space-y-2">
              {versions.map((v) => (
                <div key={v.id} className="rounded-xl border border-border bg-muted/20">
                  <div className="flex items-center gap-3 p-3">
                    <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold', v.editor === 'ai' ? 'bg-primary/15 text-primary' : 'bg-accent/15 text-accent')}>
                      {v.editor === 'ai' ? 'AI' : 'P'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">Version {v.version_number}</p>
                      <p className="text-xs text-muted-foreground">{v.label} · {new Date(v.created_at).toLocaleString()}</p>
                    </div>
                    <button onClick={() => setExpanded(expanded === v.id ? null : v.id)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
                      <ChevronDown className={cn('h-4 w-4 transition-transform', expanded === v.id && 'rotate-180')} />
                    </button>
                    <button onClick={() => onRestore(v)} className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20">
                      <RotateCcw className="mr-1 inline h-3 w-3" />Restore
                    </button>
                  </div>
                  <AnimatePresence>
                    {expanded === v.id && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-border">
                        <div className="p-3 text-xs text-muted-foreground">
                          <p className="font-medium text-foreground">Summary preview:</p>
                          <p className="mt-1 line-clamp-3">{v.content.summary}</p>
                          <p className="mt-2 font-medium text-foreground">{v.content.quiz.length} quiz questions · {v.content.flashcards.length} flashcards</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
