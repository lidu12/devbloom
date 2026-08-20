import React, { useState } from 'react';
import { Calendar as CalendarIcon, Download, Printer, CheckCircle2, Circle, Flame, ChevronLeft, ChevronRight, FileSpreadsheet, FileText } from 'lucide-react';
import { BootcampDay } from '../types';
import { useTheme } from '../context/ThemeContext';

interface CalendarViewProps {
  days: BootcampDay[];
  onSelectDay: (dayNum: number) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ days, onSelectDay }) => {
  const { currentTheme } = useTheme();
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'printable'>('month');

  // Download ICS Calendar
  const handleDownloadICS = () => {
    window.location.href = '/api/calendar/export?format=ics';
  };

  // Download CSV
  const handleDownloadCSV = () => {
    window.location.href = '/api/calendar/export?format=csv';
  };

  // Trigger browser print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8" style={{ color: currentTheme.vars['--text-main'] }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold mb-1" style={{ color: currentTheme.vars['--text-muted'] }}>
            <CalendarIcon className="w-4 h-4" style={{ color: currentTheme.vars['--text-accent'] }} />
            <span>Schedule & Export Engine</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: currentTheme.vars['--text-main'] }}>
            Bootcamp Calendar & Export
          </h2>
          <p className="text-xs opacity-80 mt-1" style={{ color: currentTheme.vars['--text-muted'] }}>
            Track daily completed tracks, rest days, and export to Google Calendar / Outlook / Apple Calendar.
          </p>
        </div>

        {/* Action Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadICS}
            className="px-4 py-2 text-white font-bold text-xs rounded-xl shadow-md hover:opacity-90 flex items-center gap-1.5 transition-all cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${currentTheme.vars['--primary-gradient-from']}, ${currentTheme.vars['--primary-gradient-to']})`,
            }}
          >
            <Download className="w-4 h-4" />
            <span>Export .ICS Calendar</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="px-3.5 py-2 border font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            style={{
              backgroundColor: currentTheme.vars['--card-inner-bg'],
              borderColor: currentTheme.vars['--card-inner-border'],
              color: currentTheme.vars['--text-main'],
            }}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 border font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            style={{
              backgroundColor: currentTheme.vars['--card-inner-bg'],
              borderColor: currentTheme.vars['--card-inner-border'],
              color: currentTheme.vars['--text-main'],
            }}
          >
            <Printer className="w-4 h-4" style={{ color: currentTheme.vars['--text-accent'] }} />
            <span>Print Schedule</span>
          </button>
        </div>
      </div>

      {/* View Mode Switches */}
      <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: currentTheme.vars['--card-inner-border'] }}>
        <button
          onClick={() => setViewMode('month')}
          className="px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          style={{
            backgroundColor: viewMode === 'month' ? currentTheme.vars['--primary'] : 'transparent',
            color: viewMode === 'month' ? '#FFFFFF' : currentTheme.vars['--text-muted'],
          }}
        >
          Monthly Grid View
        </button>

        <button
          onClick={() => setViewMode('week')}
          className="px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          style={{
            backgroundColor: viewMode === 'week' ? currentTheme.vars['--primary'] : 'transparent',
            color: viewMode === 'week' ? '#FFFFFF' : currentTheme.vars['--text-muted'],
          }}
        >
          Weekly Breakdown
        </button>

        <button
          onClick={() => setViewMode('printable')}
          className="px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          style={{
            backgroundColor: viewMode === 'printable' ? currentTheme.vars['--primary'] : 'transparent',
            color: viewMode === 'printable' ? '#FFFFFF' : currentTheme.vars['--text-muted'],
          }}
        >
          Printable Schedule Sheet
        </button>
      </div>

      {/* MONTHLY GRID VIEW */}
      {viewMode === 'month' && (
        <div
          className="border rounded-3xl p-6 shadow-md space-y-4"
          style={{
            backgroundColor: currentTheme.vars['--card-bg'],
            borderColor: currentTheme.vars['--card-border'],
          }}
        >
          <div
            className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase pb-2 border-b"
            style={{ color: currentTheme.vars['--text-muted'], borderColor: currentTheme.vars['--card-inner-border'] }}
          >
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.slice(0, 35).map((d) => {
              const completedTasksCount =
                (d.fullstackTask.status === 'PASSED' ? 1 : 0) +
                (d.aiTask.status === 'PASSED' ? 1 : 0) +
                (d.dsaTask.status === 'PASSED' ? 1 : 0);

              return (
                <div
                  key={d.dayNumber}
                  onClick={() => onSelectDay(d.dayNumber)}
                  className="p-3 rounded-2xl border min-h-[100px] cursor-pointer transition-all flex flex-col justify-between"
                  style={{
                    backgroundColor: d.isCompleted
                      ? currentTheme.vars['--secondary-bg']
                      : d.isRestDay
                      ? 'rgba(120, 53, 15, 0.3)'
                      : currentTheme.vars['--card-inner-bg'],
                    borderColor: d.isCompleted
                      ? currentTheme.vars['--primary']
                      : d.isRestDay
                      ? 'rgba(245, 158, 11, 0.4)'
                      : currentTheme.vars['--card-inner-border'],
                  }}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold" style={{ color: currentTheme.vars['--text-main'] }}>Day {d.dayNumber}</span>
                    <span className="text-[10px] opacity-70" style={{ color: currentTheme.vars['--text-muted'] }}>{d.dateStr.slice(5)}</span>
                  </div>

                  {/* Indicators */}
                  <div className="space-y-1 my-2 text-[10px] font-semibold">
                    {d.isRestDay ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 font-bold block text-center border border-amber-500/40">
                        REST DAY
                      </span>
                    ) : (
                      <>
                        <div className="flex items-center gap-1 truncate" style={{ color: currentTheme.vars['--text-muted'] }}>
                          <span>🩷</span> <span className="truncate">{d.fullstackTask.topic}</span>
                        </div>
                        <div className="flex items-center gap-1 truncate" style={{ color: currentTheme.badgeText }}>
                          <span>💜</span> <span className="truncate">{d.aiTask.topic}</span>
                        </div>
                        <div className="flex items-center gap-1 truncate" style={{ color: currentTheme.vars['--text-accent'] }}>
                          <span>💗</span> <span className="truncate">{d.dsaTask.problemName}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Completion Pill */}
                  <div className="text-[10px] font-bold text-right">
                    {completedTasksCount === 3 ? (
                      <span className="text-emerald-400 flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 3/3 Passed
                      </span>
                    ) : (
                      <span style={{ color: currentTheme.vars['--text-muted'] }}>{completedTasksCount}/3 Completed</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEKLY BREAKDOWN VIEW */}
      {viewMode === 'week' && (
        <div
          className="border rounded-3xl p-6 shadow-md overflow-x-auto"
          style={{
            backgroundColor: currentTheme.vars['--card-bg'],
            borderColor: currentTheme.vars['--card-border'],
          }}
        >
          <table className="w-full text-xs text-left">
            <thead>
              <tr
                className="border-b font-bold uppercase text-[11px]"
                style={{ color: currentTheme.vars['--text-accent'], borderColor: currentTheme.vars['--card-inner-border'] }}
              >
                <th className="py-3 px-3">Day</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">🩷 Full-Stack Topic</th>
                <th className="py-3 px-3">💜 AI Engineering Topic</th>
                <th className="py-3 px-3">💗 DSA LeetCode</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium" style={{ borderColor: currentTheme.vars['--card-inner-border'] }}>
              {days.slice(0, 14).map((d) => (
                <tr
                  key={d.dayNumber}
                  onClick={() => onSelectDay(d.dayNumber)}
                  className="hover:opacity-90 cursor-pointer"
                >
                  <td className="py-3 px-3 font-bold" style={{ color: currentTheme.vars['--text-accent'] }}>Day {d.dayNumber}</td>
                  <td className="py-3 px-3 opacity-80" style={{ color: currentTheme.vars['--text-muted'] }}>{d.dateStr}</td>
                  <td className="py-3 px-3 font-semibold" style={{ color: currentTheme.vars['--text-main'] }}>{d.fullstackTask.topic}</td>
                  <td className="py-3 px-3 font-semibold" style={{ color: currentTheme.vars['--text-main'] }}>{d.aiTask.topic}</td>
                  <td className="py-3 px-3 font-semibold" style={{ color: currentTheme.vars['--text-main'] }}>{d.dsaTask.problemName}</td>
                  <td className="py-3 px-3 text-right">
                    {d.isCompleted ? (
                      <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 font-bold rounded-full text-[10px] border border-emerald-500/40">
                        PASSED
                      </span>
                    ) : (
                      <span
                        className="px-2.5 py-1 font-semibold rounded-full text-[10px] border"
                        style={{
                          backgroundColor: currentTheme.vars['--card-inner-bg'],
                          borderColor: currentTheme.vars['--card-inner-border'],
                          color: currentTheme.vars['--text-muted'],
                        }}
                      >
                        IN PROGRESS
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PRINTABLE SCHEDULE VIEW */}
      {viewMode === 'printable' && (
        <div
          className="border rounded-3xl p-8 shadow-md space-y-6 text-xs font-sans print:p-0 print:border-none"
          style={{
            backgroundColor: currentTheme.vars['--card-bg'],
            borderColor: currentTheme.vars['--card-border'],
            color: currentTheme.vars['--text-main'],
          }}
        >
          <div className="border-b pb-4" style={{ borderColor: currentTheme.vars['--card-inner-border'] }}>
            <h1 className="text-xl font-bold" style={{ color: currentTheme.vars['--text-main'] }}>DevBloom Academy — 180-Day Software Engineering Schedule</h1>
            <p style={{ color: currentTheme.vars['--text-muted'] }}>Tracks: Full-Stack (🩷) | AI Engineering (💜) | DSA (💗)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {days.slice(0, 28).map((d) => (
              <div
                key={d.dayNumber}
                className="p-3 border rounded-xl space-y-1"
                style={{
                  backgroundColor: currentTheme.vars['--card-inner-bg'],
                  borderColor: currentTheme.vars['--card-inner-border'],
                }}
              >
                <div className="font-bold flex justify-between" style={{ color: currentTheme.vars['--text-main'] }}>
                  <span>Day {d.dayNumber} ({d.dateStr})</span>
                  <span className="text-amber-300">{d.isRestDay ? 'REST DAY' : ''}</span>
                </div>
                <div style={{ color: currentTheme.vars['--text-muted'] }}>🩷 FS: {d.fullstackTask.topic}</div>
                <div style={{ color: currentTheme.badgeText }}>💜 AI: {d.aiTask.topic}</div>
                <div style={{ color: currentTheme.vars['--text-accent'] }}>💗 DSA: {d.dsaTask.problemName}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
