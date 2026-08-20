import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Code2,
  Cpu,
  Binary,
  FolderGit2,
  GitFork,
  BarChart3,
  Bot,
  Library,
  Settings,
  Flame,
  Award,
  Sparkles,
  Palette,
  Type,
} from 'lucide-react';
import { UserProfile } from '../types';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user }) => {
  const { currentTheme, setIsPickerOpen, fontSize, setFontSize, fontSizes } = useTheme();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bootcamp', label: 'Bootcamp Roadmap', icon: BookOpen },
    { id: 'calendar', label: 'Calendar & Schedule', icon: Calendar },
    { id: 'fullstack', label: 'Full-Stack Track', icon: Code2, badge: '🩷' },
    { id: 'ai', label: 'AI Engineering Track', icon: Cpu, badge: '💜' },
    { id: 'dsa', label: 'DSA Track', icon: Binary, badge: '💗' },
    { id: 'projects', label: 'Projects & Capstone', icon: FolderGit2 },
    { id: 'skilltree', label: 'Skill Tree', icon: GitFork },
    { id: 'reviews', label: 'Reviews & Analytics', icon: BarChart3 },
    { id: 'bloom', label: 'Bloom — AI Teacher', icon: Bot, highlight: true },
    { id: 'resources', label: 'Resource Library', icon: Library },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className="w-64 border-r flex flex-col justify-between h-screen sticky top-0 z-30 select-none transition-colors duration-300"
      style={{
        backgroundColor: currentTheme.vars['--sidebar-bg'],
        borderColor: currentTheme.vars['--sidebar-border'],
      }}
    >
      <div>
        {/* Brand Header */}
        <div
          className="p-4 border-b flex items-center justify-between gap-2"
          style={{ borderColor: currentTheme.vars['--sidebar-border'] }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md text-white shrink-0"
              style={{
                background: `linear-gradient(to top right, ${currentTheme.vars['--primary-gradient-from']}, ${currentTheme.vars['--primary-gradient-to']})`,
              }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <h1
                className="font-bold text-base tracking-tight truncate flex items-center gap-1"
                style={{ color: currentTheme.vars['--text-main'] }}
              >
                DevBloom
                <span
                  className="text-[10px] font-bold px-1.5 py-0.2 rounded-full border shrink-0"
                  style={{
                    backgroundColor: currentTheme.badgeBg,
                    color: currentTheme.badgeText,
                    borderColor: currentTheme.vars['--card-border'],
                  }}
                >
                  Academy
                </span>
              </h1>
              <p
                className="text-[11px] font-medium truncate"
                style={{ color: currentTheme.vars['--text-muted'] }}
              >
                Bootcamp
              </p>
            </div>
          </div>

          {/* Quick Customization Buttons: Theme & Font Size */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Quick Font Size Toggle Button */}
            <button
              onClick={() => {
                const currentIndex = fontSizes.findIndex((s) => s.id === fontSize);
                const nextIndex = (currentIndex + 1) % fontSizes.length;
                setFontSize(fontSizes[nextIndex].id);
              }}
              title={`Font Size: ${fontSize.toUpperCase()} (Click to cycle size)`}
              className="p-1.5 rounded-xl border flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer text-xs font-bold"
              style={{
                backgroundColor: currentTheme.vars['--card-inner-bg'],
                borderColor: currentTheme.vars['--card-inner-border'],
                color: currentTheme.vars['--text-main'],
              }}
            >
              <Type className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase ml-0.5">{fontSize}</span>
            </button>

            {/* Theme Palette Quick Button */}
            <button
              onClick={() => setIsPickerOpen(true)}
              title="Theme & Font Inspector"
              className="p-2 rounded-xl border flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: currentTheme.vars['--card-inner-bg'],
                borderColor: currentTheme.vars['--card-inner-border'],
                color: currentTheme.vars['--text-accent'],
              }}
            >
              <Palette className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Theme Selector Banner Button */}
        <div className="mx-3 my-2.5">
          <button
            onClick={() => setIsPickerOpen(true)}
            className="w-full px-3 py-2 rounded-xl border flex items-center justify-between transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer group"
            style={{
              backgroundColor: currentTheme.vars['--card-inner-bg'],
              borderColor: currentTheme.vars['--primary'],
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs"
                style={{ backgroundColor: currentTheme.previewColor }}
              />
              <span
                className="text-xs font-bold"
                style={{ color: currentTheme.vars['--text-main'] }}
              >
                {currentTheme.name}
              </span>
            </div>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase"
              style={{
                backgroundColor: currentTheme.vars['--primary'],
                color: '#FFFFFF',
              }}
            >
              Switch Theme
            </span>
          </button>
        </div>

        {/* User Level Card */}
        <div
          className="mx-3 my-2 p-3 rounded-2xl border shadow-md space-y-1"
          style={{
            backgroundColor: currentTheme.vars['--card-bg'],
            borderColor: currentTheme.vars['--card-border'],
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <div
              className="flex items-center gap-1 text-xs font-semibold"
              style={{ color: currentTheme.vars['--text-main'] }}
            >
              <Award className="w-3.5 h-3.5" style={{ color: currentTheme.vars['--text-accent'] }} />
              <span>Level {user.currentLevel}</span>
            </div>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
              style={{
                backgroundColor: currentTheme.badgeBg,
                color: currentTheme.badgeText,
                borderColor: currentTheme.vars['--card-border'],
              }}
            >
              Day {user.currentDayNumber}/180
            </span>
          </div>
          <p
            className="text-xs font-medium truncate"
            style={{ color: currentTheme.vars['--text-muted'] }}
          >
            {user.levelTitle}
          </p>

          {/* Streak pill */}
          <div
            className="mt-2 flex items-center justify-between text-xs pt-1.5 border-t"
            style={{ borderColor: currentTheme.vars['--card-inner-border'] }}
          >
            <span
              className="font-medium flex items-center gap-1 text-[11px]"
              style={{ color: currentTheme.vars['--text-muted'] }}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Current Streak
            </span>
            <span className="font-bold text-amber-300 text-xs">{user.currentStreak} Days</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="px-2.5 space-y-0.5 overflow-y-auto max-h-[calc(100vh-295px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer"
                style={{
                  backgroundColor: isActive
                    ? currentTheme.vars['--primary']
                    : item.highlight
                    ? currentTheme.vars['--card-inner-bg']
                    : 'transparent',
                  color: isActive ? '#FFFFFF' : currentTheme.vars['--text-main'],
                  border: item.highlight && !isActive ? `1px solid ${currentTheme.vars['--card-border']}` : '1px solid transparent',
                }}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className="w-4 h-4"
                    style={{
                      color: isActive ? '#FFFFFF' : currentTheme.vars['--text-accent'],
                    }}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && <span className="text-sm">{item.badge}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Capstone Goal Footer */}
      <div
        className="p-3 m-2.5 rounded-2xl border text-xs space-y-1"
        style={{
          backgroundColor: currentTheme.vars['--card-inner-bg'],
          borderColor: currentTheme.vars['--card-inner-border'],
        }}
      >
        <div
          className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: currentTheme.vars['--text-muted'] }}
        >
          <span>Target Capstone</span>
          <span className="font-bold" style={{ color: currentTheme.vars['--text-accent'] }}>
            Phase 14
          </span>
        </div>
        <p
          className="font-bold text-xs leading-snug"
          style={{ color: currentTheme.vars['--text-main'] }}
        >
          Blockchain Intelligence & Investigation Agent
        </p>
      </div>
    </aside>
  );
};

