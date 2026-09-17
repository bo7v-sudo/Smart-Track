export type StudyTime = 'morning' | 'afternoon' | 'evening' | 'night';
export type LearningStyle = 'visual' | 'auditory' | 'reading' | 'kinesthetic';

export type ExamEntry = {
  id: string;
  subject: string;
  date: string; // ISO date string YYYY-MM-DD
};

export type OnboardingData = {
  university: string;
  faculty: string;
  department: string;
  academic_year: string;
  current_gpa: number | null;
  gpa_scale: number;
  current_subjects: string[];
  weekly_study_hours: number;
  preferred_study_time: StudyTime | '';
  learning_style: LearningStyle | '';
  weak_subjects: string[];
  upcoming_exams: ExamEntry[];
  personal_goals: string;
};

export const initialOnboardingData: OnboardingData = {
  university: '',
  faculty: '',
  department: '',
  academic_year: '',
  current_gpa: null,
  gpa_scale: 4.0,
  current_subjects: [],
  weekly_study_hours: 15,
  preferred_study_time: '',
  learning_style: '',
  weak_subjects: [],
  upcoming_exams: [],
  personal_goals: '',
};

export const universities = [
  'Harvard University',
  'Stanford University',
  'MIT',
  'University of Cambridge',
  'University of Oxford',
  'UC Berkeley',
  'UCLA',
  'Georgia Tech',
  'NYU',
  'University of Edinburgh',
  'TU Munich',
  'University of Toronto',
  'ETH Zurich',
  'Imperial College London',
  'Other',
];

export const faculties = [
  'Engineering',
  'Science',
  'Medicine',
  'Business',
  'Law',
  'Arts & Humanities',
  'Social Sciences',
  'Computer Science',
  'Education',
  'Architecture',
];

export const academicYears = [
  'Year 1',
  'Year 2',
  'Year 3',
  'Year 4',
  'Year 5',
  'Master\'s',
  'PhD',
];

export const gpaScales = [4.0, 5.0, 10.0];

export const studyTimeOptions: { value: StudyTime; label: string; icon: string; desc: string }[] = [
  { value: 'morning', label: 'Morning', icon: 'sunrise', desc: '6 AM – 12 PM' },
  { value: 'afternoon', label: 'Afternoon', icon: 'sun', desc: '12 PM – 5 PM' },
  { value: 'evening', label: 'Evening', icon: 'sunset', desc: '5 PM – 9 PM' },
  { value: 'night', label: 'Night', icon: 'moon', desc: '9 PM – 2 AM' },
];

export const learningStyleOptions: { value: LearningStyle; label: string; icon: string; desc: string }[] = [
  { value: 'visual', label: 'Visual', icon: 'eye', desc: 'Diagrams, charts, color-coded notes' },
  { value: 'auditory', label: 'Auditory', icon: 'ear', desc: 'Lectures, discussions, audio' },
  { value: 'reading', label: 'Reading/Writing', icon: 'book', desc: 'Text, notes, articles' },
  { value: 'kinesthetic', label: 'Kinesthetic', icon: 'hand', desc: 'Hands-on, practice, labs' },
];

export const commonSubjects = [
  'Organic Chemistry',
  'Linear Algebra',
  'Calculus',
  'Microeconomics',
  'Macroeconomics',
  'Data Structures',
  'Algorithms',
  'Physics',
  'Biology',
  'Psychology',
  'Statistics',
  'Computer Science',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Law',
  'Anatomy',
  'Physiology',
  'Philosophy',
  'Sociology',
  'Political Science',
];

export type AIProfile = {
  strengths: string[];
  weakAreas: string[];
  suggestedWeeklyHours: number;
  studyStrategy: string;
  productivityScore: number;
  riskLevel: 'low' | 'moderate' | 'high';
  summary: string;
};

export function generateAIProfile(data: OnboardingData): AIProfile {
  const strengths: string[] = [];
  const weakAreas: string[] = [];
  let productivityScore = 70;
  let riskLevel: AIProfile['riskLevel'] = 'low';

  // GPA-based assessment
  if (data.current_gpa !== null) {
    const normalized = (data.current_gpa / data.gpa_scale) * 4.0;
    if (normalized >= 3.5) {
      strengths.push(`Strong academic standing (${data.current_gpa}/${data.gpa_scale} GPA)`);
      productivityScore += 10;
    } else if (normalized >= 3.0) {
      strengths.push(`Solid GPA with room to grow (${data.current_gpa}/${data.gpa_scale})`);
      productivityScore += 5;
    } else if (normalized < 2.5) {
      weakAreas.push(`GPA below target — needs focused improvement`);
      productivityScore -= 10;
      riskLevel = 'moderate';
    }
  }

  // Study hours analysis
  const hours = data.weekly_study_hours;
  const subjectCount = data.current_subjects.length || 1;
  const hoursPerSubject = hours / subjectCount;

  if (hoursPerSubject >= 5) {
    strengths.push(`Excellent study time allocation (${hoursPerSubject.toFixed(1)}h per subject)`);
    productivityScore += 8;
  } else if (hoursPerSubject < 2) {
    weakAreas.push(`Study hours spread thin — only ${hoursPerSubject.toFixed(1)}h per subject`);
    productivityScore -= 8;
    riskLevel = 'moderate';
  }

  // Weak subjects
  if (data.weak_subjects.length > 0) {
    weakAreas.push(...data.weak_subjects.slice(0, 4).map((s) => `${s} — needs extra attention`));
    if (data.weak_subjects.length >= 3) riskLevel = 'moderate';
  }

  // Upcoming exam pressure
  const examCount = data.upcoming_exams.length;
  if (examCount > 0) {
    const nextExam = data.upcoming_exams
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))[0];
    const daysAway = Math.ceil(
      (new Date(nextExam.date).getTime() - Date.now()) / 86400000,
    );
    if (daysAway <= 7 && daysAway >= 0) {
      weakAreas.push(`Upcoming exam in ${nextExam.subject} in ${daysAway} days — start prepping now`);
      if (daysAway <= 3) riskLevel = 'high';
    }
  }

  // Learning style strength
  if (data.learning_style) {
    const styleMap: Record<string, string> = {
      visual: 'Strong visual learner — diagrams and charts will boost retention',
      auditory: 'Auditory learner — lecture summaries and discussions are your edge',
      reading: 'Reading/writing learner — structured notes and articles work best',
      kinesthetic: 'Kinesthetic learner — practice problems and labs are your strength',
    };
    strengths.push(styleMap[data.learning_style] ?? 'Clear learning style identified');
  }

  // Study time alignment
  if (data.preferred_study_time) {
    const timeMap: Record<string, string> = {
      morning: 'Morning sessions align with peak cognitive performance',
      afternoon: 'Afternoon study fits well with lecture schedules',
      evening: 'Evening sessions offer quiet, focused study time',
      night: 'Night sessions work — ensure 7+ hours of sleep for retention',
    };
    strengths.push(timeMap[data.preferred_study_time] ?? 'Optimal study time identified');
  }

  // Subjects without identified weakness
  const strongSubjects = data.current_subjects.filter(
    (s) => !data.weak_subjects.includes(s),
  );
  if (strongSubjects.length > 0) {
    strengths.push(`Comfortable with ${strongSubjects.slice(0, 3).join(', ')}`);
  }

  // Suggested weekly hours
  let suggestedWeeklyHours = hours;
  if (data.weak_subjects.length > 0) {
    suggestedWeeklyHours = hours + data.weak_subjects.length * 2;
  }
  if (examCount > 2) {
    suggestedWeeklyHours += 3;
  }
  suggestedWeeklyHours = Math.min(suggestedWeeklyHours, 40);

  // Clamp productivity
  productivityScore = Math.max(35, Math.min(98, productivityScore));

  // Study strategy
  const strategies: string[] = [];
  strategies.push(
    `Study ${suggestedWeeklyHours} hours per week, allocating more time to your ${data.weak_subjects.length || 'challenging'} subject${data.weak_subjects.length === 1 ? '' : 's'}.`,
  );
  if (data.preferred_study_time === 'morning') {
    strategies.push('Tackle your hardest subject first thing in the morning when focus peaks.');
  } else if (data.preferred_study_time === 'night') {
    strategies.push('Use nights for review and practice — avoid learning new concepts late.');
  } else {
    strategies.push(`Schedule your hardest tasks during your ${data.preferred_study_time || 'peak'} hours.`);
  }
  if (data.learning_style === 'visual') {
    strategies.push('Convert lecture notes into mind maps and diagrams for faster recall.');
  } else if (data.learning_style === 'auditory') {
    strategies.push('Record yourself explaining concepts and listen back during commutes.');
  } else if (data.learning_style === 'reading') {
    strategies.push('Rewrite notes in your own words and create summary sheets.');
  } else {
    strategies.push('Use practice problems and flashcards to reinforce concepts actively.');
  }
  if (examCount > 0) {
    strategies.push('Start spaced repetition for exam material 2 weeks before each test.');
  }
  strategies.push('Take a 5-minute break every 25 minutes to maintain retention.');

  const studyStrategy = strategies.join(' ');

  const summary = `Based on your profile, you're a ${data.academic_year || 'university'} student${
    data.current_gpa !== null ? ` with a ${data.current_gpa}/${data.gpa_scale} GPA` : ''
  } studying ${data.current_subjects.length} subjects. ${
    weakAreas.length > 0
      ? `We've identified ${weakAreas.length} area${weakAreas.length === 1 ? '' : 's'} to focus on.`
      : 'You have a strong foundation to build on.'
  } Your AI study plan recommends ${suggestedWeeklyHours} hours of study per week, with a productivity score of ${productivityScore}.`;

  return {
    strengths: strengths.slice(0, 5),
    weakAreas: weakAreas.slice(0, 5),
    suggestedWeeklyHours,
    studyStrategy,
    productivityScore,
    riskLevel,
    summary,
  };
}
