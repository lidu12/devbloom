import React, { useState } from 'react';
import { Sparkles, Calendar, Clock, Award, Target, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';
import { useTheme } from '../context/ThemeContext';

interface OnboardingModalProps {
  user: UserProfile;
  onComplete: (updatedUser: Partial<UserProfile>) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ user, onComplete }) => {
  const { currentTheme } = useTheme();
  const [name, setName] = useState(user.name && user.name !== 'Lidiya' ? user.name : '');
  const [startDate, setStartDate] = useState(user.startDate || new Date().toISOString().split('T')[0]);
  const [dailyHours, setDailyHours] = useState(user.dailyStudyHours || 4);
  const [studyDays, setStudyDays] = useState(user.studyDaysPerWeek || 6);
  const [restDay, setRestDay] = useState(user.restDay || 'Sunday');
  const [dsaLanguage, setDsaLanguage] = useState(user.dsaLanguage || 'Python');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(startDate);
    const target = new Date(start.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    onComplete({
      name: name.trim() || 'Student',
      startDate,
      dailyStudyHours: Number(dailyHours),
      studyDaysPerWeek: Number(studyDays),
      restDay,
      dsaLanguage,
      targetCompletionDate: target,
      isOnboarded: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div
        className="border rounded-3xl max-w-xl w-full p-8 shadow-2xl relative overflow-hidden text-xs"
        style={{
          backgroundColor: currentTheme.vars['--card-bg'],
          borderColor: currentTheme.vars['--card-border'],
          color: currentTheme.vars['--text-main'],
        }}
      >
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl border flex items-center justify-center shadow-md"
              style={{
                backgroundColor: currentTheme.vars['--card-inner-bg'],
                borderColor: currentTheme.vars['--card-inner-border'],
                color: currentTheme.vars['--text-accent'],
              }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: currentTheme.vars['--text-main'] }}>
              Welcome to DevBloom Academy 🌸
            </h2>
          </div>

          <blockquote
            className="italic text-xs font-medium p-3 rounded-r-xl border-l-4 my-4"
            style={{
              backgroundColor: currentTheme.vars['--card-inner-bg'],
              borderColor: currentTheme.vars['--primary'],
              color: currentTheme.vars['--text-muted'],
            }}
          >
            &quot;You&apos;re not here to collect tutorials. You&apos;re here to become someone who can build.&quot;
          </blockquote>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Student Name */}
            <div>
              <label className="block font-semibold mb-1" style={{ color: currentTheme.vars['--text-muted'] }}>Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name (e.g. Alex or Lidiya)"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border font-medium focus:outline-none focus:ring-2 focus:ring-pink-500"
                style={{
                  backgroundColor: currentTheme.vars['--card-inner-bg'],
                  borderColor: currentTheme.vars['--card-inner-border'],
                  color: currentTheme.vars['--text-main'],
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Start Date */}
              <div>
                <label className="block font-semibold mb-1 flex items-center gap-1.5" style={{ color: currentTheme.vars['--text-muted'] }}>
                  <Calendar className="w-3.5 h-3.5" style={{ color: currentTheme.vars['--text-accent'] }} />
                  Bootcamp Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-500"
                  style={{
                    backgroundColor: currentTheme.vars['--card-inner-bg'],
                    borderColor: currentTheme.vars['--card-inner-border'],
                    color: currentTheme.vars['--text-main'],
                  }}
                />
              </div>

              {/* Daily Hours */}
              <div>
                <label className="block font-semibold mb-1 flex items-center gap-1.5" style={{ color: currentTheme.vars['--text-muted'] }}>
                  <Clock className="w-3.5 h-3.5" style={{ color: currentTheme.vars['--text-accent'] }} />
                  Daily Study Hours
                </label>
                <select
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-500"
                  style={{
                    backgroundColor: currentTheme.vars['--card-inner-bg'],
                    borderColor: currentTheme.vars['--card-inner-border'],
                    color: currentTheme.vars['--text-main'],
                  }}
                >
                  <option value={2}>2 Hours / Day</option>
                  <option value={4}>4 Hours / Day (Recommended)</option>
                  <option value={6}>6 Hours / Day (Intensive)</option>
                  <option value={8}>8 Hours / Day (Full-Time)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Study Days / Week */}
              <div>
                <label className="block font-semibold mb-1 flex items-center gap-1.5" style={{ color: currentTheme.vars['--text-muted'] }}>
                  <Award className="w-3.5 h-3.5" style={{ color: currentTheme.vars['--text-accent'] }} />
                  Study Days / Week
                </label>
                <select
                  value={studyDays}
                  onChange={(e) => setStudyDays(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-500"
                  style={{
                    backgroundColor: currentTheme.vars['--card-inner-bg'],
                    borderColor: currentTheme.vars['--card-inner-border'],
                    color: currentTheme.vars['--text-main'],
                  }}
                >
                  <option value={5}>5 Days / Week</option>
                  <option value={6}>6 Days / Week (Standard)</option>
                  <option value={7}>7 Days / Week (No rest days)</option>
                </select>
              </div>

              {/* Rest Day */}
              <div>
                <label className="block font-semibold mb-1 flex items-center gap-1.5" style={{ color: currentTheme.vars['--text-muted'] }}>
                  <Target className="w-3.5 h-3.5" style={{ color: currentTheme.vars['--text-accent'] }} />
                  Preferred Rest Day
                </label>
                <select
                  value={restDay}
                  onChange={(e) => setRestDay(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-500"
                  style={{
                    backgroundColor: currentTheme.vars['--card-inner-bg'],
                    borderColor: currentTheme.vars['--card-inner-border'],
                    color: currentTheme.vars['--text-main'],
                  }}
                >
                  <option value="Sunday">Sunday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Monday">Monday</option>
                  <option value="Friday">Friday</option>
                </select>
              </div>
            </div>

            {/* Language Preference */}
            <div>
              <label className="block font-semibold mb-1" style={{ color: currentTheme.vars['--text-muted'] }}>
                Preferred DSA Language
              </label>
              <select
                value={dsaLanguage}
                onChange={(e) => setDsaLanguage(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border font-medium focus:outline-none focus:ring-2 focus:ring-pink-500"
                style={{
                  backgroundColor: currentTheme.vars['--card-inner-bg'],
                  borderColor: currentTheme.vars['--card-inner-border'],
                  color: currentTheme.vars['--text-main'],
                }}
              >
                <option value="Python">Python (Recommended for DSA & AI)</option>
                <option value="TypeScript">TypeScript / JavaScript</option>
                <option value="C++">C++</option>
                <option value="Java">Java</option>
              </select>
            </div>

            {/* Action button */}
            <button
              type="submit"
              className="w-full mt-4 py-3 px-5 rounded-xl text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${currentTheme.vars['--primary-gradient-from']}, ${currentTheme.vars['--primary-gradient-to']})`,
              }}
            >
              <span>Initialize My 180-Day Bootcamp Calendar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
