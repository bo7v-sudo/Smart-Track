'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit3, Check, X, Plus, Trash2, RefreshCw, ChevronDown, ChevronUp,
  FileText, Lightbulb, Target, BookOpen, HelpCircle, Layers, BarChart3,
  AlignLeft, MessageSquare, Eye, EyeOff, GripVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  type LectureContent, type ContentSection, type QuizQuestion,
  type Flashcard, type AcademicTerm, type LearningObjective,
  type FAQItem, type DiagramSuggestion, type SectionType,
  generateLectureContent,
} from '@/lib/professor-ai';

const sectionIcons: Record<SectionType, React.ElementType> = {
  summary: AlignLeft,
  explanation: MessageSquare,
  concepts: Lightbulb,
  objectives: Target,
  terms: BookOpen,
  faqs: HelpCircle,
  flashcards: Layers,
  quiz: HelpCircle,
  diagrams: BarChart3,
};

/* ===== Editable text section (summary, explanation) ===== */
export function EditTextSection({
  title, value, onChange, onRegenerate, fileHint,
}: {
  title: string;
  value: string;
  onChange: (v: string) => void;
  onRegenerate: () => void;
  fileHint?: string;
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);

  React.useEffect(() => setDraft(value), [value]);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h4 className="font-display text-sm font-semibold">{title}</h4>
        <div className="flex items-center gap-1">
          <button onClick={onRegenerate} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary" title="Regenerate with AI">
            <RefreshCw className="h-4 w-4" />
          </button>
          {editing ? (
            <>
              <button onClick={() => { onChange(draft); setEditing(false); }} className="rounded-lg p-1.5 text-emerald-500 hover:bg-emerald-500/10" title="Save">
                <Check className="h-4 w-4" />
              </button>
              <button onClick={() => { setDraft(value); setEditing(false); }} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted" title="Cancel">
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" title="Edit">
              <Edit3 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      {editing ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={6}
          className="mt-3 w-full resize-y rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm leading-relaxed outline-none focus:border-primary/60 focus:bg-background focus:ring-2 focus:ring-primary/20"
        />
      ) : (
        <p className="mt-3 text-sm leading-relaxed text-foreground/90">{value}</p>
      )}
    </div>
  );
}

/* ===== Editable list section (concepts) ===== */
export function EditListSection({
  title, items, onChange, onRegenerate,
}: {
  title: string;
  items: string[];
  onChange: (v: string[]) => void;
  onRegenerate: () => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(items);
  const [newItem, setNewItem] = React.useState('');

  React.useEffect(() => setDraft(items), [items]);

  const update = (i: number, v: string) => setDraft(draft.map((item, idx) => idx === i ? v : item));
  const remove = (i: number) => setDraft(draft.filter((_, idx) => idx !== i));
  const add = () => { if (newItem.trim()) { setDraft([...draft, newItem.trim()]); setNewItem(''); } };

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h4 className="font-display text-sm font-semibold">{title}</h4>
        <div className="flex items-center gap-1">
          <button onClick={onRegenerate} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary" title="Regenerate">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button onClick={() => { if (editing) { onChange(draft); } setEditing(!editing); }} className={cn('rounded-lg p-1.5 transition-colors', editing ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
            {editing ? <Check className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {editing ? (
          <>
            {draft.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <input value={item} onChange={(e) => update(i, e.target.value)} className="flex-1 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm outline-none focus:border-primary/60" />
                <button onClick={() => remove(i)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <input value={newItem} onChange={(e) => setNewItem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="Add new..." className="flex-1 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm outline-none focus:border-primary/60" />
              <button onClick={add} className="rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/20">Add</button>
            </div>
          </>
        ) : (
          items.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span className="text-sm text-foreground/90">{item}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ===== Learning objectives ===== */
export function EditObjectivesSection({
  title, items, onChange, onRegenerate,
}: {
  title: string;
  items: LearningObjective[];
  onChange: (v: LearningObjective[]) => void;
  onRegenerate: () => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(items);
  const [newItem, setNewItem] = React.useState('');

  React.useEffect(() => setDraft(items), [items]);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h4 className="font-display text-sm font-semibold">{title}</h4>
        <div className="flex items-center gap-1">
          <button onClick={onRegenerate} className="rounded-lg p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary"><RefreshCw className="h-4 w-4" /></button>
          <button onClick={() => { if (editing) onChange(draft); setEditing(!editing); }} className={cn('rounded-lg p-1.5', editing ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
            {editing ? <Check className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {editing ? (
          <>
            {draft.map((item, i) => (
              <div key={item.id} className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{i + 1}</span>
                <input value={item.text} onChange={(e) => setDraft(draft.map((d, idx) => idx === i ? { ...d, text: e.target.value } : d))} className="flex-1 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm outline-none focus:border-primary/60" />
                <button onClick={() => setDraft(draft.filter((_, idx) => idx !== i))} className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <input value={newItem} onChange={(e) => setNewItem(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && newItem.trim()) { setDraft([...draft, { id: `lo_${Date.now()}`, text: newItem.trim() }]); setNewItem(''); } }} placeholder="Add objective..." className="flex-1 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm outline-none focus:border-primary/60" />
              <button onClick={() => { if (newItem.trim()) { setDraft([...draft, { id: `lo_${Date.now()}`, text: newItem.trim() }]); setNewItem(''); } }} className="rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/20">Add</button>
            </div>
          </>
        ) : (
          items.map((item, i) => (
            <div key={item.id} className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{i + 1}</span>
              <span className="text-sm text-foreground/90">{item.text}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ===== Academic terms ===== */
export function EditTermsSection({
  title, items, onChange, onRegenerate,
}: {
  title: string;
  items: AcademicTerm[];
  onChange: (v: AcademicTerm[]) => void;
  onRegenerate: () => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(items);

  React.useEffect(() => setDraft(items), [items]);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h4 className="font-display text-sm font-semibold">{title}</h4>
        <div className="flex items-center gap-1">
          <button onClick={onRegenerate} className="rounded-lg p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary"><RefreshCw className="h-4 w-4" /></button>
          <button onClick={() => { if (editing) onChange(draft); setEditing(!editing); }} className={cn('rounded-lg p-1.5', editing ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
            {editing ? <Check className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {(editing ? draft : items).map((term, i) => (
          <div key={term.id} className="rounded-xl border border-border/60 bg-muted/20 p-3">
            {editing ? (
              <>
                <input value={term.term} onChange={(e) => setDraft(draft.map((d, idx) => idx === i ? { ...d, term: e.target.value } : d))} className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-semibold outline-none focus:border-primary/60" />
                <textarea value={term.definition} onChange={(e) => setDraft(draft.map((d, idx) => idx === i ? { ...d, definition: e.target.value } : d))} rows={2} className="mt-2 w-full resize-none rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary/60" />
                <button onClick={() => setDraft(draft.filter((_, idx) => idx !== i))} className="mt-2 text-xs text-destructive hover:underline">Remove</button>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-primary">{term.term}</p>
                <p className="mt-1 text-xs text-muted-foreground">{term.definition}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== FAQs ===== */
export function EditFAQSection({
  title, items, onChange, onRegenerate,
}: {
  title: string;
  items: FAQItem[];
  onChange: (v: FAQItem[]) => void;
  onRegenerate: () => void;
}) {
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(items);

  React.useEffect(() => setDraft(items), [items]);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h4 className="font-display text-sm font-semibold">{title}</h4>
        <div className="flex items-center gap-1">
          <button onClick={onRegenerate} className="rounded-lg p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary"><RefreshCw className="h-4 w-4" /></button>
          <button onClick={() => { if (editing) onChange(draft); setEditing(!editing); }} className={cn('rounded-lg p-1.5', editing ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
            {editing ? <Check className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {(editing ? draft : items).map((faq, i) => (
          <div key={faq.id} className="rounded-xl border border-border/60 bg-muted/20 p-3">
            {editing ? (
              <>
                <input value={faq.question} onChange={(e) => setDraft(draft.map((d, idx) => idx === i ? { ...d, question: e.target.value } : d))} className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium outline-none focus:border-primary/60" />
                <textarea value={faq.answer} onChange={(e) => setDraft(draft.map((d, idx) => idx === i ? { ...d, answer: e.target.value } : d))} rows={2} className="mt-2 w-full resize-none rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary/60" />
                <button onClick={() => setDraft(draft.filter((_, idx) => idx !== i))} className="mt-2 text-xs text-destructive hover:underline">Remove</button>
              </>
            ) : (
              <>
                <button onClick={() => setExpanded(expanded === faq.id ? null : faq.id)} className="flex w-full items-center justify-between text-left">
                  <span className="text-sm font-medium">{faq.question}</span>
                  {expanded === faq.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>
                <AnimatePresence>
                  {expanded === faq.id && (
                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-2 overflow-hidden text-xs text-muted-foreground">
                      {faq.answer}
                    </motion.p>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== Flashcards ===== */
export function EditFlashcardsSection({
  title, items, onChange, onRegenerate,
}: {
  title: string;
  items: Flashcard[];
  onChange: (v: Flashcard[]) => void;
  onRegenerate: () => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(items);
  const [flipped, setFlipped] = React.useState<string | null>(null);

  React.useEffect(() => setDraft(items), [items]);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h4 className="font-display text-sm font-semibold">{title}</h4>
        <div className="flex items-center gap-1">
          <button onClick={onRegenerate} className="rounded-lg p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary"><RefreshCw className="h-4 w-4" /></button>
          <button onClick={() => { if (editing) onChange(draft); setEditing(!editing); }} className={cn('rounded-lg p-1.5', editing ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
            {editing ? <Check className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {(editing ? draft : items).map((card, i) => (
          <div key={card.id} className="relative rounded-xl border border-border/60 bg-gradient-to-br from-muted/30 to-muted/10 p-4">
            {editing ? (
              <>
                <input value={card.front} onChange={(e) => setDraft(draft.map((d, idx) => idx === i ? { ...d, front: e.target.value } : d))} className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium outline-none focus:border-primary/60" />
                <textarea value={card.back} onChange={(e) => setDraft(draft.map((d, idx) => idx === i ? { ...d, back: e.target.value } : d))} rows={2} className="mt-2 w-full resize-none rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary/60" />
                <button onClick={() => setDraft(draft.filter((_, idx) => idx !== i))} className="mt-2 text-xs text-destructive hover:underline">Remove</button>
              </>
            ) : (
              <>
                <button onClick={() => setFlipped(flipped === card.id ? null : card.id)} className="w-full text-left">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{flipped === card.id ? 'Back' : 'Front'}</p>
                  <p className="mt-1.5 text-sm">{flipped === card.id ? card.back : card.front}</p>
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      {!editing && <p className="mt-3 text-center text-xs text-muted-foreground">Click a card to flip</p>}
    </div>
  );
}

/* ===== Quiz questions ===== */
export function EditQuizSection({
  title, items, onChange, onRegenerate,
}: {
  title: string;
  items: QuizQuestion[];
  onChange: (v: QuizQuestion[]) => void;
  onRegenerate: () => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(items);

  React.useEffect(() => setDraft(items), [items]);

  const typeLabels: Record<QuizQuestion['type'], string> = {
    mcq: 'Multiple Choice', truefalse: 'True/False', fillblank: 'Fill in the Blank', shortanswer: 'Short Answer',
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h4 className="font-display text-sm font-semibold">{title}</h4>
        <div className="flex items-center gap-1">
          <button onClick={onRegenerate} className="rounded-lg p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary"><RefreshCw className="h-4 w-4" /></button>
          <button onClick={() => { if (editing) onChange(draft); setEditing(!editing); }} className={cn('rounded-lg p-1.5', editing ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
            {editing ? <Check className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="mt-3 space-y-3">
        {(editing ? draft : items).map((q, i) => (
          <div key={q.id} className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{typeLabels[q.type]}</span>
              <span className="text-xs text-muted-foreground">Q{i + 1}</span>
              {editing && <button onClick={() => setDraft(draft.filter((_, idx) => idx !== i))} className="ml-auto text-xs text-destructive hover:underline">Remove</button>}
            </div>
            {editing ? (
              <div className="mt-2 space-y-2">
                <input value={q.question} onChange={(e) => setDraft(draft.map((d, idx) => idx === i ? { ...d, question: e.target.value } : d))} className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary/60" />
                {q.options && q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <span className={cn('h-4 w-4 rounded-full border', opt === q.answer ? 'border-emerald-500 bg-emerald-500' : 'border-border')} />
                    <input value={opt} onChange={(e) => setDraft(draft.map((d, idx) => idx === i ? { ...d, options: d.options?.map((o, oidx) => oidx === oi ? e.target.value : o) } : d))} className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary/60" />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-muted-foreground">Answer:</label>
                  <input value={q.answer} onChange={(e) => setDraft(draft.map((d, idx) => idx === i ? { ...d, answer: e.target.value } : d))} className="mt-1 w-full rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-1.5 text-xs font-medium outline-none focus:border-emerald-500/60" />
                </div>
              </div>
            ) : (
              <>
                <p className="mt-2 text-sm font-medium">{q.question}</p>
                {q.options && (
                  <div className="mt-2 space-y-1">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className={cn('flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs', opt === q.answer ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground')}>
                        <span className={cn('h-3.5 w-3.5 rounded-full border', opt === q.answer ? 'border-emerald-500 bg-emerald-500' : 'border-border')} />
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
                {!q.options && (
                  <div className="mt-2 rounded-lg bg-emerald-500/5 px-3 py-2 text-xs">
                    <span className="text-muted-foreground">Answer: </span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">{q.answer}</span>
                  </div>
                )}
                {q.explanation && <p className="mt-2 text-xs text-muted-foreground">💡 {q.explanation}</p>}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== Diagrams ===== */
export function EditDiagramsSection({
  title, items, onRegenerate,
}: {
  title: string;
  items: DiagramSuggestion[];
  onRegenerate: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h4 className="font-display text-sm font-semibold">{title}</h4>
        <button onClick={onRegenerate} className="rounded-lg p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary"><RefreshCw className="h-4 w-4" /></button>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map((dg) => (
          <div key={dg.id} className="rounded-xl border border-dashed border-primary/30 bg-primary/[0.03] p-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{dg.type}</span>
            <p className="mt-2 text-sm font-semibold">{dg.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{dg.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== Section wrapper with visibility toggle + delete ===== */
export function SectionWrapper({
  section, children, onToggleVisible, onDelete,
}: {
  section: ContentSection;
  children: React.ReactNode;
  onToggleVisible: () => void;
  onDelete: () => void;
}) {
  const Icon = sectionIcons[section.type];
  return (
    <AnimatePresence>
      {section.visible && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          layout
        >
          <div className="relative">
            <div className="absolute -left-10 top-5 hidden flex-col items-center gap-1 lg:flex">
              <GripVertical className="h-4 w-4 text-muted-foreground/40" />
              <button onClick={onToggleVisible} className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground" title="Hide section">
                <EyeOff className="h-3.5 w-3.5" />
              </button>
              <button onClick={onDelete} className="rounded-lg p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" title="Delete section">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ===== Hidden section pill (for re-showing) ===== */
export function HiddenSectionPill({
  section, onShow,
}: {
  section: ContentSection;
  onShow: () => void;
}) {
  const Icon = sectionIcons[section.type];
  return (
    <button
      onClick={onShow}
      className="inline-flex items-center gap-2 rounded-full border border-dashed border-border bg-muted/20 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
    >
      <Eye className="h-3.5 w-3.5" />
      {section.title}
    </button>
  );
}
