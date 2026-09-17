export type Subject = {
  id: string;
  name: string;
  code: string;
  color: string;
  progress: number;
  grade: string;
  nextExam: string;
  hoursThisWeek: number;
};

export type StudyTask = {
  id: string;
  title: string;
  subject: string;
  duration: number;
  priority: 'high' | 'medium' | 'low';
  done: boolean;
  type: 'reading' | 'quiz' | 'review' | 'assignment' | 'lecture' | 'summary';
};

export type ExamEvent = {
  id: string;
  title: string;
  subject: string;
  date: string;
  daysAway: number;
  color: string;
};

export type Activity = {
  id: string;
  icon: 'quiz' | 'summary' | 'plan' | 'grade' | 'streak';
  text: string;
  time: string;
};

export type AIRecommendation = {
  id: string;
  icon: 'alert' | 'tip' | 'plan' | 'quiz';
  title: string;
  detail: string;
  action: string;
};

export type Notification = {
  id: string;
  title: string;
  detail: string;
  time: string;
  read: boolean;
};

export const subjects: Subject[] = [
  {
    id: 's1',
    name: 'Organic Chemistry',
    code: 'CHEM 230',
    color: 'from-primary to-accent',
    progress: 78,
    grade: 'B+',
    nextExam: 'Midterm 2',
    hoursThisWeek: 12,
  },
  {
    id: 's2',
    name: 'Linear Algebra',
    code: 'MATH 210',
    color: 'from-accent to-primary',
    progress: 64,
    grade: 'B',
    nextExam: 'Final',
    hoursThisWeek: 8,
  },
  {
    id: 's3',
    name: 'Microeconomics',
    code: 'ECON 101',
    color: 'from-primary to-accent',
    progress: 91,
    grade: 'A',
    nextExam: 'Quiz 3',
    hoursThisWeek: 5,
  },
  {
    id: 's4',
    name: 'Data Structures',
    code: 'CS 201',
    color: 'from-accent to-primary',
    progress: 55,
    grade: 'C+',
    nextExam: 'Midterm 1',
    hoursThisWeek: 10,
  },
];

export const studyTasks: StudyTask[] = [
  {
    id: 't1',
    title: 'Review carbonyl reactions',
    subject: 'Organic Chemistry',
    duration: 45,
    priority: 'high',
    done: false,
    type: 'review',
  },
  {
    id: 't2',
    title: 'Complete Problem Set 4',
    subject: 'Linear Algebra',
    duration: 60,
    priority: 'high',
    done: false,
    type: 'assignment',
  },
  {
    id: 't3',
    title: 'Watch lecture: Eigenvalues',
    subject: 'Linear Algebra',
    duration: 35,
    priority: 'medium',
    done: true,
    type: 'lecture',
  },
  {
    id: 't4',
    title: 'Take practice quiz — Supply & Demand',
    subject: 'Microeconomics',
    duration: 20,
    priority: 'low',
    done: false,
    type: 'quiz',
  },
  {
    id: 't5',
    title: 'Read Chapter 8: Binary Trees',
    subject: 'Data Structures',
    duration: 40,
    priority: 'high',
    done: false,
    type: 'reading',
  },
  {
    id: 't6',
    title: 'Summarize lecture 9 notes',
    subject: 'Organic Chemistry',
    duration: 25,
    priority: 'medium',
    done: true,
    type: 'summary',
  },
];

export const exams: ExamEvent[] = [
  {
    id: 'e1',
    title: 'Organic Chem Midterm 2',
    subject: 'CHEM 230',
    date: 'Oct 24',
    daysAway: 4,
    color: 'bg-primary',
  },
  {
    id: 'e2',
    title: 'Data Structures Midterm 1',
    subject: 'CS 201',
    date: 'Oct 26',
    daysAway: 6,
    color: 'bg-accent',
  },
  {
    id: 'e3',
    title: 'Microeconomics Quiz 3',
    subject: 'ECON 101',
    date: 'Oct 29',
    daysAway: 9,
    color: 'bg-primary',
  },
  {
    id: 'e4',
    title: 'Linear Algebra Final',
    subject: 'MATH 210',
    date: 'Nov 4',
    daysAway: 15,
    color: 'bg-accent',
  },
];

export const activities: Activity[] = [
  {
    id: 'a1',
    icon: 'quiz',
    text: 'Completed practice quiz in Microeconomics — 94%',
    time: '2h ago',
  },
  {
    id: 'a2',
    icon: 'summary',
    text: 'Generated summary for Linear Algebra lecture 9',
    time: '5h ago',
  },
  {
    id: 'a3',
    icon: 'plan',
    text: 'AI updated your study plan for the week',
    time: '8h ago',
  },
  {
    id: 'a4',
    icon: 'grade',
    text: 'Assignment 3 graded: A- in Organic Chemistry',
    time: '1d ago',
  },
  {
    id: 'a5',
    icon: 'streak',
    text: 'You hit a 12-day study streak. Keep it up!',
    time: '1d ago',
  },
];

export const recommendations: AIRecommendation[] = [
  {
    id: 'r1',
    icon: 'alert',
    title: 'Data Structures needs attention',
    detail:
      'You are 2 chapters behind and your predicted grade dropped to C+. I made a 3-day catch-up plan.',
    action: 'View plan',
  },
  {
    id: 'r2',
    icon: 'quiz',
    title: 'Quiz yourself before the midterm',
    detail:
      'Based on your weak spots in carbonyl reactions, a 15-question quiz could boost your midterm score.',
    action: 'Generate quiz',
  },
  {
    id: 'r3',
    icon: 'tip',
    title: 'Best time to study today',
    detail:
      'Your focus scores peak between 4–6 PM. Schedule your hardest task then for 2x retention.',
    action: 'Schedule it',
  },
];

export const notifications: Notification[] = [
  {
    id: 'n1',
    title: 'Exam in 4 days',
    detail: 'Organic Chemistry Midterm 2 — 8 chapters to review',
    time: '1h ago',
    read: false,
  },
  {
    id: 'n2',
    title: 'AI study plan ready',
    detail: 'Your weekly plan has been optimized for your exam schedule',
    time: '3h ago',
    read: false,
  },
  {
    id: 'n3',
    title: 'Study streak: 12 days',
    detail: 'You are 3 days away from your longest streak',
    time: '6h ago',
    read: true,
  },
  {
    id: 'n4',
    title: 'New lecture uploaded',
    detail: 'Linear Algebra — Eigenvalues is ready to summarize',
    time: '1d ago',
    read: true,
  },
];

export const weeklyProgress = [
  { day: 'Mon', hours: 3.5, focus: 78 },
  { day: 'Tue', hours: 4.2, focus: 85 },
  { day: 'Wed', hours: 2.8, focus: 65 },
  { day: 'Thu', hours: 5.1, focus: 92 },
  { day: 'Fri', hours: 3.9, focus: 81 },
  { day: 'Sat', hours: 6.2, focus: 95 },
  { day: 'Sun', hours: 4.5, focus: 88 },
];

export const gpaHistory = [
  { label: 'W1', value: 3.4 },
  { label: 'W2', value: 3.45 },
  { label: 'W3', value: 3.5 },
  { label: 'W4', value: 3.55 },
  { label: 'W5', value: 3.62 },
  { label: 'W6', value: 3.68 },
  { label: 'W7', value: 3.74 },
];

export const motivationQuotes = [
  {
    quote: 'The secret of getting ahead is getting started.',
    author: 'Mark Twain',
  },
  {
    quote: 'Success is the sum of small efforts repeated day in and day out.',
    author: 'Robert Collier',
  },
  {
    quote: 'You do not have to be great to start, but you have to start to be great.',
    author: 'Zig Ziglar',
  },
];

export const aiSuggestions = [
  'Summarize my last Organic Chemistry lecture',
  'Create a 3-day study plan for my midterm',
  'Generate a quiz on eigenvalues',
  'What should I study today?',
  'Predict my GPA for this semester',
  'Explain carbonyl reactions simply',
];

export const navSections = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', icon: 'LayoutDashboard', active: true },
      { label: 'Calendar', icon: 'Calendar' },
      { label: 'Subjects', icon: 'BookOpen' },
    ],
  },
  {
    title: 'Learning',
    items: [
      { label: 'Tasks', icon: 'CheckSquare', badge: '4' },
      { label: 'Quizzes', icon: 'HelpCircle' },
      { label: 'Summaries', icon: 'FileText' },
    ],
  },
  {
    title: 'Insights',
    items: [
      { label: 'Analytics', icon: 'BarChart3' },
      { label: 'GPA Tracker', icon: 'TrendingUp' },
    ],
  },
] as const;

export const student = {
  name: 'Alex Rivera',
  email: 'alex.rivera@university.edu',
  avatar:
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop',
  major: 'Pre-Med, Year 3',
  gpa: 3.74,
  streak: 12,
  productivity: 87,
  semester: 'Fall 2026',
};
