import React, { useState } from 'react';
import {
  Flame,
  CheckCircle2,
  Circle,
  PlayCircle,
  ExternalLink,
  Code2,
  Cpu,
  Binary,
  Lightbulb,
  Send,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Award,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BootcampDay, UserProfile, TaskStatus } from '../types';
import { useTheme } from '../context/ThemeContext';

interface DashboardViewProps {
  user: UserProfile;
  currentDay: BootcampDay;
  allDays: BootcampDay[];
  onSelectDay: (dayNum: number) => void;
  onUpdateTaskStatus: (
    dayNum: number,
    track: 'fullstack' | 'ai' | 'dsa',
    newStatus: TaskStatus,
    payload?: { repoUrl?: string; demoUrl?: string; notes?: string; code?: string; complexity?: string }
  ) => void;
  onOpenBloomChat: (initialMessage?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  currentDay,
  allDays,
  onSelectDay,
  onUpdateTaskStatus,
  onOpenBloomChat,
}) => {
  const { currentTheme } = useTheme();
  const [selectedTrackTab, setSelectedTrackTab] = useState<'all' | 'fullstack' | 'ai' | 'dsa'>('all');
  const [submissionModal, setSubmissionModal] = useState<{
    isOpen: boolean;
    track: 'fullstack' | 'ai' | 'dsa' | null;
  }>({ isOpen: false, track: null });

  const [repoUrl, setRepoUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [dsaCode, setDsaCode] = useState('');
  const [timeComplexity, setTimeComplexity] = useState('O(n)');
  const [spaceComplexity, setSpaceComplexity] = useState('O(1)');

  const [hintModal, setHintModal] = useState<{ isOpen: boolean; hintText: string; level: number; loading: boolean }>({
    isOpen: false,
    hintText: '',
    level: 1,
    loading: false,
  });

  const completedCount =
    (currentDay.fullstackTask.status === 'PASSED' ? 1 : 0) +
    (currentDay.aiTask.status === 'PASSED' ? 1 : 0) +
    (currentDay.dsaTask.status === 'PASSED' ? 1 : 0);

  const isAllDayComplete = completedCount === 3;

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F8C8DC', '#D8C4F1', '#A78BFA', '#F472B6'],
    });
  };

  const handleOpenSubmission = (track: 'fullstack' | 'ai' | 'dsa') => {
    setSubmissionModal({ isOpen: true, track });
    setRepoUrl('');
    setDemoUrl('');
    setNotes('');
    setDsaCode('');
  };

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionModal.track) return;

    onUpdateTaskStatus(currentDay.dayNumber, submissionModal.track, 'PASSED', {
      repoUrl,
      demoUrl,
      notes,
      code: dsaCode,
      complexity: `Time: ${timeComplexity}, Space: ${spaceComplexity}`,
    });

    setSubmissionModal({ isOpen: false, track: null });

    if (completedCount === 2) {
      triggerCelebration();
    }
  };

  const handleFetchHint = async (level: number) => {
    setHintModal({ ...hintModal, loading: true, level });
    try {
      const res = await fetch('/api/bloom/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemName: currentDay.dsaTask.problemName,
          hintLevel: level,
          studentAttempt: dsaCode || 'Attempting to solve using python',
        }),
      });
      const data = await res.json();
      setHintModal({
        isOpen: true,
        hintText: data.hint || currentDay.dsaTask.hints[level - 1] || 'Focus on hashing values to avoid nested loops.',
        level,
        loading: false,
      });
    } catch (err) {
      setHintModal({
        isOpen: true,
        hintText: currentDay.dsaTask.hints[level - 1] || 'Store previously seen elements in a hash map.',
        level,
        loading: false,
      });
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8" style={{ color: currentTheme.vars['--text-main'] }}>
      {/* Top Welcome Header */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl border shadow-lg"
        style={{
          backgroundColor: currentTheme.vars['--card-bg'],
          borderColor: currentTheme.vars['--card-border'],
        }}
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-bold mb-1" style={{ color: currentTheme.vars['--text-muted'] }}>
            <Sparkles className="w-4 h-4" style={{ color: currentTheme.vars['--text-accent'] }} />
            <span>DevBloom Bootcamp • Day {currentDay.dayNumber} of 180</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: currentTheme.vars['--text-main'] }}>
            Good morning, {user.name} 🌸
          </h2>
          <p className="text-xs opacity-80 mt-1" style={{ color: currentTheme.vars['--text-muted'] }}>
            Phase {currentDay.phaseId}: {currentDay.phaseTitle}
          </p>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex items-center gap-3">
          {/* Day Navigator */}
          <div
            className="flex items-center border rounded-2xl px-2 py-1 shadow-sm"
            style={{
              backgroundColor: currentTheme.vars['--card-inner-bg'],
              borderColor: currentTheme.vars['--card-inner-border'],
            }}
          >
            <button
              disabled={currentDay.dayNumber <= 1}
              onClick={() => onSelectDay(currentDay.dayNumber - 1)}
              className="p-1.5 hover:opacity-80 rounded-xl disabled:opacity-40 cursor-pointer"
              style={{ color: currentTheme.vars['--text-main'] }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold" style={{ color: currentTheme.vars['--text-main'] }}>
              Day {currentDay.dayNumber}
            </span>
            <button
              disabled={currentDay.dayNumber >= 180}
              onClick={() => onSelectDay(currentDay.dayNumber + 1)}
              className="p-1.5 hover:opacity-80 rounded-xl disabled:opacity-40 cursor-pointer"
              style={{ color: currentTheme.vars['--text-main'] }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Streak Flame */}
          <div className="flex items-center gap-2 px-3.5 py-2 bg-amber-500/15 border border-amber-500/30 rounded-2xl">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-amber-400">Streak</div>
              <div className="text-xs font-bold text-amber-200">{user.currentStreak} Days 🔥</div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Objectives Progress Card */}
      <div
        className="border rounded-3xl p-6 shadow-md space-y-4"
        style={{
          backgroundColor: currentTheme.vars['--card-bg'],
          borderColor: currentTheme.vars['--card-border'],
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5" style={{ color: currentTheme.vars['--text-accent'] }} />
            <h3 className="font-bold text-base" style={{ color: currentTheme.vars['--text-main'] }}>Today&apos;s Objectives</h3>
          </div>
          <span
            className="text-xs font-bold px-3 py-1 rounded-full border"
            style={{
              backgroundColor: currentTheme.badgeBg,
              color: currentTheme.badgeText,
              borderColor: currentTheme.vars['--card-inner-border'],
            }}
          >
            {completedCount} / 3 Tasks Completed
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 rounded-full overflow-hidden border" style={{ backgroundColor: currentTheme.vars['--card-inner-bg'], borderColor: currentTheme.vars['--card-inner-border'] }}>
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${(completedCount / 3) * 100}%`,
              background: `linear-gradient(to right, ${currentTheme.vars['--primary-gradient-from']}, ${currentTheme.vars['--primary-gradient-to']})`,
            }}
          />
        </div>

        {/* Quick summary checkmarks */}
        <div className="grid grid-cols-3 gap-3 pt-1">
          <div
            className="p-3 rounded-2xl border flex items-center justify-between text-xs font-semibold"
            style={{
              backgroundColor: currentDay.fullstackTask.status === 'PASSED' ? currentTheme.vars['--secondary-bg'] : currentTheme.vars['--card-inner-bg'],
              borderColor: currentDay.fullstackTask.status === 'PASSED' ? currentTheme.vars['--primary'] : currentTheme.vars['--card-inner-border'],
              color: currentTheme.vars['--text-main'],
            }}
          >
            <span className="flex items-center gap-1.5">🩷 Full-Stack</span>
            {currentDay.fullstackTask.status === 'PASSED' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Circle className="w-4 h-4 opacity-50" />
            )}
          </div>

          <div
            className="p-3 rounded-2xl border flex items-center justify-between text-xs font-semibold"
            style={{
              backgroundColor: currentDay.aiTask.status === 'PASSED' ? currentTheme.vars['--secondary-bg'] : currentTheme.vars['--card-inner-bg'],
              borderColor: currentDay.aiTask.status === 'PASSED' ? currentTheme.vars['--primary'] : currentTheme.vars['--card-inner-border'],
              color: currentTheme.vars['--text-main'],
            }}
          >
            <span className="flex items-center gap-1.5">💜 AI Engineering</span>
            {currentDay.aiTask.status === 'PASSED' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Circle className="w-4 h-4 opacity-50" />
            )}
          </div>

          <div
            className="p-3 rounded-2xl border flex items-center justify-between text-xs font-semibold"
            style={{
              backgroundColor: currentDay.dsaTask.status === 'PASSED' ? currentTheme.vars['--secondary-bg'] : currentTheme.vars['--card-inner-bg'],
              borderColor: currentDay.dsaTask.status === 'PASSED' ? currentTheme.vars['--primary'] : currentTheme.vars['--card-inner-border'],
              color: currentTheme.vars['--text-main'],
            }}
          >
            <span className="flex items-center gap-1.5">💗 LeetCode DSA</span>
            {currentDay.dsaTask.status === 'PASSED' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Circle className="w-4 h-4 opacity-50" />
            )}
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {isAllDayComplete && (
        <div
          className="p-6 rounded-3xl text-white shadow-xl flex items-center justify-between border"
          style={{
            background: `linear-gradient(to right, ${currentTheme.vars['--primary-gradient-from']}, ${currentTheme.vars['--primary-gradient-to']})`,
            borderColor: currentTheme.vars['--primary'],
          }}
        >
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              🌸 DAY {currentDay.dayNumber} COMPLETE! 🌸
            </h3>
            <p className="text-xs opacity-90 mt-1">
              All 3 daily tasks passed! Your streak is now {user.currentStreak} days strong. Keep building tomorrow.
            </p>
          </div>
          <button
            onClick={() => onSelectDay(currentDay.dayNumber + 1)}
            className="px-4 py-2.5 bg-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            style={{ color: currentTheme.vars['--primary-gradient-to'] }}
          >
            <span>Proceed to Day {currentDay.dayNumber + 1}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Track Tabs */}
      <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: currentTheme.vars['--card-inner-border'] }}>
        <button
          onClick={() => setSelectedTrackTab('all')}
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          style={{
            backgroundColor: selectedTrackTab === 'all' ? currentTheme.vars['--primary'] : 'transparent',
            color: selectedTrackTab === 'all' ? '#FFFFFF' : currentTheme.vars['--text-muted'],
          }}
        >
          All 3 Daily Tracks
        </button>
        <button
          onClick={() => setSelectedTrackTab('fullstack')}
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          style={{
            backgroundColor: selectedTrackTab === 'fullstack' ? currentTheme.vars['--primary'] : 'transparent',
            color: selectedTrackTab === 'fullstack' ? '#FFFFFF' : currentTheme.vars['--text-muted'],
          }}
        >
          🩷 Full-Stack
        </button>
        <button
          onClick={() => setSelectedTrackTab('ai')}
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          style={{
            backgroundColor: selectedTrackTab === 'ai' ? currentTheme.vars['--primary'] : 'transparent',
            color: selectedTrackTab === 'ai' ? '#FFFFFF' : currentTheme.vars['--text-muted'],
          }}
        >
          💜 AI Engineering
        </button>
        <button
          onClick={() => setSelectedTrackTab('dsa')}
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          style={{
            backgroundColor: selectedTrackTab === 'dsa' ? currentTheme.vars['--primary'] : 'transparent',
            color: selectedTrackTab === 'dsa' ? '#FFFFFF' : currentTheme.vars['--text-muted'],
          }}
        >
          💗 DSA / LeetCode
        </button>
      </div>

      {/* 3 CORE TRACK CARDS */}
      <div className="space-y-6">
        {/* TRACK 1: FULL-STACK DEVELOPMENT */}
        {(selectedTrackTab === 'all' || selectedTrackTab === 'fullstack') && (
          <div
            className="border-2 rounded-3xl p-6 shadow-md space-y-5 relative overflow-hidden"
            style={{
              backgroundColor: currentTheme.vars['--card-bg'],
              borderColor: currentTheme.vars['--card-border'],
            }}
          >
            <div className="flex items-start justify-between border-b pb-4" style={{ borderColor: currentTheme.vars['--card-inner-border'] }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor: currentTheme.vars['--card-inner-bg'],
                    color: currentTheme.vars['--text-accent'],
                  }}
                >
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: currentTheme.vars['--text-accent'] }}>
                    Track 1 — Full-Stack Development 🩷
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: currentTheme.vars['--text-main'] }}>
                    {currentDay.fullstackTask.topic}
                  </h3>
                </div>
              </div>

              <span
                className="px-3 py-1 rounded-full text-xs font-bold border"
                style={{
                  backgroundColor: currentDay.fullstackTask.status === 'PASSED' ? 'rgba(6, 78, 59, 0.6)' : currentTheme.vars['--card-inner-bg'],
                  color: currentDay.fullstackTask.status === 'PASSED' ? '#6EE7B7' : currentTheme.vars['--text-muted'],
                  borderColor: currentTheme.vars['--card-inner-border'],
                }}
              >
                {currentDay.fullstackTask.status}
              </span>
            </div>

            {/* Video recommendation */}
            <div
              className="border rounded-2xl p-4 space-y-2"
              style={{
                backgroundColor: currentTheme.vars['--card-inner-bg'],
                borderColor: currentTheme.vars['--card-inner-border'],
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: currentTheme.vars['--text-accent'] }}>
                  <PlayCircle className="w-4 h-4" />
                  Recommended Video
                </span>
                <span
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: currentTheme.vars['--secondary-bg'],
                    borderColor: currentTheme.vars['--card-inner-border'],
                    color: currentTheme.vars['--text-main'],
                  }}
                >
                  {currentDay.fullstackTask.video.duration}
                </span>
              </div>
              <h4 className="font-bold text-sm" style={{ color: currentTheme.vars['--text-main'] }}>
                {currentDay.fullstackTask.video.title}
              </h4>
              <p className="text-xs opacity-80" style={{ color: currentTheme.vars['--text-muted'] }}>
                Channel: <span className="font-semibold" style={{ color: currentTheme.vars['--text-main'] }}>{currentDay.fullstackTask.video.channel}</span> • {currentDay.fullstackTask.video.timeSection || 'Full Video'}
              </p>
              <p
                className="text-xs italic p-2 rounded-xl border"
                style={{
                  backgroundColor: currentTheme.vars['--secondary-bg'],
                  borderColor: currentTheme.vars['--card-border'],
                  color: currentTheme.vars['--text-main'],
                }}
              >
                Why selected: {currentDay.fullstackTask.video.whySelected}
              </p>
              <a
                href={currentDay.fullstackTask.video.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold underline pt-1"
                style={{ color: currentTheme.vars['--text-accent'] }}
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Learning steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div
                className="space-y-1.5 p-4 rounded-2xl border"
                style={{
                  backgroundColor: currentTheme.vars['--card-inner-bg'],
                  borderColor: currentTheme.vars['--card-inner-border'],
                }}
              >
                <h5 className="font-bold flex items-center gap-1.5" style={{ color: currentTheme.vars['--text-main'] }}>
                  <BookOpen className="w-4 h-4" style={{ color: currentTheme.vars['--text-accent'] }} />
                  Core Concepts to Learn:
                </h5>
                <ul className="list-disc list-inside space-y-1 opacity-80" style={{ color: currentTheme.vars['--text-muted'] }}>
                  {currentDay.fullstackTask.learnPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              <div
                className="space-y-1.5 p-4 rounded-2xl border"
                style={{
                  backgroundColor: currentTheme.vars['--card-inner-bg'],
                  borderColor: currentTheme.vars['--card-inner-border'],
                }}
              >
                <h5 className="font-bold flex items-center gap-1.5" style={{ color: currentTheme.vars['--text-main'] }}>
                  <Code2 className="w-4 h-4" style={{ color: currentTheme.badgeText }} />
                  Practice Exercises:
                </h5>
                <ul className="list-disc list-inside space-y-1 opacity-80" style={{ color: currentTheme.vars['--text-muted'] }}>
                  {currentDay.fullstackTask.practiceExercises.map((ex, i) => (
                    <li key={i}>{ex}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Build Challenge */}
            <div
              className="p-4 rounded-2xl border space-y-2"
              style={{
                backgroundColor: currentTheme.vars['--secondary-bg'],
                borderColor: currentTheme.vars['--card-border'],
              }}
            >
              <div className="font-bold text-xs uppercase tracking-wider" style={{ color: currentTheme.vars['--text-accent'] }}>
                💻 Build Challenge:
              </div>
              <p className="text-xs font-medium" style={{ color: currentTheme.vars['--text-main'] }}>
                {currentDay.fullstackTask.buildProjectBrief}
              </p>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => onOpenBloomChat(`Hi Bloom, I am working on Day ${currentDay.dayNumber} Full-Stack: ${currentDay.fullstackTask.topic}. Can you explain this concept or review my code strategy?`)}
                className="text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                style={{ color: currentTheme.vars['--text-accent'] }}
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask Bloom AI Mentor for help</span>
              </button>

              <button
                onClick={() => handleOpenSubmission('fullstack')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer text-white"
                style={{
                  backgroundColor: currentDay.fullstackTask.status === 'PASSED' ? '#059669' : currentTheme.vars['--primary'],
                }}
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {currentDay.fullstackTask.status === 'PASSED'
                    ? 'Update Project Submission'
                    : 'Submit Full-Stack Project'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* TRACK 2: AI / LLM / RAG / AGENTS */}
        {(selectedTrackTab === 'all' || selectedTrackTab === 'ai') && (
          <div
            className="border-2 rounded-3xl p-6 shadow-md space-y-5 relative overflow-hidden"
            style={{
              backgroundColor: currentTheme.vars['--card-bg'],
              borderColor: currentTheme.vars['--card-border'],
            }}
          >
            <div className="flex items-start justify-between border-b pb-4" style={{ borderColor: currentTheme.vars['--card-inner-border'] }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor: currentTheme.vars['--card-inner-bg'],
                    color: currentTheme.badgeText,
                  }}
                >
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: currentTheme.badgeText }}>
                    Track 2 — AI / LLM / RAG / Agents 💜
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: currentTheme.vars['--text-main'] }}>
                    {currentDay.aiTask.topic}
                  </h3>
                </div>
              </div>

              <span
                className="px-3 py-1 rounded-full text-xs font-bold border"
                style={{
                  backgroundColor: currentDay.aiTask.status === 'PASSED' ? 'rgba(6, 78, 59, 0.6)' : currentTheme.vars['--card-inner-bg'],
                  color: currentDay.aiTask.status === 'PASSED' ? '#6EE7B7' : currentTheme.badgeText,
                  borderColor: currentTheme.vars['--card-inner-border'],
                }}
              >
                {currentDay.aiTask.status}
              </span>
            </div>

            {/* Video recommendation */}
            <div
              className="border rounded-2xl p-4 space-y-2"
              style={{
                backgroundColor: currentTheme.vars['--card-inner-bg'],
                borderColor: currentTheme.vars['--card-inner-border'],
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: currentTheme.badgeText }}>
                  <PlayCircle className="w-4 h-4" />
                  Recommended Video
                </span>
                <span
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: currentTheme.vars['--secondary-bg'],
                    borderColor: currentTheme.vars['--card-inner-border'],
                    color: currentTheme.vars['--text-main'],
                  }}
                >
                  {currentDay.aiTask.video.duration}
                </span>
              </div>
              <h4 className="font-bold text-sm" style={{ color: currentTheme.vars['--text-main'] }}>
                {currentDay.aiTask.video.title}
              </h4>
              <p className="text-xs opacity-80" style={{ color: currentTheme.vars['--text-muted'] }}>
                Channel: <span className="font-semibold" style={{ color: currentTheme.vars['--text-main'] }}>{currentDay.aiTask.video.channel}</span> • {currentDay.aiTask.video.timeSection || 'Full Video'}
              </p>
              <p
                className="text-xs italic p-2 rounded-xl border"
                style={{
                  backgroundColor: currentTheme.vars['--secondary-bg'],
                  borderColor: currentTheme.vars['--card-border'],
                  color: currentTheme.vars['--text-main'],
                }}
              >
                Why selected: {currentDay.aiTask.video.whySelected}
              </p>
              <a
                href={currentDay.aiTask.video.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold underline pt-1"
                style={{ color: currentTheme.badgeText }}
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Learning steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div
                className="space-y-1.5 p-4 rounded-2xl border"
                style={{
                  backgroundColor: currentTheme.vars['--card-inner-bg'],
                  borderColor: currentTheme.vars['--card-inner-border'],
                }}
              >
                <h5 className="font-bold flex items-center gap-1.5" style={{ color: currentTheme.vars['--text-main'] }}>
                  <BookOpen className="w-4 h-4" style={{ color: currentTheme.badgeText }} />
                  Core Concepts to Learn:
                </h5>
                <ul className="list-disc list-inside space-y-1 opacity-80" style={{ color: currentTheme.vars['--text-muted'] }}>
                  {currentDay.aiTask.learnPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              <div
                className="space-y-1.5 p-4 rounded-2xl border"
                style={{
                  backgroundColor: currentTheme.vars['--card-inner-bg'],
                  borderColor: currentTheme.vars['--card-inner-border'],
                }}
              >
                <h5 className="font-bold flex items-center gap-1.5" style={{ color: currentTheme.vars['--text-main'] }}>
                  <Cpu className="w-4 h-4" style={{ color: currentTheme.vars['--text-accent'] }} />
                  Practice Exercises:
                </h5>
                <ul className="list-disc list-inside space-y-1 opacity-80" style={{ color: currentTheme.vars['--text-muted'] }}>
                  {currentDay.aiTask.practiceExercises.map((ex, i) => (
                    <li key={i}>{ex}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Build Challenge */}
            <div
              className="p-4 rounded-2xl border space-y-2"
              style={{
                backgroundColor: currentTheme.vars['--secondary-bg'],
                borderColor: currentTheme.vars['--card-border'],
              }}
            >
              <div className="font-bold text-xs uppercase tracking-wider" style={{ color: currentTheme.badgeText }}>
                💻 Build Challenge:
              </div>
              <p className="text-xs font-medium" style={{ color: currentTheme.vars['--text-main'] }}>
                {currentDay.aiTask.buildProjectBrief}
              </p>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => onOpenBloomChat(`Hi Bloom, I am working on Day ${currentDay.dayNumber} AI Track: ${currentDay.aiTask.topic}. Can you explain how this prompt/architecture works?`)}
                className="text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                style={{ color: currentTheme.badgeText }}
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask Bloom AI Mentor for help</span>
              </button>

              <button
                onClick={() => handleOpenSubmission('ai')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer text-white"
                style={{
                  backgroundColor: currentDay.aiTask.status === 'PASSED' ? '#059669' : currentTheme.vars['--primary'],
                }}
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {currentDay.aiTask.status === 'PASSED'
                    ? 'Update AI Project Submission'
                    : 'Submit AI Project'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* TRACK 3: DSA / LEETCODE */}
        {(selectedTrackTab === 'all' || selectedTrackTab === 'dsa') && (
          <div
            className="border-2 rounded-3xl p-6 shadow-md space-y-5 relative overflow-hidden"
            style={{
              backgroundColor: currentTheme.vars['--card-bg'],
              borderColor: currentTheme.vars['--card-border'],
            }}
          >
            <div className="flex items-start justify-between border-b pb-4" style={{ borderColor: currentTheme.vars['--card-inner-border'] }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor: currentTheme.vars['--card-inner-bg'],
                    color: currentTheme.vars['--text-accent'],
                  }}
                >
                  <Binary className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: currentTheme.vars['--text-accent'] }}>
                    Track 3 — DSA / LeetCode 💗
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: currentTheme.vars['--text-main'] }}>
                    {currentDay.dsaTask.problemName}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    currentDay.dsaTask.difficulty === 'Easy'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : currentDay.dsaTask.difficulty === 'Medium'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {currentDay.dsaTask.difficulty}
                </span>

                <span
                  className="px-3 py-1 rounded-full text-xs font-bold border"
                  style={{
                    backgroundColor: currentDay.dsaTask.status === 'PASSED' ? 'rgba(6, 78, 59, 0.6)' : currentTheme.vars['--card-inner-bg'],
                    color: currentDay.dsaTask.status === 'PASSED' ? '#6EE7B7' : currentTheme.vars['--text-accent'],
                    borderColor: currentTheme.vars['--card-inner-border'],
                  }}
                >
                  {currentDay.dsaTask.status}
                </span>
              </div>
            </div>

            {/* LeetCode Requirements Checklist */}
            <div
              className="border rounded-2xl p-4 space-y-2 text-xs"
              style={{
                backgroundColor: currentTheme.vars['--card-inner-bg'],
                borderColor: currentTheme.vars['--card-inner-border'],
              }}
            >
              <div className="font-bold uppercase tracking-wider" style={{ color: currentTheme.vars['--text-accent'] }}>
                Daily Requirements Checklist:
              </div>
              <ul className="space-y-1.5 opacity-80" style={{ color: currentTheme.vars['--text-muted'] }}>
                {currentDay.dsaTask.requirements.map((req, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Teacher Hint Escalation System */}
            <div
              className="border rounded-2xl p-4 space-y-3 text-xs"
              style={{
                backgroundColor: currentTheme.vars['--secondary-bg'],
                borderColor: currentTheme.vars['--card-border'],
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  Bloom Progressive Hint Ladder (Do not spoil solution!)
                </span>
                <span className="text-[11px] font-bold text-amber-200">
                  Level {hintModal.level} / 5
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleFetchHint(lvl)}
                    className="px-3 py-1.5 rounded-xl font-bold transition-all border cursor-pointer"
                    style={{
                      backgroundColor: hintModal.level === lvl && hintModal.isOpen ? '#F59E0B' : currentTheme.vars['--card-inner-bg'],
                      color: hintModal.level === lvl && hintModal.isOpen ? '#000000' : currentTheme.vars['--text-main'],
                      borderColor: currentTheme.vars['--card-inner-border'],
                    }}
                  >
                    Hint {lvl} {lvl === 5 ? '(Solution Outline)' : ''}
                  </button>
                ))}
              </div>

              {hintModal.isOpen && (
                <div
                  className="p-3 rounded-xl border font-mono text-[11px] leading-relaxed whitespace-pre-wrap"
                  style={{
                    backgroundColor: currentTheme.vars['--card-inner-bg'],
                    borderColor: currentTheme.vars['--card-inner-border'],
                    color: currentTheme.vars['--text-main'],
                  }}
                >
                  {hintModal.loading ? 'Bloom is analyzing your code attempt and preparing hint...' : hintModal.hintText}
                </div>
              )}
            </div>

            {/* Submit Code Action */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => onOpenBloomChat(`Hi Bloom! I'm solving LeetCode: ${currentDay.dsaTask.problemName}. Here is my Python logic: ${dsaCode || 'Can you check my time complexity?'}`)}
                className="text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                style={{ color: currentTheme.vars['--text-accent'] }}
              >
                <Sparkles className="w-4 h-4" />
                <span>Explain my code & complexity to Bloom</span>
              </button>

              <button
                onClick={() => handleOpenSubmission('dsa')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer text-white"
                style={{
                  backgroundColor: currentDay.dsaTask.status === 'PASSED' ? '#059669' : currentTheme.vars['--primary'],
                }}
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {currentDay.dsaTask.status === 'PASSED'
                    ? 'Update DSA Solution'
                    : 'Submit DSA Solution'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SUBMISSION MODAL */}
      {submissionModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="border rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs"
            style={{
              backgroundColor: currentTheme.vars['--card-bg'],
              borderColor: currentTheme.vars['--card-border'],
              color: currentTheme.vars['--text-main'],
            }}
          >
            <h3 className="text-lg font-bold" style={{ color: currentTheme.vars['--text-main'] }}>
              Submit Task — {submissionModal.track?.toUpperCase()} Track
            </h3>

            <form onSubmit={handleSubmitTask} className="space-y-3">
              {submissionModal.track !== 'dsa' ? (
                <>
                  <div>
                    <label className="block font-semibold mb-1" style={{ color: currentTheme.vars['--text-muted'] }}>GitHub Repository URL</label>
                    <input
                      type="url"
                      placeholder="https://github.com/username/project"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-500"
                      style={{
                        backgroundColor: currentTheme.vars['--card-inner-bg'],
                        borderColor: currentTheme.vars['--card-inner-border'],
                        color: currentTheme.vars['--text-main'],
                      }}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1" style={{ color: currentTheme.vars['--text-muted'] }}>Live Demo URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://my-app.vercel.app"
                      value={demoUrl}
                      onChange={(e) => setDemoUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-500"
                      style={{
                        backgroundColor: currentTheme.vars['--card-inner-bg'],
                        borderColor: currentTheme.vars['--card-inner-border'],
                        color: currentTheme.vars['--text-main'],
                      }}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1" style={{ color: currentTheme.vars['--text-muted'] }}>Project Notes & Explanation</label>
                    <textarea
                      rows={3}
                      placeholder="Explain how you handled async state, error handling, or API architecture..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-500"
                      style={{
                        backgroundColor: currentTheme.vars['--card-inner-bg'],
                        borderColor: currentTheme.vars['--card-inner-border'],
                        color: currentTheme.vars['--text-main'],
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block font-semibold mb-1" style={{ color: currentTheme.vars['--text-muted'] }}>Python Solution Code</label>
                    <textarea
                      rows={5}
                      placeholder="def twoSum(nums, target): ..."
                      value={dsaCode}
                      onChange={(e) => setDsaCode(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border font-mono text-xs focus:outline-none focus:ring-2 focus:ring-pink-500"
                      style={{
                        backgroundColor: currentTheme.vars['--card-inner-bg'],
                        borderColor: currentTheme.vars['--card-inner-border'],
                        color: currentTheme.vars['--text-main'],
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1" style={{ color: currentTheme.vars['--text-muted'] }}>Time Complexity</label>
                      <input
                        type="text"
                        value={timeComplexity}
                        onChange={(e) => setTimeComplexity(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl border"
                        style={{
                          backgroundColor: currentTheme.vars['--card-inner-bg'],
                          borderColor: currentTheme.vars['--card-inner-border'],
                          color: currentTheme.vars['--text-main'],
                        }}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1" style={{ color: currentTheme.vars['--text-muted'] }}>Space Complexity</label>
                      <input
                        type="text"
                        value={spaceComplexity}
                        onChange={(e) => setSpaceComplexity(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl border"
                        style={{
                          backgroundColor: currentTheme.vars['--card-inner-bg'],
                          borderColor: currentTheme.vars['--card-inner-border'],
                          color: currentTheme.vars['--text-main'],
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmissionModal({ isOpen: false, track: null })}
                  className="px-4 py-2 font-bold rounded-xl cursor-pointer"
                  style={{ color: currentTheme.vars['--text-muted'] }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white font-bold rounded-xl shadow-md cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${currentTheme.vars['--primary-gradient-from']}, ${currentTheme.vars['--primary-gradient-to']})`,
                  }}
                >
                  Confirm & Submit Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
