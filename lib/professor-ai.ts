// Mock AI Lecture Assistant engine.
// Generates realistic lecture content from an uploaded file.
// Architecture is ready to swap for OpenAI/Gemini — see generateLectureContent.

export type LectureStatus =
  | 'draft'
  | 'uploading'
  | 'processing'
  | 'review'
  | 'revision'
  | 'approved'
  | 'published'
  | 'archived';

export type FileType = 'pdf' | 'pptx' | 'docx' | 'image' | 'video' | 'notes';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type QuizQuestion = {
  id: string;
  type: 'mcq' | 'truefalse' | 'fillblank' | 'shortanswer';
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
};

export type Flashcard = {
  id: string;
  front: string;
  back: string;
};

export type AcademicTerm = {
  id: string;
  term: string;
  definition: string;
};

export type LearningObjective = {
  id: string;
  text: string;
};

export type DiagramSuggestion = {
  id: string;
  title: string;
  description: string;
  type: string;
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export type ContentSection = {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
};

export type SectionType =
  | 'summary'
  | 'explanation'
  | 'concepts'
  | 'objectives'
  | 'terms'
  | 'faqs'
  | 'flashcards'
  | 'quiz'
  | 'diagrams';

export type LectureContent = {
  summary: string;
  explanation: string;
  keyConcepts: string[];
  learningObjectives: LearningObjective[];
  academicTerms: AcademicTerm[];
  faqs: FAQItem[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  diagrams: DiagramSuggestion[];
};

export type QualityScore = {
  readability: number;
  completeness: number;
  difficulty: number;
  studentFriendliness: number;
  overall: number;
};

export type ProcessingStep = {
  id: string;
  label: string;
  icon: string;
};

export const processingSteps: ProcessingStep[] = [
  { id: 'extract', label: 'Extracting text', icon: 'file' },
  { id: 'structure', label: 'Understanding lecture structure', icon: 'layout' },
  { id: 'concepts', label: 'Identifying key concepts', icon: 'lightbulb' },
  { id: 'summary', label: 'Creating summary', icon: 'align-left' },
  { id: 'explanations', label: 'Generating explanations', icon: 'message' },
  { id: 'quizzes', label: 'Creating quizzes', icon: 'help' },
  { id: 'flashcards', label: 'Creating flashcards', icon: 'layers' },
  { id: 'terms', label: 'Extracting academic terms', icon: 'book' },
  { id: 'objectives', label: 'Generating learning objectives', icon: 'target' },
  { id: 'diagrams', label: 'Suggesting diagrams & visual aids', icon: 'chart' },
];

export type LectureMeta = {
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedStudyTime: string;
};

const lectureTemplates: Record<string, { title: string; topic: string; field: string }> = {
  chem: { title: 'Carbonyl Reactions & Mechanisms', topic: 'carbonyl chemistry', field: 'Organic Chemistry' },
  math: { title: 'Eigenvalues and Eigenvectors', topic: 'linear algebra', field: 'Mathematics' },
  cs: { title: 'Binary Trees & Traversal', topic: 'data structures', field: 'Computer Science' },
  bio: { title: 'Cellular Respiration Pathways', topic: 'biochemistry', field: 'Biology' },
  econ: { title: 'Supply, Demand & Market Equilibrium', topic: 'microeconomics', field: 'Economics' },
  phys: { title: 'Newtonian Mechanics & Forces', topic: 'classical mechanics', field: 'Physics' },
  default: { title: 'Lecture Analysis', topic: 'the subject matter', field: 'General Studies' },
};

function detectTemplate(fileName: string) {
  const lower = fileName.toLowerCase();
  if (lower.includes('chem') || lower.includes('carbon') || lower.includes('organic')) return lectureTemplates.chem;
  if (lower.includes('math') || lower.includes('eigen') || lower.includes('algebra')) return lectureTemplates.math;
  if (lower.includes('cs') || lower.includes('tree') || lower.includes('data') || lower.includes('algorithm')) return lectureTemplates.cs;
  if (lower.includes('bio') || lower.includes('cell') || lower.includes('respiration')) return lectureTemplates.bio;
  if (lower.includes('econ') || lower.includes('supply') || lower.includes('demand')) return lectureTemplates.econ;
  if (lower.includes('phys') || lower.includes('newton') || lower.includes('force')) return lectureTemplates.phys;
  return lectureTemplates.default;
}

function rid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Generates the full AI content for a lecture from a file name.
 * Replace the body of this function with an OpenAI/Gemini API call
 * when wiring up real AI. The return shape stays the same.
 */
export function generateLectureContent(fileName: string): {
  content: LectureContent;
  meta: LectureMeta;
  quality: QualityScore;
} {
  const tpl = detectTemplate(fileName);

  const content: LectureContent = {
    summary: `This lecture covers ${tpl.topic} within ${tpl.field}. It introduces the core principles, walks through worked examples, and connects the material to broader course themes. Students should understand the foundational definitions, be able to apply the key methods to solve problems, and recognize how these concepts appear in exams.`,
    explanation: `Think of ${tpl.topic} like learning a new language. At first, the rules seem arbitrary, but once you see the underlying pattern, everything clicks. The key is to focus on the "why" behind each concept, not just memorize the "what." Start with the simplest example, understand why it works, then gradually apply the same logic to harder problems. Use diagrams to visualize the process, and test yourself with practice questions to confirm you truly understand.`,
    keyConcepts: [
      `Core definitions and terminology in ${tpl.field.toLowerCase()}`,
      `The step-by-step method for solving ${tpl.topic} problems`,
      `Common pitfalls and how to avoid them`,
      `How ${tpl.topic} connects to previous lectures in the course`,
      `Real-world applications and examples`,
    ],
    learningObjectives: [
      { id: rid('lo'), text: `Define and explain the key terms related to ${tpl.topic}` },
      { id: rid('lo'), text: `Apply the core method to solve practice problems` },
      { id: rid('lo'), text: `Identify common mistakes and correct them` },
      { id: rid('lo'), text: `Connect ${tpl.topic} to broader course concepts` },
    ],
    academicTerms: [
      { id: rid('term'), term: 'Catalyst', definition: 'A substance that increases the rate of a reaction without being consumed.' },
      { id: rid('term'), term: 'Equilibrium', definition: 'A state where opposing forces or processes are balanced.' },
      { id: rid('term'), term: 'Gradient', definition: 'The rate of change of a quantity with respect to another variable.' },
      { id: rid('term'), term: 'Threshold', definition: 'The minimum level needed for a process to begin or activate.' },
    ],
    faqs: [
      { id: rid('faq'), question: `What is the most important concept to remember from this lecture?`, answer: `The foundational principle of ${tpl.topic} is understanding the relationship between cause and effect — how changes in one variable directly impact the outcome. Master this before moving to advanced applications.` },
      { id: rid('faq'), question: `How do I know if I'm ready for the exam?`, answer: `You should be able to explain each concept in your own words, solve practice problems without referring to notes, and teach the material to someone else. If you can do all three, you're exam-ready.` },
      { id: rid('faq'), question: `What's the best way to study this material?`, answer: `Break your study into 25-minute focused sessions. Start by reviewing the summary, then work through practice problems actively. Use the flashcards for quick recall, and take the quiz to test your understanding.` },
    ],
    flashcards: [
      { id: rid('fc'), front: `What is the primary focus of ${tpl.topic}?`, back: `Understanding the core principles and applying them to solve related problems systematically.` },
      { id: rid('fc'), front: `Name one common mistake students make with ${tpl.topic}.`, back: `Memorizing formulas without understanding the underlying reasoning, which makes it hard to adapt to new problem types.` },
      { id: rid('fc'), front: `How does ${tpl.topic} relate to previous lectures?`, back: `It builds on foundational concepts introduced earlier, extending them to more complex scenarios and applications.` },
      { id: rid('fc'), front: `What study strategy works best for this topic?`, back: `Active recall with practice problems, supplemented by spaced repetition using flashcards.` },
      { id: rid('fc'), front: `Define the key term from this lecture.`, back: `The central term refers to the mechanism that governs how the system behaves under different conditions.` },
    ],
    quiz: [
      {
        id: rid('q'),
        type: 'mcq',
        question: `Which best describes the main topic of this lecture?`,
        options: [`The history of ${tpl.field}`, `Core principles of ${tpl.topic}`, `Advanced research methods`, `Lab safety procedures`],
        answer: `Core principles of ${tpl.topic}`,
        explanation: `This lecture focuses on understanding and applying the core principles of the subject.`,
      },
      {
        id: rid('q'),
        type: 'mcq',
        question: `What is the recommended first step when approaching a ${tpl.topic} problem?`,
        options: [`Memorize the formula`, `Identify the given information`, `Guess the answer`, `Skip to the next question`],
        answer: `Identify the given information`,
        explanation: `Always start by identifying what you know and what you need to find.`,
      },
      {
        id: rid('q'),
        type: 'truefalse',
        question: `Understanding the "why" behind a concept is more important than memorizing the "what."`,
        answer: `True`,
        explanation: `Conceptual understanding allows you to adapt to new problem types.`,
      },
      {
        id: rid('q'),
        type: 'truefalse',
        question: `You should avoid using diagrams when studying ${tpl.topic}.`,
        answer: `False`,
        explanation: `Visual aids are highly recommended as they help solidify understanding.`,
      },
      {
        id: rid('q'),
        type: 'fillblank',
        question: `The best study strategy combines active recall with ______ repetition.`,
        answer: `spaced`,
        explanation: `Spaced repetition strengthens long-term memory by reviewing at increasing intervals.`,
      },
      {
        id: rid('q'),
        type: 'fillblank',
        question: `A ______ is a substance that increases reaction rate without being consumed.`,
        answer: `catalyst`,
        explanation: `Catalysts lower the activation energy needed for a reaction.`,
      },
      {
        id: rid('q'),
        type: 'shortanswer',
        question: `Explain in 2-3 sentences how ${tpl.topic} connects to the broader course themes.`,
        answer: `${tpl.topic} builds on earlier concepts and extends them to more complex scenarios. It serves as a foundation for the advanced topics covered later in the course, making it essential to master now.`,
        explanation: `A good answer connects this lecture to prior material and future applications.`,
      },
      {
        id: rid('q'),
        type: 'shortanswer',
        question: `Describe one common mistake students make and how to avoid it.`,
        answer: `A common mistake is memorizing formulas without understanding the reasoning behind them. To avoid this, always ask "why does this work?" and try explaining the concept to someone else.`,
        explanation: `Identifying and avoiding common pitfalls is a key learning objective.`,
      },
    ],
    diagrams: [
      { id: rid('dg'), title: `Concept Map of ${tpl.title}`, description: `A visual map showing how the key concepts in this lecture relate to each other and to previous material.`, type: 'Concept Map' },
      { id: rid('dg'), title: `Step-by-Step Flowchart`, description: `A flowchart illustrating the problem-solving process for ${tpl.topic}, from identifying the given information to reaching the solution.`, type: 'Flowchart' },
      { id: rid('dg'), title: `Comparison Table`, description: `A side-by-side table comparing the different methods or concepts covered in this lecture.`, type: 'Comparison Table' },
    ],
  };

  const difficulty: Difficulty = fileName.length % 2 === 0 ? 'medium' : 'easy';
  const studyTime = `${30 + (fileName.length % 4) * 10} min`;

  const quality: QualityScore = {
    readability: 82 + (fileName.length % 8),
    completeness: 88 + (fileName.length % 6),
    difficulty: difficulty === 'easy' ? 35 : difficulty === 'medium' ? 62 : 85,
    studentFriendliness: 84 + (fileName.length % 7),
    overall: 0,
  };
  quality.overall = Math.round(
    (quality.readability + quality.completeness + quality.studentFriendliness + (100 - quality.difficulty)) / 4,
  );

  const meta: LectureMeta = {
    title: tpl.title,
    description: `AI-generated learning content from your uploaded ${tpl.field.toLowerCase()} lecture. Review and customize before publishing to students.`,
    difficulty,
    estimatedStudyTime: studyTime,
  };

  return { content, meta, quality };
}

export const publishSteps: ProcessingStep[] = [
  { id: 'publish', label: 'Publish lecture', icon: 'upload' },
  { id: 'notify', label: 'Notify students', icon: 'bell' },
  { id: 'timeline', label: 'Update course timeline', icon: 'calendar' },
  { id: 'dashboards', label: 'Add lecture to student dashboards', icon: 'layout' },
  { id: 'package', label: 'Generate study package', icon: 'package' },
  { id: 'quizzes', label: 'Generate quizzes', icon: 'help' },
  { id: 'flashcards', label: 'Generate flashcards', icon: 'layers' },
  { id: 'readiness', label: 'Update exam readiness', icon: 'check' },
  { id: 'plans', label: 'Update student study plans', icon: 'trending' },
];

export const statusConfig: Record<LectureStatus, { label: string; color: string; dot: string }> = {
  draft: { label: 'Draft', color: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground' },
  uploading: { label: 'Uploading', color: 'bg-blue-500/15 text-blue-400', dot: 'bg-blue-400' },
  processing: { label: 'AI Processing', color: 'bg-primary/15 text-primary', dot: 'bg-primary' },
  review: { label: 'Professor Review', color: 'bg-amber-500/15 text-amber-500', dot: 'bg-amber-500' },
  revision: { label: 'Needs Revision', color: 'bg-orange-500/15 text-orange-400', dot: 'bg-orange-400' },
  approved: { label: 'Approved', color: 'bg-accent/15 text-accent', dot: 'bg-accent' },
  published: { label: 'Published', color: 'bg-emerald-500/15 text-emerald-500', dot: 'bg-emerald-500' },
  archived: { label: 'Archived', color: 'bg-zinc-500/15 text-zinc-400', dot: 'bg-zinc-400' },
};

export const fileIcons: Record<FileType, string> = {
  pdf: 'red',
  pptx: 'orange',
  docx: 'blue',
  image: 'emerald',
  video: 'purple',
  notes: 'amber',
};

export function detectFileType(fileName: string): FileType {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  if (ext === 'pdf') return 'pdf';
  if (['ppt', 'pptx'].includes(ext)) return 'pptx';
  if (['doc', 'docx'].includes(ext)) return 'docx';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return 'video';
  return 'notes';
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const courseColors = [
  'from-primary to-accent',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
  'from-violet-500 to-purple-500',
];

export const semesters = ['Fall 2026', 'Spring 2027', 'Summer 2027', 'Fall 2027'];

export const defaultSections: ContentSection[] = [
  { id: 'summary', type: 'summary', title: 'Lecture Summary', visible: true },
  { id: 'explanation', type: 'explanation', title: 'Simplified Explanation', visible: true },
  { id: 'concepts', type: 'concepts', title: 'Key Concepts', visible: true },
  { id: 'objectives', type: 'objectives', title: 'Learning Objectives', visible: true },
  { id: 'terms', type: 'terms', title: 'Important Academic Terms', visible: true },
  { id: 'faqs', type: 'faqs', title: 'Frequently Asked Questions', visible: true },
  { id: 'flashcards', type: 'flashcards', title: 'Flashcards', visible: true },
  { id: 'quiz', type: 'quiz', title: 'Quiz Questions', visible: true },
  { id: 'diagrams', type: 'diagrams', title: 'Suggested Diagrams', visible: true },
];
