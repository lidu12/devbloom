import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { OnboardingModal } from './components/OnboardingModal';
import { DashboardView } from './components/DashboardView';
import { BootcampView } from './components/BootcampView';
import { CalendarView } from './components/CalendarView';
import { BloomTeacherView } from './components/BloomTeacherView';
import { ProjectsView } from './components/ProjectsView';
import { SkillTreeView } from './components/SkillTreeView';
import { ReviewsView } from './components/ReviewsView';
import { ResourcesView } from './components/ResourcesView';
import { SettingsView } from './components/SettingsView';
import { ThemePickerModal } from './components/ThemePickerModal';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AppState, UserProfile, BootcampDay, TaskStatus } from './types';
import { generateInitialDays } from './data/curriculumData';

function AppContent() {
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appState, setAppState] = useState<AppState | null>(null);
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [bloomInitialMsg, setBloomInitialMsg] = useState<string | undefined>(undefined);

  // Load app state from localStorage first, then fallback to server API
  useEffect(() => {
    const savedLocal = localStorage.getItem('devbloom_app_state');
    if (savedLocal) {
      try {
        const parsed = JSON.parse(savedLocal);
        if (parsed && parsed.user) {
          if (parsed.user.name === 'Lidiya' || !parsed.user.name) {
            parsed.user.isOnboarded = false;
            parsed.user.name = '';
          }
          setAppState(parsed);
          setSelectedDayNumber(parsed.user.currentDayNumber || 1);
          return;
        }
      } catch (e) {
        console.error('Error parsing local app state:', e);
      }
    }

    fetch('/api/state')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) {
          setAppState(data);
          setSelectedDayNumber(data.user.currentDayNumber || 1);
          localStorage.setItem('devbloom_app_state', JSON.stringify(data));
        }
      })
      .catch((err) => console.error('Error fetching state:', err));
  }, []);

  // Save app state helper to localStorage and backend
  const syncStateToServer = (newState: AppState) => {
    setAppState(newState);
    try {
      localStorage.setItem('devbloom_app_state', JSON.stringify(newState));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
    fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newState),
    }).catch((err) => console.error('Error saving state to server:', err));
  };

  if (!appState) {
    return (
      <div
        className="min-h-screen flex items-center justify-center font-sans text-xs font-semibold"
        style={{
          backgroundColor: currentTheme.vars['--app-bg-from'],
          color: currentTheme.vars['--text-muted'],
        }}
      >
        <div
          className="flex items-center gap-3 p-6 rounded-3xl border shadow-xl"
          style={{
            backgroundColor: currentTheme.vars['--card-bg'],
            borderColor: currentTheme.vars['--card-border'],
          }}
        >
          <div
            className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: currentTheme.vars['--primary'] }}
          />
          <span>Bootstrapping DevBloom Academy Environment...</span>
        </div>
      </div>
    );
  }

  const { user, days, projects, skills, resources, weeklyReviews, monthlyReviews, chatHistory, bloomMemory } = appState;

  // Onboarding Complete Handler
  const handleOnboardingComplete = (updatedUser: Partial<UserProfile>) => {
    const userName = updatedUser.name && updatedUser.name.trim() ? updatedUser.name.trim() : 'Student';
    const newFields: UserProfile = {
      ...user,
      ...updatedUser,
      name: userName,
      isOnboarded: true,
    };
    const updatedDays = updatedUser.startDate ? generateInitialDays(updatedUser.startDate) : days;
    const newState: AppState = {
      ...appState,
      user: newFields,
      days: updatedDays,
    };
    syncStateToServer(newState);
  };

  // Task Status Update Handler
  const handleUpdateTaskStatus = (
    dayNum: number,
    track: 'fullstack' | 'ai' | 'dsa',
    newStatus: TaskStatus,
    payload?: { repoUrl?: string; demoUrl?: string; notes?: string; code?: string; complexity?: string }
  ) => {
    const updatedDays = days.map((d) => {
      if (d.dayNumber === dayNum) {
        const newD = { ...d };
        if (track === 'fullstack') {
          newD.fullstackTask = {
            ...newD.fullstackTask,
            status: newStatus,
            submittedRepoUrl: payload?.repoUrl,
            submittedDemoUrl: payload?.demoUrl,
            notes: payload?.notes,
          };
        } else if (track === 'ai') {
          newD.aiTask = {
            ...newD.aiTask,
            status: newStatus,
            submittedRepoUrl: payload?.repoUrl,
            submittedDemoUrl: payload?.demoUrl,
            notes: payload?.notes,
          };
        } else if (track === 'dsa') {
          newD.dsaTask = {
            ...newD.dsaTask,
            status: newStatus,
            submittedCode: payload?.code,
            userExplanation: payload?.complexity,
          };
        }

        // Check if all 3 passed
        const allPassed =
          newD.fullstackTask.status === 'PASSED' &&
          newD.aiTask.status === 'PASSED' &&
          newD.dsaTask.status === 'PASSED';

        newD.isCompleted = allPassed;
        return newD;
      }
      return d;
    });

    // Check streak
    const targetDay = updatedDays.find((d) => d.dayNumber === dayNum);
    let newStreak = user.currentStreak;
    if (targetDay?.isCompleted && newStatus === 'PASSED') {
      newStreak += 1;
    }

    const updatedUser: UserProfile = {
      ...user,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, user.longestStreak),
      totalStudyDays: user.totalStudyDays + 1,
    };

    const newState: AppState = {
      ...appState,
      user: updatedUser,
      days: updatedDays,
    };

    syncStateToServer(newState);
  };

  // Send Message to Bloom AI Teacher
  const handleSendBloomMessage = async (text: string) => {
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user' as const,
      text,
      timestamp: new Date().toISOString(),
    };

    const updatedChat = [...chatHistory, userMsg];
    setAppState((prev) => (prev ? { ...prev, chatHistory: updatedChat } : null));

    try {
      const currentDayObj = days.find((d) => d.dayNumber === selectedDayNumber);
      const res = await fetch('/api/bloom/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: {
            dayNumber: selectedDayNumber,
            fullstackTopic: currentDayObj?.fullstackTask.topic,
            aiTopic: currentDayObj?.aiTask.topic,
            dsaProblem: currentDayObj?.dsaTask.problemName,
          },
        }),
      });

      const data = await res.json();
      const bloomMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bloom' as const,
        text: data.reply || "Let's analyze this step by step together!",
        timestamp: new Date().toISOString(),
      };

      const finalChat = [...updatedChat, bloomMsg];
      syncStateToServer({ ...appState, chatHistory: finalChat });
    } catch (err) {
      console.error('Error talking to Bloom:', err);
    }
  };

  const handleOpenBloomChatWithPrompt = (msg?: string) => {
    if (msg) setBloomInitialMsg(msg);
    setActiveTab('bloom');
  };

  // Project Submission Update
  const handleUpdateProjectSubmission = (
    projectId: string,
    payload: { githubUrl: string; demoUrl: string; notes: string }
  ) => {
    const updatedProjects = projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          githubUrl: payload.githubUrl,
          demoUrl: payload.demoUrl,
          notes: payload.notes,
          status: 'PASSED' as TaskStatus,
        };
      }
      return p;
    });

    syncStateToServer({
      ...appState,
      projects: updatedProjects,
    });
  };

  // User Settings Update
  const handleUpdateUser = (updatedUser: Partial<UserProfile>) => {
    syncStateToServer({
      ...appState,
      user: { ...user, ...updatedUser },
    });
  };

  // Reset Data Handler
  const handleResetData = () => {
    localStorage.removeItem('devbloom_app_state');
    fetch('/api/state/reset', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        setAppState(data);
        setSelectedDayNumber(1);
        localStorage.setItem('devbloom_app_state', JSON.stringify(data));
      });
  };

  const currentDayObj = days.find((d) => d.dayNumber === selectedDayNumber) || days[0];

  return (
    <div
      className="min-h-screen font-sans flex antialiased transition-colors duration-300"
      style={{
        background: `linear-gradient(to bottom right, ${currentTheme.vars['--app-bg-from']}, ${currentTheme.vars['--app-bg-via']}, ${currentTheme.vars['--app-bg-to']})`,
        color: currentTheme.vars['--text-main'],
      }}
    >
      {/* Theme Picker Modal */}
      <ThemePickerModal />

      {/* Onboarding Modal if user hasn't finished setup */}
      {!user.isOnboarded && (
        <OnboardingModal user={user} onComplete={handleOnboardingComplete} />
      )}

      {/* Main Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto min-h-screen">
        {activeTab === 'dashboard' && (
          <DashboardView
            user={user}
            currentDay={currentDayObj}
            allDays={days}
            onSelectDay={setSelectedDayNumber}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onOpenBloomChat={handleOpenBloomChatWithPrompt}
          />
        )}

        {(activeTab === 'fullstack' || activeTab === 'ai' || activeTab === 'dsa') && (
          <DashboardView
            user={user}
            currentDay={currentDayObj}
            allDays={days}
            onSelectDay={setSelectedDayNumber}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onOpenBloomChat={handleOpenBloomChatWithPrompt}
          />
        )}

        {activeTab === 'bootcamp' && (
          <BootcampView
            days={days}
            onSelectDay={(dayNum) => {
              setSelectedDayNumber(dayNum);
              setActiveTab('dashboard');
            }}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            days={days}
            onSelectDay={(dayNum) => {
              setSelectedDayNumber(dayNum);
              setActiveTab('dashboard');
            }}
          />
        )}

        {activeTab === 'bloom' && (
          <BloomTeacherView
            user={user}
            chatHistory={chatHistory}
            bloomMemory={bloomMemory}
            onSendMessage={handleSendBloomMessage}
            initialMessage={bloomInitialMsg}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsView
            projects={projects}
            onUpdateProjectSubmission={handleUpdateProjectSubmission}
            onOpenBloomChat={handleOpenBloomChatWithPrompt}
          />
        )}

        {activeTab === 'skilltree' && <SkillTreeView skills={skills} />}

        {activeTab === 'reviews' && (
          <ReviewsView weeklyReviews={weeklyReviews} monthlyReviews={monthlyReviews} />
        )}

        {activeTab === 'resources' && <ResourcesView resources={resources} />}

        {activeTab === 'settings' && (
          <SettingsView
            user={user}
            onUpdateUser={handleUpdateUser}
            onResetData={handleResetData}
          />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

