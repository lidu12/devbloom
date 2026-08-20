import React, { useState } from 'react';
import { FolderGit2, Star, Clock, CheckCircle2, Send, ExternalLink, ShieldAlert, Sparkles, Layers } from 'lucide-react';
import { Project, TaskStatus } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ProjectsViewProps {
  projects: Project[];
  onUpdateProjectSubmission: (
    projectId: string,
    payload: { githubUrl: string; demoUrl: string; notes: string }
  ) => void;
  onOpenBloomChat: (msg: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onUpdateProjectSubmission,
  onOpenBloomChat,
}) => {
  const { currentTheme } = useTheme();
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0] || null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    onUpdateProjectSubmission(selectedProject.id, {
      githubUrl,
      demoUrl,
      notes,
    });

    setSubmitModalOpen(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8" style={{ color: currentTheme.vars['--text-main'] }}>
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold mb-1" style={{ color: currentTheme.vars['--text-muted'] }}>
          <FolderGit2 className="w-4 h-4" style={{ color: currentTheme.vars['--text-accent'] }} />
          <span>Practical Application Portfolio</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: currentTheme.vars['--text-main'] }}>
          Bootcamp Projects & Capstone
        </h2>
        <p className="text-xs opacity-80 mt-1" style={{ color: currentTheme.vars['--text-muted'] }}>
          From vanilla JS portfolio to the Phase 14 Blockchain Intelligence & Investigation Agent. Every project must be built, submitted, and reviewed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Project List */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm flex items-center justify-between" style={{ color: currentTheme.vars['--text-main'] }}>
            <span>Project Directory</span>
            <span className="text-xs font-medium" style={{ color: currentTheme.vars['--text-muted'] }}>{projects.length} Projects</span>
          </h3>

          <div className="space-y-2">
            {projects.map((proj) => {
              const isSelected = selectedProject?.id === proj.id;
              const isPassed = proj.status === 'PASSED';
              const isCapstone = proj.phaseId === 14;

              return (
                <div
                  key={proj.id}
                  onClick={() => setSelectedProject(proj)}
                  className="p-4 rounded-2xl border cursor-pointer transition-all"
                  style={{
                    backgroundColor: isSelected
                      ? currentTheme.vars['--secondary-bg']
                      : currentTheme.vars['--card-bg'],
                    borderColor: isSelected
                      ? currentTheme.vars['--primary']
                      : currentTheme.vars['--card-border'],
                    borderWidth: '1px',
                  }}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-xs" style={{ color: currentTheme.vars['--text-accent'] }}>
                      PHASE {proj.phaseId} {isCapstone ? '• CAPSTONE' : ''}
                    </span>

                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: proj.difficultyRating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <h4 className="font-bold text-xs" style={{ color: currentTheme.vars['--text-main'] }}>
                    {proj.title}
                  </h4>

                  <div
                    className="flex items-center justify-between mt-2 pt-2 border-t text-[10px]"
                    style={{ borderColor: currentTheme.vars['--card-inner-border'] }}
                  >
                    <span style={{ color: currentTheme.vars['--text-muted'] }}>
                      {proj.estimatedHours} Hours
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-full font-bold ${
                        isPassed
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : 'border'
                      }`}
                      style={
                        !isPassed
                          ? {
                              backgroundColor: currentTheme.vars['--card-inner-bg'],
                              borderColor: currentTheme.vars['--card-inner-border'],
                              color: currentTheme.vars['--text-muted'],
                            }
                          : {}
                      }
                    >
                      {proj.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Selected Project Details */}
        {selectedProject && (
          <div
            className="lg:col-span-2 border rounded-3xl p-6 shadow-md space-y-6 text-xs"
            style={{
              backgroundColor: currentTheme.vars['--card-bg'],
              borderColor: currentTheme.vars['--card-border'],
              color: currentTheme.vars['--text-main'],
            }}
          >
            {/* Title & Status */}
            <div
              className="flex items-start justify-between border-b pb-4"
              style={{ borderColor: currentTheme.vars['--card-inner-border'] }}
            >
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: currentTheme.vars['--text-accent'] }}>
                  <span>Phase {selectedProject.phaseId} Project</span>
                  {selectedProject.phaseId === 14 && (
                    <span
                      className="border px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                      style={{
                        backgroundColor: currentTheme.badgeBg,
                        color: currentTheme.badgeText,
                        borderColor: currentTheme.vars['--card-inner-border'],
                      }}
                    >
                      FINAL CAPSTONE
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold mt-1" style={{ color: currentTheme.vars['--text-main'] }}>
                  {selectedProject.title}
                </h3>
              </div>

              <button
                onClick={() => {
                  setGithubUrl(selectedProject.githubUrl || '');
                  setDemoUrl(selectedProject.demoUrl || '');
                  setNotes(selectedProject.notes || '');
                  setSubmitModalOpen(true);
                }}
                className="px-5 py-2.5 text-white font-bold rounded-xl shadow-md flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${currentTheme.vars['--primary-gradient-from']}, ${currentTheme.vars['--primary-gradient-to']})`,
                }}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Project</span>
              </button>
            </div>

            {/* Brief */}
            <div
              className="p-4 rounded-2xl border leading-relaxed font-medium"
              style={{
                backgroundColor: currentTheme.vars['--card-inner-bg'],
                borderColor: currentTheme.vars['--card-inner-border'],
                color: currentTheme.vars['--text-main'],
              }}
            >
              <span className="font-bold" style={{ color: currentTheme.vars['--text-accent'] }}>Project Goal & Brief:</span>{' '}
              {selectedProject.brief}
            </div>

            {/* Skills & Time */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold" style={{ color: currentTheme.vars['--text-muted'] }}>Skills Needed:</span>
              {selectedProject.skills.map((s, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 border rounded-xl font-semibold text-[11px]"
                  style={{
                    backgroundColor: currentTheme.vars['--card-inner-bg'],
                    borderColor: currentTheme.vars['--card-inner-border'],
                    color: currentTheme.vars['--text-main'],
                  }}
                >
                  {s}
                </span>
              ))}
            </div>

            {/* Requirements & Acceptance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="p-4 rounded-2xl border space-y-2"
                style={{
                  backgroundColor: currentTheme.vars['--card-inner-bg'],
                  borderColor: currentTheme.vars['--card-inner-border'],
                }}
              >
                <h4 className="font-bold flex items-center gap-1.5" style={{ color: currentTheme.vars['--text-main'] }}>
                  <CheckCircle2 className="w-4 h-4" style={{ color: currentTheme.vars['--text-accent'] }} />
                  Functional Requirements:
                </h4>
                <ul className="list-disc list-inside space-y-1 opacity-90" style={{ color: currentTheme.vars['--text-muted'] }}>
                  {selectedProject.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              <div
                className="p-4 rounded-2xl border space-y-2"
                style={{
                  backgroundColor: currentTheme.vars['--card-inner-bg'],
                  borderColor: currentTheme.vars['--card-inner-border'],
                }}
              >
                <h4 className="font-bold flex items-center gap-1.5" style={{ color: currentTheme.vars['--text-main'] }}>
                  <ShieldAlert className="w-4 h-4" style={{ color: currentTheme.vars['--text-accent'] }} />
                  Technical Constraints:
                </h4>
                <ul className="list-disc list-inside space-y-1 opacity-90" style={{ color: currentTheme.vars['--text-muted'] }}>
                  {selectedProject.technicalConstraints.map((tc, i) => (
                    <li key={i}>{tc}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Architecture & Criteria */}
            <div
              className="p-4 rounded-2xl border space-y-2"
              style={{
                backgroundColor: currentTheme.vars['--card-inner-bg'],
                borderColor: currentTheme.vars['--card-inner-border'],
              }}
            >
              <h4 className="font-bold flex items-center gap-1.5" style={{ color: currentTheme.vars['--text-main'] }}>
                <Layers className="w-4 h-4" style={{ color: currentTheme.vars['--text-accent'] }} />
                Suggested Architecture:
              </h4>
              <p style={{ color: currentTheme.vars['--text-muted'] }}>{selectedProject.suggestedArchitecture}</p>
            </div>

            {/* Previous Submission Status if any */}
            {selectedProject.githubUrl && (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2 text-emerald-200">
                <div className="font-bold text-xs uppercase tracking-wider text-emerald-300">
                  Submitted Project Details:
                </div>
                <p>GitHub: <a href={selectedProject.githubUrl} target="_blank" rel="noreferrer" className="underline font-semibold text-emerald-200">{selectedProject.githubUrl}</a></p>
                {selectedProject.demoUrl && <p>Demo: <a href={selectedProject.demoUrl} target="_blank" rel="noreferrer" className="underline font-semibold text-emerald-200">{selectedProject.demoUrl}</a></p>}
                {selectedProject.notes && <p>Notes: {selectedProject.notes}</p>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* SUBMISSION MODAL */}
      {submitModalOpen && selectedProject && (
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
              Submit Project — {selectedProject.title}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1" style={{ color: currentTheme.vars['--text-muted'] }}>
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/lidiya/blockchain-agent"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
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
                <label className="block font-semibold mb-1" style={{ color: currentTheme.vars['--text-muted'] }}>
                  Live Demo URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://blockchain-agent.run.app"
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
                <label className="block font-semibold mb-1" style={{ color: currentTheme.vars['--text-muted'] }}>
                  Architecture & Technical Notes
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your implementation of RAG vector search, FastAPI routers, or risk scoring engine..."
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

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(false)}
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
                  Confirm Submission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
