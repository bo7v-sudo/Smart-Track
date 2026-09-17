'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { WizardShell, type StepDef } from '@/components/onboarding/wizard-shell';
import {
  WelcomeStep,
  UniversityStep,
  FacultyStep,
  DepartmentStep,
  YearStep,
  GpaStep,
  SubjectsStep,
  StudyHoursStep,
  StudyTimeStep,
  LearningStyleStep,
  WeakSubjectsStep,
  ExamsStep,
  GoalsStep,
  AIProfileScreen,
} from '@/components/onboarding/wizard-steps';
import { RouteGuard } from '@/components/auth/route-guard';
import { useAuth } from '@/components/auth/auth-provider';
import { supabase } from '@/lib/supabase-client';
import {
  initialOnboardingData,
  generateAIProfile,
  type OnboardingData,
  type AIProfile,
} from '@/lib/onboarding';

const steps: StepDef[] = [
  { id: 1, title: 'Welcome', subtitle: 'Let\'s get to know you' },
  { id: 2, title: 'University', subtitle: 'Where are you studying?' },
  { id: 3, title: 'Faculty', subtitle: 'Which faculty are you in?' },
  { id: 4, title: 'Department', subtitle: 'What\'s your specific major?' },
  { id: 5, title: 'Year', subtitle: 'Where are you in your journey?' },
  { id: 6, title: 'GPA', subtitle: 'What\'s your current standing?' },
  { id: 7, title: 'Subjects', subtitle: 'What are you studying this semester?' },
  { id: 8, title: 'Study hours', subtitle: 'How much do you study weekly?' },
  { id: 9, title: 'Study time', subtitle: 'When do you focus best?' },
  { id: 10, title: 'Learning style', subtitle: 'How do you learn best?' },
  { id: 11, title: 'Weak subjects', subtitle: 'Where do you struggle?' },
  { id: 12, title: 'Exams', subtitle: 'What\'s coming up?' },
  { id: 13, title: 'Goals', subtitle: 'What do you want to achieve?' },
];

export default function OnboardingPage() {
  return (
    <RouteGuard require="student">
      <OnboardingWizard />
    </RouteGuard>
  );
}

function OnboardingWizard() {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();

  // If already onboarded, redirect to dashboard
  React.useEffect(() => {
    if (profile?.onboarding_completed) {
      router.replace('/dashboard');
    }
  }, [profile, router]);

  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState<OnboardingData>(initialOnboardingData);
  const [generating, setGenerating] = React.useState(false);
  const [aiProfile, setAiProfile] = React.useState<AIProfile | null>(null);
  const [showProfile, setShowProfile] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const update = React.useCallback((patch: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  // Validation per step
  const canProceed = React.useMemo(() => {
    switch (step) {
      case 0: return true; // welcome
      case 1: return !!data.university.trim();
      case 2: return !!data.faculty;
      case 3: return !!data.department.trim();
      case 4: return !!data.academic_year;
      case 5: return data.current_gpa !== null;
      case 6: return data.current_subjects.length > 0;
      case 7: return data.weekly_study_hours > 0;
      case 8: return !!data.preferred_study_time;
      case 9: return !!data.learning_style;
      case 10: return true; // weak subjects is optional
      case 11: return true; // exams is optional
      case 12: return true; // goals is optional
      default: return true;
    }
  }, [step, data]);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleFinish = async () => {
    setGenerating(true);
    // Simulate AI processing time for a premium feel
    const profile = generateAIProfile(data);
    await new Promise((r) => setTimeout(r, 2000));
    setAiProfile(profile);
    setGenerating(false);
    setShowProfile(true);
  };

  const handleEnterDashboard = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // Save onboarding data
      await supabase.from('onboarding_data').upsert({
        user_id: user.id,
        university: data.university,
        faculty: data.faculty,
        department: data.department,
        academic_year: data.academic_year,
        current_gpa: data.current_gpa,
        gpa_scale: data.gpa_scale,
        current_subjects: data.current_subjects,
        weekly_study_hours: data.weekly_study_hours,
        preferred_study_time: data.preferred_study_time || null,
        learning_style: data.learning_style || null,
        weak_subjects: data.weak_subjects,
        upcoming_exams: data.upcoming_exams,
        personal_goals: data.personal_goals,
        ai_profile: aiProfile,
      });

      // Mark onboarding as complete
      await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);

      await refreshProfile();
      router.push('/dashboard');
    } catch (err) {
      console.error('Failed to save onboarding:', err);
    }
    setSaving(false);
  };

  // Show AI profile screen after generation
  if (showProfile && aiProfile) {
    return (
      <AIProfileScreen
        profile={aiProfile}
        onEnter={handleEnterDashboard}
      />
    );
  }

  const firstName = (profile?.full_name || '').split(' ')[0];

  return (
    <WizardShell
      steps={steps}
      current={step}
      canProceed={canProceed}
      onNext={handleNext}
      onBack={handleBack}
      isLast={step === steps.length - 1}
      isGenerating={generating || saving}
      onFinish={handleFinish}
    >
      {step === 0 && <WelcomeStep name={firstName} />}
      {step === 1 && <UniversityStep data={data} update={update} />}
      {step === 2 && <FacultyStep data={data} update={update} />}
      {step === 3 && <DepartmentStep data={data} update={update} />}
      {step === 4 && <YearStep data={data} update={update} />}
      {step === 5 && <GpaStep data={data} update={update} />}
      {step === 6 && <SubjectsStep data={data} update={update} />}
      {step === 7 && <StudyHoursStep data={data} update={update} />}
      {step === 8 && <StudyTimeStep data={data} update={update} />}
      {step === 9 && <LearningStyleStep data={data} update={update} />}
      {step === 10 && <WeakSubjectsStep data={data} update={update} />}
      {step === 11 && <ExamsStep data={data} update={update} />}
      {step === 12 && <GoalsStep data={data} update={update} />}
    </WizardShell>
  );
}
