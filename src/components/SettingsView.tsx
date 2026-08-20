import React, { useState } from 'react';
import { Settings, Save, RefreshCw, Calendar, Clock, Check, Palette, Sparkles, Type } from 'lucide-react';
import { UserProfile } from '../types';
import { useTheme, THEMES, ThemeId } from '../context/ThemeContext';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: Partial<UserProfile>) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdateUser, onResetData }) => {
  const {
    currentTheme,
    setThemeId,
    fontStyle,
    setFontStyle,
    fontSize,
    setFontSize,
    fontStyles,
    fontSizes,
  } = useTheme();
  const [name, setName] = useState(user.name);
  const [startDate, setStartDate] = useState(user.startDate);
  const [dailyHours, setDailyHours] = useState(user.dailyStudyHours);
  const [studyDays, setStudyDays] = useState(user.studyDaysPerWeek);
  const [restDay, setRestDay] = useState(user.restDay);
  const [dsaLanguage, setDsaLanguage] = useState(user.dsaLanguage);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name,
      startDate,
      dailyStudyHours: Number(dailyHours),
      studyDaysPerWeek: Number(studyDays),
      restDay,
      dsaLanguage,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 text-pink-50">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-pink-300 mb-1">
          <Settings className="w-4 h-4 text-pink-400" />
          <span>Platform Configuration</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Bootcamp & User Settings
        </h2>
        <p className="text-xs text-pink-200/80 mt-1">
          Customize your daily study pace, rest schedule, programming languages, and start date.
        </p>
      </div>

      {/* Typography: Font Style & Font Size Customization Card */}
      <div
        className="p-6 rounded-3xl border shadow-md space-y-5"
        style={{
          backgroundColor: currentTheme.vars['--card-bg'],
          borderColor: currentTheme.vars['--card-border'],
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold" style={{ color: currentTheme.vars['--text-main'] }}>
            <Type className="w-4 h-4" style={{ color: currentTheme.vars['--text-accent'] }} />
            <span>Typography & Font Style Controls</span>
          </div>
          <span
            className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border"
            style={{
              backgroundColor: currentTheme.badgeBg,
              color: currentTheme.badgeText,
              borderColor: currentTheme.vars['--card-border'],
            }}
          >
            Live App Preview
          </span>
        </div>

        <p className="text-xs opacity-80" style={{ color: currentTheme.vars['--text-muted'] }}>
          Customize font typeface and font scale app-wide to enhance reading comfort and accessibility.
        </p>

        {/* Font Style Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold" style={{ color: currentTheme.vars['--text-main'] }}>
            1. Select Font Style (Typeface)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {fontStyles.map((f) => {
              const isSelected = fontStyle === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFontStyle(f.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-1 cursor-pointer ${
                    isSelected ? 'ring-2 scale-[1.02] shadow-md' : 'hover:scale-[1.01]'
                  }`}
                  style={{
                    backgroundColor: currentTheme.vars['--card-inner-bg'],
                    borderColor: isSelected ? currentTheme.vars['--primary'] : currentTheme.vars['--card-inner-border'],
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs" style={{ color: currentTheme.vars['--text-main'] }}>
                      {f.label}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5" style={{ color: currentTheme.vars['--primary'] }} />}
                  </div>
                  <span
                    className="text-xs opacity-80"
                    style={{ fontFamily: f.fontFamily, color: currentTheme.vars['--text-muted'] }}
                  >
                    {f.preview} — Aa Bb 123
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Size Selection */}
        <div className="space-y-2 pt-2 border-t" style={{ borderColor: currentTheme.vars['--card-inner-border'] }}>
          <label className="block text-xs font-bold" style={{ color: currentTheme.vars['--text-main'] }}>
            2. Select Font Size (Text Scale)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {fontSizes.map((s) => {
              const isSelected = fontSize === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setFontSize(s.id)}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                    isSelected ? 'ring-2 scale-[1.02] shadow-md' : 'hover:scale-[1.01]'
                  }`}
                  style={{
                    backgroundColor: currentTheme.vars['--card-inner-bg'],
                    borderColor: isSelected ? currentTheme.vars['--primary'] : currentTheme.vars['--card-inner-border'],
                  }}
                >
                  <span className="font-bold text-xs" style={{ color: currentTheme.vars['--text-main'] }}>
                    {s.label}
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                    style={{
                      backgroundColor: isSelected ? currentTheme.vars['--primary'] : currentTheme.badgeBg,
                      color: isSelected ? '#FFFFFF' : currentTheme.badgeText,
                      borderColor: currentTheme.vars['--card-inner-border'],
                    }}
                  >
                    {s.scale} ({s.badge})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Theme & Appearance Color Palette Picker Section */}
      <div
        className="p-6 rounded-3xl border shadow-md space-y-4"
        style={{
          backgroundColor: currentTheme.vars['--card-bg'],
          borderColor: currentTheme.vars['--card-border'],
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Palette className="w-4 h-4" style={{ color: currentTheme.vars['--text-accent'] }} />
            <span>App Color Theme</span>
          </div>
          <span
            className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border"
            style={{
              backgroundColor: currentTheme.badgeBg,
              color: currentTheme.badgeText,
              borderColor: currentTheme.vars['--card-border'],
            }}
          >
            Active: {currentTheme.name}
          </span>
        </div>

        <p className="text-xs text-pink-200/80">
          Choose from 12 curated themes to customize your learning canvas.
        </p>

        {/* 12 Color Swatches Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {THEMES.map((t) => {
            const isSelected = currentTheme.id === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setThemeId(t.id as ThemeId)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-pink-400 scale-[1.02] shadow-md'
                    : 'hover:scale-[1.01]'
                }`}
                style={{
                  backgroundColor: t.vars['--card-inner-bg'],
                  borderColor: isSelected ? t.vars['--primary'] : t.vars['--card-inner-border'],
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-md border border-white/20 flex items-center justify-center shrink-0"
                    style={{ backgroundColor: t.previewColor }}
                  >
                    <Sparkles className="w-2.5 h-2.5 text-white" />
                  </div>
                  <div
                    className="w-3.5 h-3.5 rounded-md"
                    style={{ backgroundColor: t.badgeBg }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className="font-bold text-xs"
                    style={{ color: t.vars['--text-main'] }}
                  >
                    {t.name}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-pink-400" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl p-6 border shadow-md space-y-5 text-xs text-pink-50"
        style={{
          backgroundColor: currentTheme.vars['--card-bg'],
          borderColor: currentTheme.vars['--card-border'],
        }}
      >
        {savedSuccess && (
          <div className="p-3 bg-emerald-950 text-emerald-300 border border-emerald-500/40 rounded-2xl font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        <div>
          <label className="block font-semibold text-pink-200 mb-1">Student Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-500"
            style={{
              backgroundColor: currentTheme.vars['--card-inner-bg'],
              borderColor: currentTheme.vars['--card-inner-border'],
              color: currentTheme.vars['--text-main'],
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-pink-200 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-pink-400" />
              Bootcamp Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-500"
              style={{
                backgroundColor: currentTheme.vars['--card-inner-bg'],
                borderColor: currentTheme.vars['--card-inner-border'],
                color: currentTheme.vars['--text-main'],
              }}
            />
          </div>

          <div>
            <label className="block font-semibold text-pink-200 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              Daily Study Hours
            </label>
            <select
              value={dailyHours}
              onChange={(e) => setDailyHours(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-500"
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-pink-200 mb-1">Study Days per Week</label>
            <select
              value={studyDays}
              onChange={(e) => setStudyDays(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-500"
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

          <div>
            <label className="block font-semibold text-pink-200 mb-1">Preferred Rest Day</label>
            <select
              value={restDay}
              onChange={(e) => setRestDay(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-500"
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

        <div>
          <label className="block font-semibold text-pink-200 mb-1">Preferred DSA Language</label>
          <select
            value={dsaLanguage}
            onChange={(e) => setDsaLanguage(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
            style={{
              backgroundColor: currentTheme.vars['--card-inner-bg'],
              borderColor: currentTheme.vars['--card-inner-border'],
              color: currentTheme.vars['--text-main'],
            }}
          >
            <option value="Python">Python (Default)</option>
            <option value="TypeScript">TypeScript</option>
            <option value="C++">C++</option>
            <option value="Java">Java</option>
          </select>
        </div>

        <div
          className="pt-4 flex items-center justify-between border-t"
          style={{ borderColor: currentTheme.vars['--card-inner-border'] }}
        >
          <button
            type="button"
            onClick={onResetData}
            className="px-4 py-2.5 bg-rose-950/60 border border-rose-500/40 text-rose-300 font-bold rounded-xl hover:bg-rose-900/60 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-initialize 180-Day Data</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 text-white font-bold rounded-xl shadow-md flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${currentTheme.vars['--primary-gradient-from']}, ${currentTheme.vars['--primary-gradient-to']})`,
            }}
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

