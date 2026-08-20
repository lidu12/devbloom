import React from 'react';
import { GitFork, CheckCircle2, Lock, Sparkles, Award } from 'lucide-react';
import { SkillNode } from '../types';
import { useTheme } from '../context/ThemeContext';

interface SkillTreeViewProps {
  skills: SkillNode[];
}

export const SkillTreeView: React.FC<SkillTreeViewProps> = ({ skills }) => {
  const { currentTheme } = useTheme();
  const categories = ['Full-Stack', 'AI Engineering', 'DSA', 'System Architecture'];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8" style={{ color: currentTheme.vars['--text-main'] }}>
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold mb-1" style={{ color: currentTheme.vars['--text-muted'] }}>
          <GitFork className="w-4 h-4" style={{ color: currentTheme.vars['--text-accent'] }} />
          <span>Knowledge & Skill DAG</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: currentTheme.vars['--text-main'] }}>
          Visual Software Engineering Skill Tree
        </h2>
        <p className="text-xs opacity-80 mt-1" style={{ color: currentTheme.vars['--text-muted'] }}>
          Master foundational skills to unlock downstream advanced AI Agent and full-stack capabilities.
        </p>
      </div>

      {/* Skill Categories Grid */}
      <div className="space-y-8">
        {categories.map((cat) => {
          const categorySkills = skills.filter((s) => s.category === cat);
          if (categorySkills.length === 0) return null;

          return (
            <div key={cat} className="space-y-4">
              <h3
                className="font-bold text-sm flex items-center gap-2 border-b pb-2"
                style={{
                  color: currentTheme.vars['--text-main'],
                  borderColor: currentTheme.vars['--card-inner-border'],
                }}
              >
                <span>
                  {cat === 'Full-Stack' ? '🩷' : cat === 'AI Engineering' ? '💜' : cat === 'DSA' ? '💗' : '🌟'} {cat} Progression
                </span>
                <span className="text-xs font-normal opacity-70" style={{ color: currentTheme.vars['--text-muted'] }}>
                  ({categorySkills.length} Nodes)
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((sk) => {
                  const isUnlocked = sk.status === 'UNLOCKED' || sk.status === 'MASTERED' || sk.status === 'IN_PROGRESS';
                  const isMastered = sk.status === 'MASTERED';

                  return (
                    <div
                      key={sk.id}
                      className={`p-5 rounded-3xl border transition-all ${
                        isMastered
                          ? 'bg-emerald-950/40 border-emerald-500/50 ring-1 ring-emerald-500/30 shadow-md'
                          : ''
                      }`}
                      style={
                        !isMastered
                          ? {
                              backgroundColor: isUnlocked
                                ? currentTheme.vars['--card-bg']
                                : currentTheme.vars['--card-inner-bg'],
                              borderColor: isUnlocked
                                ? currentTheme.vars['--card-border']
                                : currentTheme.vars['--card-inner-border'],
                              opacity: isUnlocked ? 1 : 0.6,
                            }
                          : {}
                      }
                    >
                      <div className="flex items-center justify-between text-xs font-bold mb-2">
                        <span style={{ color: currentTheme.vars['--text-accent'] }}>Phase {sk.phaseId}</span>
                        <div className="flex items-center gap-1">
                          {isMastered ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> MASTERED
                            </span>
                          ) : isUnlocked ? (
                            <span
                              className="px-2 py-0.5 rounded-full border text-[10px] font-bold"
                              style={{
                                backgroundColor: currentTheme.badgeBg,
                                color: currentTheme.badgeText,
                                borderColor: currentTheme.vars['--card-border'],
                              }}
                            >
                              UNLOCKED
                            </span>
                          ) : (
                            <span
                              className="px-2 py-0.5 rounded-full border text-[10px] font-bold flex items-center gap-1"
                              style={{
                                backgroundColor: currentTheme.vars['--card-inner-bg'],
                                borderColor: currentTheme.vars['--card-inner-border'],
                                color: currentTheme.vars['--text-muted'],
                              }}
                            >
                              <Lock className="w-3 h-3" /> LOCKED
                            </span>
                          )}
                        </div>
                      </div>

                      <h4 className="font-bold text-sm" style={{ color: currentTheme.vars['--text-main'] }}>{sk.name}</h4>
                      <p className="text-xs opacity-80 mt-1" style={{ color: currentTheme.vars['--text-muted'] }}>{sk.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
