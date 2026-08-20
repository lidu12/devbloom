import React, { useState } from 'react';
import { BookOpen, Search, Code2, Cpu, Binary, ChevronDown, ChevronUp, Lock, CheckCircle2 } from 'lucide-react';
import { BootcampDay, Phase } from '../types';
import { PHASES } from '../data/curriculumData';
import { useTheme } from '../context/ThemeContext';

interface BootcampViewProps {
  days: BootcampDay[];
  onSelectDay: (dayNum: number) => void;
}

export const BootcampView: React.FC<BootcampViewProps> = ({ days, onSelectDay }) => {
  const { currentTheme } = useTheme();
  const [selectedPhaseId, setSelectedPhaseId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const filteredDays = days.filter((d) => {
    const matchesPhase = selectedPhaseId === null || d.phaseId === selectedPhaseId;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      d.dayNumber.toString() === q ||
      d.fullstackTask.topic.toLowerCase().includes(q) ||
      d.aiTask.topic.toLowerCase().includes(q) ||
      d.dsaTask.problemName.toLowerCase().includes(q);
    return matchesPhase && matchesQuery;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8" style={{ color: currentTheme.vars['--text-main'] }}>
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold mb-1" style={{ color: currentTheme.vars['--text-muted'] }}>
          <BookOpen className="w-4 h-4" style={{ color: currentTheme.vars['--text-accent'] }} />
          <span>Curriculum Blueprint</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: currentTheme.vars['--text-main'] }}>
          180-Day Software Engineering Roadmap
        </h2>
        <p className="text-xs opacity-80 mt-1" style={{ color: currentTheme.vars['--text-muted'] }}>
          Structured progression from CS Student → Full-Stack Developer → AI Application Developer → RAG Engineer → AI Agent Specialist → Capstone Investigator.
        </p>
      </div>

      {/* Search & Phase Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3" style={{ color: currentTheme.vars['--text-muted'] }} />
          <input
            type="text"
            placeholder="Search topics (e.g. useEffect, FastAPI, RAG, Two Sum)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border text-xs focus:outline-none focus:ring-2 focus:ring-pink-500"
            style={{
              backgroundColor: currentTheme.vars['--card-inner-bg'],
              borderColor: currentTheme.vars['--card-inner-border'],
              color: currentTheme.vars['--text-main'],
            }}
          />
        </div>

        {/* Phase Filter Dropdown */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedPhaseId(null)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer"
            style={{
              backgroundColor: selectedPhaseId === null ? currentTheme.vars['--primary'] : currentTheme.vars['--card-inner-bg'],
              color: selectedPhaseId === null ? '#FFFFFF' : currentTheme.vars['--text-muted'],
              borderColor: currentTheme.vars['--card-inner-border'],
              borderWidth: '1px',
            }}
          >
            All 15 Phases
          </button>

          {PHASES.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPhaseId(p.id)}
              className="px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer"
              style={{
                backgroundColor: selectedPhaseId === p.id ? currentTheme.vars['--primary'] : currentTheme.vars['--card-inner-bg'],
                color: selectedPhaseId === p.id ? '#FFFFFF' : currentTheme.vars['--text-muted'],
                borderColor: currentTheme.vars['--card-inner-border'],
                borderWidth: '1px',
              }}
            >
              Phase {p.id}
            </button>
          ))}
        </div>
      </div>

      {/* Phase Overview List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PHASES.map((phase: Phase) => (
          <div
            key={phase.id}
            onClick={() => setSelectedPhaseId(selectedPhaseId === phase.id ? null : phase.id)}
            className="p-5 rounded-3xl border cursor-pointer transition-all"
            style={{
              backgroundColor: selectedPhaseId === phase.id
                ? currentTheme.vars['--secondary-bg']
                : currentTheme.vars['--card-bg'],
              borderColor: selectedPhaseId === phase.id
                ? currentTheme.vars['--primary']
                : currentTheme.vars['--card-border'],
            }}
          >
            <div className="flex items-center justify-between text-xs font-bold mb-1" style={{ color: currentTheme.vars['--text-accent'] }}>
              <span>PHASE {phase.id}</span>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full border"
                style={{
                  backgroundColor: currentTheme.vars['--card-inner-bg'],
                  borderColor: currentTheme.vars['--card-inner-border'],
                  color: currentTheme.vars['--text-muted'],
                }}
              >
                {phase.durationDays} Days
              </span>
            </div>
            <h3 className="font-bold text-sm" style={{ color: currentTheme.vars['--text-main'] }}>{phase.title}</h3>
            <p className="text-xs opacity-80 mt-1 line-clamp-2" style={{ color: currentTheme.vars['--text-muted'] }}>{phase.description}</p>
            <div
              className="mt-3 pt-3 border-t text-[11px] font-semibold flex items-center justify-between"
              style={{ borderColor: currentTheme.vars['--card-inner-border'], color: currentTheme.badgeText }}
            >
              <span>Capstone: {phase.majorProjectTitle}</span>
              <span style={{ color: currentTheme.vars['--text-accent'] }}>→</span>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Curriculum List */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold" style={{ color: currentTheme.vars['--text-main'] }}>
          Daily Learning Modules ({filteredDays.length} Days)
        </h3>

        <div className="space-y-3">
          {filteredDays.map((d) => {
            const isExpanded = expandedDay === d.dayNumber;
            const isDayPassed = d.isCompleted;

            return (
              <div
                key={d.dayNumber}
                className={`border rounded-2xl transition-all overflow-hidden ${
                  isDayPassed ? 'border-emerald-500/50 bg-emerald-950/20' : ''
                }`}
                style={
                  !isDayPassed
                    ? {
                        backgroundColor: currentTheme.vars['--card-bg'],
                        borderColor: currentTheme.vars['--card-border'],
                      }
                    : {}
                }
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedDay(isExpanded ? null : d.dayNumber)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:opacity-90"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-10 h-10 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: currentTheme.vars['--card-inner-bg'],
                        borderColor: currentTheme.vars['--card-inner-border'],
                        color: currentTheme.vars['--text-accent'],
                      }}
                    >
                      Day {d.dayNumber}
                    </span>

                    <div>
                      <div className="flex items-center gap-2 text-[11px] font-medium" style={{ color: currentTheme.vars['--text-muted'] }}>
                        <span>Phase {d.phaseId}</span>
                        <span>•</span>
                        <span>{d.dateStr}</span>
                        {d.isRestDay && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
                            REST DAY
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold flex items-center gap-2" style={{ color: currentTheme.vars['--text-main'] }}>
                        <span>🩷 {d.fullstackTask.topic}</span>
                        <span className="opacity-30">|</span>
                        <span>💜 {d.aiTask.topic}</span>
                        <span className="opacity-30">|</span>
                        <span>💗 {d.dsaTask.problemName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDay(d.dayNumber);
                      }}
                      className="px-3 py-1.5 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${currentTheme.vars['--primary-gradient-from']}, ${currentTheme.vars['--primary-gradient-to']})`,
                      }}
                    >
                      Open Day {d.dayNumber}
                    </button>

                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" style={{ color: currentTheme.vars['--text-accent'] }} />
                    ) : (
                      <ChevronDown className="w-5 h-5" style={{ color: currentTheme.vars['--text-accent'] }} />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div
                    className="p-5 border-t space-y-4 text-xs"
                    style={{
                      backgroundColor: currentTheme.vars['--card-inner-bg'],
                      borderColor: currentTheme.vars['--card-inner-border'],
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Full Stack Task */}
                      <div
                        className="p-4 rounded-2xl border space-y-2"
                        style={{
                          backgroundColor: currentTheme.vars['--card-bg'],
                          borderColor: currentTheme.vars['--card-border'],
                        }}
                      >
                        <div className="font-bold flex items-center gap-1.5" style={{ color: currentTheme.vars['--text-accent'] }}>
                          <Code2 className="w-4 h-4" />
                          🩷 Full-Stack
                        </div>
                        <h4 className="font-bold" style={{ color: currentTheme.vars['--text-main'] }}>{d.fullstackTask.topic}</h4>
                        <p style={{ color: currentTheme.vars['--text-muted'] }}>Video: {d.fullstackTask.video.title} ({d.fullstackTask.video.channel})</p>
                        <p
                          className="font-medium p-2 rounded-xl border"
                          style={{
                            backgroundColor: currentTheme.vars['--secondary-bg'],
                            borderColor: currentTheme.vars['--card-border'],
                            color: currentTheme.vars['--text-main'],
                          }}
                        >
                          Build: {d.fullstackTask.buildProjectBrief}
                        </p>
                      </div>

                      {/* AI Task */}
                      <div
                        className="p-4 rounded-2xl border space-y-2"
                        style={{
                          backgroundColor: currentTheme.vars['--card-bg'],
                          borderColor: currentTheme.vars['--card-border'],
                        }}
                      >
                        <div className="font-bold flex items-center gap-1.5" style={{ color: currentTheme.badgeText }}>
                          <Cpu className="w-4 h-4" />
                          💜 AI Engineering
                        </div>
                        <h4 className="font-bold" style={{ color: currentTheme.vars['--text-main'] }}>{d.aiTask.topic}</h4>
                        <p style={{ color: currentTheme.vars['--text-muted'] }}>Video: {d.aiTask.video.title} ({d.aiTask.video.channel})</p>
                        <p
                          className="font-medium p-2 rounded-xl border"
                          style={{
                            backgroundColor: currentTheme.vars['--secondary-bg'],
                            borderColor: currentTheme.vars['--card-border'],
                            color: currentTheme.vars['--text-main'],
                          }}
                        >
                          Build: {d.aiTask.buildProjectBrief}
                        </p>
                      </div>

                      {/* DSA Task */}
                      <div
                        className="p-4 rounded-2xl border space-y-2"
                        style={{
                          backgroundColor: currentTheme.vars['--card-bg'],
                          borderColor: currentTheme.vars['--card-border'],
                        }}
                      >
                        <div className="font-bold flex items-center gap-1.5" style={{ color: currentTheme.vars['--text-accent'] }}>
                          <Binary className="w-4 h-4" />
                          💗 LeetCode DSA
                        </div>
                        <h4 className="font-bold" style={{ color: currentTheme.vars['--text-main'] }}>{d.dsaTask.problemName}</h4>
                        <p style={{ color: currentTheme.vars['--text-muted'] }}>Difficulty: {d.dsaTask.difficulty} • Topic: {d.dsaTask.topic}</p>
                        <p
                          className="font-medium p-2 rounded-xl border"
                          style={{
                            backgroundColor: currentTheme.vars['--secondary-bg'],
                            borderColor: currentTheme.vars['--card-border'],
                            color: currentTheme.vars['--text-main'],
                          }}
                        >
                          Submit Python solution & complexity analysis.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
