import React, { useState } from 'react';
import { Bot, Send, Sparkles, Lightbulb, Award, CheckCircle2, AlertCircle, Code, MessageSquare, History, RefreshCw } from 'lucide-react';
import { ChatMessage, UserProfile } from '../types';
import { useTheme } from '../context/ThemeContext';

interface BloomTeacherViewProps {
  user: UserProfile;
  chatHistory: ChatMessage[];
  bloomMemory: {
    weakTopics: string[];
    strongTopics: string[];
    lastReviews: string[];
  };
  onSendMessage: (text: string) => Promise<void>;
  initialMessage?: string;
}

export const BloomTeacherView: React.FC<BloomTeacherViewProps> = ({
  user,
  chatHistory,
  bloomMemory,
  onSendMessage,
  initialMessage,
}) => {
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'chat' | 'reviewer' | 'memory'>('chat');
  const [inputText, setInputText] = useState(initialMessage || '');
  const [isSending, setIsSending] = useState(false);

  // Reviewer form state
  const [projectTitle, setProjectTitle] = useState('Full-Stack Task Manager');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<any>(null);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const txt = inputText;
    setInputText('');
    setIsSending(true);

    try {
      await onSendMessage(txt);
    } finally {
      setIsSending(false);
    }
  };

  const handleRequestReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsReviewing(true);
    setReviewResult(null);

    try {
      const res = await fetch('/api/bloom/review-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle,
          githubUrl,
          demoUrl,
          notes,
          codeSnippet,
        }),
      });
      const data = await res.json();
      setReviewResult(data);
    } catch (err) {
      console.error('Review error:', err);
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6" style={{ color: currentTheme.vars['--text-main'] }}>
      {/* Header */}
      <div
        className="flex flex-col md:flex-row items-center justify-between p-6 rounded-3xl border shadow-md gap-4"
        style={{
          backgroundColor: currentTheme.vars['--card-bg'],
          borderColor: currentTheme.vars['--card-border'],
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl border flex items-center justify-center shadow-md shrink-0"
            style={{
              backgroundColor: currentTheme.vars['--card-inner-bg'],
              borderColor: currentTheme.vars['--card-inner-border'],
              color: currentTheme.vars['--text-accent'],
            }}
          >
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2" style={{ color: currentTheme.vars['--text-main'] }}>
              <span>Bloom — AI Engineering Teacher</span>
              <span
                className="text-xs border px-2.5 py-0.5 rounded-full font-bold"
                style={{
                  backgroundColor: currentTheme.badgeBg,
                  color: currentTheme.badgeText,
                  borderColor: currentTheme.vars['--card-inner-border'],
                }}
              >
                Senior Mentor
              </span>
            </h2>
            <p className="text-xs opacity-80 mt-0.5" style={{ color: currentTheme.vars['--text-muted'] }}>
              Demanding, supportive, and dedicated to turning you into an independent senior engineer.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div
          className="flex items-center gap-1.5 p-1.5 rounded-2xl border"
          style={{
            backgroundColor: currentTheme.vars['--card-inner-bg'],
            borderColor: currentTheme.vars['--card-inner-border'],
          }}
        >
          <button
            onClick={() => setActiveTab('chat')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            style={{
              backgroundColor: activeTab === 'chat' ? currentTheme.vars['--primary'] : 'transparent',
              color: activeTab === 'chat' ? '#FFFFFF' : currentTheme.vars['--text-muted'],
            }}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>AI Mentor Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('reviewer')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            style={{
              backgroundColor: activeTab === 'reviewer' ? currentTheme.vars['--primary'] : 'transparent',
              color: activeTab === 'reviewer' ? '#FFFFFF' : currentTheme.vars['--text-muted'],
            }}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Project Code Reviewer</span>
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            style={{
              backgroundColor: activeTab === 'memory' ? currentTheme.vars['--primary'] : 'transparent',
              color: activeTab === 'memory' ? '#FFFFFF' : currentTheme.vars['--text-muted'],
            }}
          >
            <History className="w-3.5 h-3.5" />
            <span>Bloom Memory Log</span>
          </button>
        </div>
      </div>

      {/* TAB 1: AI MENTOR CHAT */}
      {activeTab === 'chat' && (
        <div
          className="border rounded-3xl p-6 shadow-md flex flex-col h-[600px] justify-between"
          style={{
            backgroundColor: currentTheme.vars['--card-bg'],
            borderColor: currentTheme.vars['--card-border'],
          }}
        >
          {/* Chat Messages */}
          <div className="overflow-y-auto space-y-4 pr-2 flex-1">
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs max-w-3xl ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    backgroundColor: msg.sender === 'user' ? currentTheme.vars['--primary'] : currentTheme.vars['--card-inner-bg'],
                    color: msg.sender === 'user' ? '#FFFFFF' : currentTheme.vars['--text-accent'],
                    border: `1px solid ${currentTheme.vars['--card-inner-border']}`,
                  }}
                >
                  {msg.sender === 'user' ? 'L' : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className="p-4 rounded-2xl leading-relaxed whitespace-pre-wrap text-xs font-medium shadow-xs"
                  style={{
                    backgroundColor: msg.sender === 'user' ? currentTheme.vars['--secondary-bg'] : currentTheme.vars['--card-inner-bg'],
                    borderColor: currentTheme.vars['--card-inner-border'],
                    borderWidth: '1px',
                    color: currentTheme.vars['--text-main'],
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex items-center gap-2 text-xs font-medium italic p-2" style={{ color: currentTheme.vars['--text-muted'] }}>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ color: currentTheme.vars['--text-accent'] }} />
                <span>Bloom is composing pedagogical feedback...</span>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleChatSubmit}
            className="pt-4 border-t flex items-center gap-2"
            style={{ borderColor: currentTheme.vars['--card-inner-border'] }}
          >
            <input
              type="text"
              placeholder="Ask Bloom about JS Async, React useEffect, RAG, or ReAct Agent architecture..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-3 rounded-2xl border text-xs focus:outline-none focus:ring-2 focus:ring-pink-500"
              style={{
                backgroundColor: currentTheme.vars['--card-inner-bg'],
                borderColor: currentTheme.vars['--card-inner-border'],
                color: currentTheme.vars['--text-main'],
              }}
            />
            <button
              type="submit"
              disabled={isSending || !inputText.trim()}
              className="px-5 py-3 text-white font-bold text-xs rounded-2xl shadow-md disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${currentTheme.vars['--primary-gradient-from']}, ${currentTheme.vars['--primary-gradient-to']})`,
              }}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask Mentor</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: CODE & PROJECT REVIEWER */}
      {activeTab === 'reviewer' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submission Form */}
          <div
            className="border rounded-3xl p-6 shadow-md space-y-4 text-xs"
            style={{
              backgroundColor: currentTheme.vars['--card-bg'],
              borderColor: currentTheme.vars['--card-border'],
            }}
          >
            <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: currentTheme.vars['--text-main'] }}>
              <Code className="w-4 h-4" style={{ color: currentTheme.vars['--text-accent'] }} />
              <span>Submit Project for 9-Metric Engineering Review</span>
            </h3>

            <form onSubmit={handleRequestReview} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1" style={{ color: currentTheme.vars['--text-muted'] }}>
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-500"
                  style={{
                    backgroundColor: currentTheme.vars['--card-inner-bg'],
                    borderColor: currentTheme.vars['--card-inner-border'],
                    color: currentTheme.vars['--text-main'],
                  }}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1" style={{ color: currentTheme.vars['--text-muted'] }}>
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/lidiya/my-agent"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-500"
                  style={{
                    backgroundColor: currentTheme.vars['--card-inner-bg'],
                    borderColor: currentTheme.vars['--card-inner-border'],
                    color: currentTheme.vars['--text-main'],
                  }}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1" style={{ color: currentTheme.vars['--text-muted'] }}>
                  Code Snippet or Architecture Notes
                </label>
                <textarea
                  rows={6}
                  placeholder="Paste your key React component code, FastAPI router, or ReAct Agent loop..."
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border font-mono text-xs focus:outline-none focus:ring-2 focus:ring-pink-500"
                  style={{
                    backgroundColor: currentTheme.vars['--card-inner-bg'],
                    borderColor: currentTheme.vars['--card-inner-border'],
                    color: currentTheme.vars['--text-main'],
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isReviewing}
                className="w-full py-3 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${currentTheme.vars['--primary-gradient-from']}, ${currentTheme.vars['--primary-gradient-to']})`,
                }}
              >
                {isReviewing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Bloom is reviewing code & architecture...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Request Bloom Senior Code Review</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Review Results Card */}
          <div
            className="border rounded-3xl p-6 shadow-md space-y-4 text-xs"
            style={{
              backgroundColor: currentTheme.vars['--card-bg'],
              borderColor: currentTheme.vars['--card-border'],
            }}
          >
            <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: currentTheme.vars['--text-main'] }}>
              <Award className="w-4 h-4" style={{ color: currentTheme.vars['--text-accent'] }} />
              <span>Engineering Scorecard & Feedback</span>
            </h3>

            {reviewResult ? (
              <div className="space-y-4">
                {/* Score Header */}
                <div
                  className="flex items-center justify-between p-4 rounded-2xl border"
                  style={{
                    backgroundColor: currentTheme.vars['--card-inner-bg'],
                    borderColor: currentTheme.vars['--card-inner-border'],
                  }}
                >
                  <div>
                    <div className="text-[10px] font-bold uppercase" style={{ color: currentTheme.vars['--text-muted'] }}>
                      Overall Engineering Score
                    </div>
                    <div className="text-3xl font-extrabold" style={{ color: currentTheme.vars['--text-main'] }}>
                      {reviewResult.score} / 100
                    </div>
                  </div>

                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                      reviewResult.passVerdict
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {reviewResult.passVerdict ? 'PASSED ✓' : 'NEEDS IMPROVEMENT ⚠'}
                  </span>
                </div>

                {/* Feedback */}
                <div
                  className="p-4 rounded-2xl border leading-relaxed font-medium"
                  style={{
                    backgroundColor: currentTheme.vars['--card-inner-bg'],
                    borderColor: currentTheme.vars['--card-inner-border'],
                    color: currentTheme.vars['--text-main'],
                  }}
                >
                  {reviewResult.feedback}
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-1">
                    <span className="font-bold text-emerald-300">Strengths:</span>
                    <ul className="list-disc list-inside text-emerald-200/80 space-y-1">
                      {reviewResult.strengths?.map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl space-y-1">
                    <span className="font-bold text-rose-300">Areas for Improvement:</span>
                    <ul className="list-disc list-inside text-rose-200/80 space-y-1">
                      {reviewResult.weaknesses?.map((w: string, i: number) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {reviewResult.correctionTask && (
                  <div
                    className="p-3 rounded-xl font-medium border"
                    style={{
                      backgroundColor: currentTheme.vars['--secondary-bg'],
                      borderColor: currentTheme.vars['--card-border'],
                      color: currentTheme.vars['--text-main'],
                    }}
                  >
                    <span className="font-bold" style={{ color: currentTheme.vars['--text-accent'] }}>Correction Task:</span>{' '}
                    {reviewResult.correctionTask}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center space-y-2 opacity-70" style={{ color: currentTheme.vars['--text-muted'] }}>
                <Code className="w-8 h-8 mx-auto" style={{ color: currentTheme.vars['--text-accent'] }} />
                <p>Submit your project snippet on the left to receive a comprehensive 9-metric code review from Bloom.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: BLOOM MEMORY LOG */}
      {activeTab === 'memory' && (
        <div
          className="border rounded-3xl p-6 shadow-md space-y-6 text-xs"
          style={{
            backgroundColor: currentTheme.vars['--card-bg'],
            borderColor: currentTheme.vars['--card-border'],
          }}
        >
          <div>
            <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: currentTheme.vars['--text-main'] }}>
              <History className="w-4 h-4" style={{ color: currentTheme.vars['--text-accent'] }} />
              <span>Bloom Teacher Memory Log for {user.name}</span>
            </h3>
            <p className="mt-1 opacity-80" style={{ color: currentTheme.vars['--text-muted'] }}>
              Bloom tracks your learning weaknesses, strengths, and previous reviews across sessions to personalize daily tasks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Weak Topics */}
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-2">
              <h4 className="font-bold text-rose-300 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                Tracked Weakness & Review Targets:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-rose-200/80 font-medium">
                {bloomMemory.weakTopics.map((wt, i) => (
                  <li key={i}>{wt}</li>
                ))}
              </ul>
            </div>

            {/* Strong Topics */}
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
              <h4 className="font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Demonstrated Strengths & Mastery:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-emerald-200/80 font-medium">
                {bloomMemory.strongTopics.map((st, i) => (
                  <li key={i}>{st}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
