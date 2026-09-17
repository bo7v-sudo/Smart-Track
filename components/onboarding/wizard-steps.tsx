'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Building2,
  FlaskConical,
  Layers,
  TrendingUp,
  BookOpen,
  Clock,
  SunMoon,
  Brain,
  AlertTriangle,
  CalendarPlus,
  Target,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  X,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  OptionCards,
  SelectField,
  TextInput,
  NumberStepper,
  RangeSlider,
  ChipMultiSelect,
  TextArea,
} from '@/components/onboarding/onboarding-fields';
import {
  universities,
  faculties,
  academicYears,
  gpaScales,
  studyTimeOptions,
  learningStyleOptions,
  commonSubjects,
  type OnboardingData,
  type AIProfile,
  type ExamEntry,
} from '@/lib/onboarding';

/* Shared step header icon */
function StepIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex justify-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary">
        {children}
      </span>
    </div>
  );
}

/* ============ Step 1: Welcome ============ */
export function WelcomeStep({ name }: { name: string }) {
  return (
    <div className="text-center">
      <StepIcon>
        <GraduationCap className="h-8 w-8" />
      </StepIcon>
      <p className="text-sm font-medium text-primary">Welcome to Smart Track</p>
      <h2 className="mt-2 font-display text-2xl font-semibold">
        Hi{name ? `, ${name}` : ''}! Let&apos;s set up your study profile.
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        In the next few steps, we&apos;ll learn about your academic life so our
        AI can build a personalized study plan just for you. It takes about 2
        minutes.
      </p>
      <div className="mx-auto mt-6 grid max-w-sm grid-cols-3 gap-3">
        {[
          { icon: Zap, label: '2 min' },
          { icon: Brain, label: 'AI-powered' },
          { icon: Target, label: 'Personalized' },
        ].map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center gap-1.5 rounded-xl bg-muted/30 p-3"
          >
            <item.icon className="h-5 w-5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ Step 2: University ============ */
export function UniversityStep({
  data,
  update,
}: {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
}) {
  return (
    <div>
      <StepIcon>
        <Building2 className="h-8 w-8" />
      </StepIcon>
      <SelectField
        options={universities}
        value={data.university}
        onChange={(v) => update({ university: v })}
        placeholder="Search or select your university..."
        allowCustom
      />
    </div>
  );
}

/* ============ Step 3: Faculty ============ */
export function FacultyStep({
  data,
  update,
}: {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
}) {
  return (
    <div>
      <StepIcon>
        <FlaskConical className="h-8 w-8" />
      </StepIcon>
      <OptionCards
        options={faculties.map((f) => ({ value: f, label: f }))}
        value={data.faculty}
        onChange={(v) => update({ faculty: v })}
        columns={2}
      />
    </div>
  );
}

/* ============ Step 4: Department ============ */
export function DepartmentStep({
  data,
  update,
}: {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
}) {
  return (
    <div>
      <StepIcon>
        <Layers className="h-8 w-8" />
      </StepIcon>
      <TextInput
        value={data.department}
        onChange={(v) => update({ department: v })}
        placeholder="e.g. Computer Science, Pre-Med, Mechanical Engineering..."
      />
    </div>
  );
}

/* ============ Step 5: Academic Year ============ */
export function YearStep({
  data,
  update,
}: {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
}) {
  return (
    <div>
      <StepIcon>
        <TrendingUp className="h-8 w-8" />
      </StepIcon>
      <OptionCards
        options={academicYears.map((y) => ({ value: y, label: y }))}
        value={data.academic_year}
        onChange={(v) => update({ academic_year: v })}
        columns={3}
      />
    </div>
  );
}

/* ============ Step 6: Current GPA ============ */
export function GpaStep({
  data,
  update,
}: {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
}) {
  const maxGpa = data.gpa_scale;
  return (
    <div>
      <StepIcon>
        <TrendingUp className="h-8 w-8" />
      </StepIcon>
      <div className="mb-5 flex justify-center gap-2">
        {gpaScales.map((scale) => (
          <button
            key={scale}
            type="button"
            onClick={() => {
              update({ gpa_scale: scale, current_gpa: null });
            }}
            className={
              'rounded-lg px-4 py-2 text-sm font-medium transition-all ' +
              (data.gpa_scale === scale
                ? 'bg-primary/15 text-primary ring-2 ring-primary/20'
                : 'bg-muted/30 text-muted-foreground hover:bg-muted/50')
            }
          >
            {scale.toFixed(1)} scale
          </button>
        ))}
      </div>
      <RangeSlider
        value={data.current_gpa ?? 0}
        onChange={(v) => update({ current_gpa: v })}
        min={0}
        max={maxGpa}
        step={0.05}
        formatValue={(v) => v.toFixed(2)}
      />
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Drag to set your current GPA. Don&apos;t worry — you can update this
        anytime.
      </p>
    </div>
  );
}

/* ============ Step 7: Current Subjects ============ */
export function SubjectsStep({
  data,
  update,
}: {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
}) {
  return (
    <div>
      <StepIcon>
        <BookOpen className="h-8 w-8" />
      </StepIcon>
      <ChipMultiSelect
        options={commonSubjects}
        selected={data.current_subjects}
        onChange={(v) => update({ current_subjects: v })}
        placeholder="Add a subject not listed..."
      />
      <p className="mt-3 text-center text-xs text-muted-foreground">
        {data.current_subjects.length} subject{data.current_subjects.length === 1 ? '' : 's'} added
      </p>
    </div>
  );
}

/* ============ Step 8: Weekly Study Hours ============ */
export function StudyHoursStep({
  data,
  update,
}: {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
}) {
  return (
    <div>
      <StepIcon>
        <Clock className="h-8 w-8" />
      </StepIcon>
      <RangeSlider
        value={data.weekly_study_hours}
        onChange={(v) => update({ weekly_study_hours: v })}
        min={0}
        max={40}
        step={1}
        formatValue={(v) => `${v}h`}
      />
      <div className="mt-5 grid grid-cols-3 gap-2 text-center">
        {[
          { range: '0-10', label: 'Light' },
          { range: '10-20', label: 'Balanced' },
          { range: '20+', label: 'Intensive' },
        ].map((tier) => (
          <div key={tier.label} className="rounded-xl bg-muted/20 p-2.5">
            <p className="text-xs font-semibold">{tier.label}</p>
            <p className="text-[11px] text-muted-foreground">{tier.range}h/wk</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ Step 9: Preferred Study Time ============ */
export function StudyTimeStep({
  data,
  update,
}: {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
}) {
  return (
    <div>
      <StepIcon>
        <SunMoon className="h-8 w-8" />
      </StepIcon>
      <OptionCards
        options={studyTimeOptions.map((t) => ({
          value: t.value,
          label: t.label,
          icon: t.icon,
          desc: t.desc,
        }))}
        value={data.preferred_study_time}
        onChange={(v) => update({ preferred_study_time: v })}
        columns={2}
      />
    </div>
  );
}

/* ============ Step 10: Learning Style ============ */
export function LearningStyleStep({
  data,
  update,
}: {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
}) {
  return (
    <div>
      <StepIcon>
        <Brain className="h-8 w-8" />
      </StepIcon>
      <OptionCards
        options={learningStyleOptions.map((l) => ({
          value: l.value,
          label: l.label,
          desc: l.desc,
        }))}
        value={data.learning_style}
        onChange={(v) => update({ learning_style: v })}
        columns={2}
      />
    </div>
  );
}

/* ============ Step 11: Weak Subjects ============ */
export function WeakSubjectsStep({
  data,
  update,
}: {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
}) {
  // Suggest from current subjects first, then common subjects
  const suggestions = [
    ...data.current_subjects,
    ...commonSubjects.filter((s) => !data.current_subjects.includes(s)),
  ];
  return (
    <div>
      <StepIcon>
        <AlertTriangle className="h-8 w-8" />
      </StepIcon>
      <ChipMultiSelect
        options={suggestions}
        selected={data.weak_subjects}
        onChange={(v) => update({ weak_subjects: v })}
        placeholder="Add a subject you struggle with..."
      />
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Be honest — this helps our AI target your study plan. Skip if none.
      </p>
    </div>
  );
}

/* ============ Step 12: Upcoming Exams ============ */
export function ExamsStep({
  data,
  update,
}: {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
}) {
  const [subject, setSubject] = React.useState('');
  const [date, setDate] = React.useState('');

  const addExam = () => {
    if (!subject.trim() || !date) return;
    const entry: ExamEntry = {
      id: Date.now().toString(),
      subject: subject.trim(),
      date,
    };
    update({ upcoming_exams: [...data.upcoming_exams, entry] });
    setSubject('');
    setDate('');
  };

  const removeExam = (id: string) => {
    update({ upcoming_exams: data.upcoming_exams.filter((e) => e.id !== id) });
  };

  const sorted = data.upcoming_exams
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div>
      <StepIcon>
        <CalendarPlus className="h-8 w-8" />
      </StepIcon>

      {/* Add form */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Exam name (e.g. Organic Chem Midterm)"
          className="h-12 flex-1 rounded-xl border border-border bg-muted/30 px-4 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary/60 focus:bg-background focus:ring-2 focus:ring-primary/20"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-12 rounded-xl border border-border bg-muted/30 px-4 text-sm outline-none transition-all focus:border-primary/60 focus:bg-background focus:ring-2 focus:ring-primary/20 sm:w-44"
        />
        <button
          type="button"
          onClick={addExam}
          disabled={!subject.trim() || !date}
          className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl bg-primary/10 px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary/20 disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      {/* List */}
      {sorted.length > 0 && (
        <div className="mt-4 space-y-2">
          {sorted.map((exam) => {
            const daysAway = Math.ceil(
              (new Date(exam.date).getTime() - Date.now()) / 86400000,
            );
            return (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-3"
              >
                <span className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="text-[9px] font-medium uppercase leading-none">
                    {new Date(exam.date).toLocaleDateString('en', { month: 'short' })}
                  </span>
                  <span className="font-display text-sm font-bold leading-none">
                    {new Date(exam.date).getDate()}
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{exam.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {daysAway > 0
                      ? `In ${daysAway} days`
                      : daysAway === 0
                        ? 'Today'
                        : `${Math.abs(daysAway)} days ago`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeExam(exam.id)}
                  aria-label="Remove exam"
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      <p className="mt-3 text-center text-xs text-muted-foreground">
        {sorted.length} exam{sorted.length === 1 ? '' : 's'} added · Skip if none scheduled yet
      </p>
    </div>
  );
}

/* ============ Step 13: Personal Goals ============ */
export function GoalsStep({
  data,
  update,
}: {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
}) {
  const suggestions = [
    'Make the Dean\'s List',
    'Raise my GPA by 0.3',
    'Pass all my finals',
    'Study more consistently',
    'Stop procrastinating',
    'Get better at math',
  ];
  return (
    <div>
      <StepIcon>
        <Target className="h-8 w-8" />
      </StepIcon>
      <TextArea
        value={data.personal_goals}
        onChange={(v) => update({ personal_goals: v })}
        placeholder="What do you want to achieve this semester? (e.g. Make Dean's List, raise my GPA, stop cramming...)"
        rows={4}
      />
      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Quick suggestions
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() =>
                update({
                  personal_goals: data.personal_goals
                    ? `${data.personal_goals}, ${s}`
                    : s,
                })
              }
              className="rounded-full border border-border bg-muted/20 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
            >
              + {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ AI Profile Summary ============ */
export function AIProfileScreen({
  profile,
  onEnter,
}: {
  profile: AIProfile;
  onEnter: () => void;
}) {
  const riskColor = {
    low: 'text-emerald-500 bg-emerald-500/10',
    moderate: 'text-amber-500 bg-amber-500/10',
    high: 'text-destructive bg-destructive/10',
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-radial from-primary/15 via-accent/10 to-transparent blur-3xl" />
      </div>

      <header className="flex items-center justify-center px-4 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="font-display text-base font-semibold">
            Smart<span className="text-primary">Track</span>
          </span>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          {/* Header */}
          <div className="text-center">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow"
            >
              <Sparkles className="h-8 w-8" />
            </motion.span>
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
              Your AI Study Profile is ready
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Based on your answers, here&apos;s what our AI recommends to help
              you succeed this semester.
            </p>
          </div>

          {/* Summary card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 rounded-3xl glass-card p-6 shadow-soft sm:p-8"
          >
            {/* Productivity score + risk */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-stretch">
              <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 p-5">
                <p className="text-xs font-medium text-muted-foreground">
                  Productivity Score
                </p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="font-display text-4xl font-semibold text-gradient"
                >
                  {profile.productivityScore}
                </motion.p>
                <p className="text-[11px] text-muted-foreground">out of 100</p>
              </div>
              <div className="flex flex-1 flex-col justify-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Risk Level
                  </span>
                  <span
                    className={
                      'rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ' +
                      riskColor[profile.riskLevel]
                    }
                  >
                    {profile.riskLevel}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Recommended study
                  </span>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {profile.suggestedWeeklyHours}h / week
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {profile.summary}
                </p>
              </div>
            </div>

            {/* Strengths + Weak areas */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <p className="text-sm font-semibold">Predicted Strengths</p>
                </div>
                <ul className="mt-3 space-y-2">
                  {profile.strengths.length > 0 ? (
                    profile.strengths.map((s, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.08 }}
                        className="flex items-start gap-2 text-xs text-foreground/85"
                      >
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
                        {s}
                      </motion.li>
                    ))
                  ) : (
                    <li className="text-xs text-muted-foreground">
                      Complete more steps for deeper insights.
                    </li>
                  )}
                </ul>
              </div>
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <p className="text-sm font-semibold">Weak Areas</p>
                </div>
                <ul className="mt-3 space-y-2">
                  {profile.weakAreas.length > 0 ? (
                    profile.weakAreas.map((s, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.08 }}
                        className="flex items-start gap-2 text-xs text-foreground/85"
                      >
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                        {s}
                      </motion.li>
                    ))
                  ) : (
                    <li className="text-xs text-emerald-500">
                      No major weak areas detected. Great foundation!
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Study strategy */}
            <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">Recommended Study Strategy</p>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-2 text-sm leading-relaxed text-foreground/85"
              >
                {profile.studyStrategy}
              </motion.p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center"
          >
            <button
              onClick={onEnter}
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
            >
              Enter my dashboard
              <ArrowRightSmall />
            </button>
            <p className="mt-3 text-xs text-muted-foreground">
              You can update your profile anytime in settings.
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

function ArrowRightSmall() {
  return (
    <svg
      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
