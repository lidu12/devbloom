export type TrackType = 'fullstack' | 'ai' | 'dsa';

export type TaskStatus = 'LOCKED' | 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'PASSED';

export interface VideoRecommendation {
  title: string;
  channel: string;
  duration: string;
  url: string;
  timeSection?: string;
  whySelected: string;
}

export interface FullStackTask {
  id: string;
  day: number;
  topic: string;
  video: VideoRecommendation;
  learnPoints: string[];
  practiceExercises: string[];
  buildProjectBrief: string;
  status: TaskStatus;
  submittedRepoUrl?: string;
  submittedDemoUrl?: string;
  notes?: string;
  score?: number;
  reviewFeedback?: string;
}

export interface AITask {
  id: string;
  day: number;
  topic: string;
  video: VideoRecommendation;
  learnPoints: string[];
  practiceExercises: string[];
  buildProjectBrief: string;
  status: TaskStatus;
  submittedRepoUrl?: string;
  submittedDemoUrl?: string;
  notes?: string;
  score?: number;
  reviewFeedback?: string;
}

export interface LeetCodeTask {
  id: string;
  day: number;
  problemName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  requirements: string[];
  hints: string[]; // 5 levels of escalating hints
  solutionExplanation?: string;
  status: TaskStatus;
  submittedCode?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  userExplanation?: string;
  score?: number;
  reviewFeedback?: string;
}

export interface BootcampDay {
  dayNumber: number;
  dateStr: string; // YYYY-MM-DD
  isRestDay: boolean;
  phaseId: number;
  phaseTitle: string;
  fullstackTask: FullStackTask;
  aiTask: AITask;
  dsaTask: LeetCodeTask;
  isCompleted: boolean;
}

export interface UserProfile {
  name: string;
  currentLevel: number;
  levelTitle: string;
  startDate: string; // YYYY-MM-DD
  dailyStudyHours: number;
  studyDaysPerWeek: number; // e.g. 6
  restDay: string; // 'Sunday', 'Saturday', etc.
  targetCompletionDate: string;
  dsaLanguage: string; // 'Python' default
  currentDayNumber: number;
  currentStreak: number;
  longestStreak: number;
  totalStudyDays: number;
  isOnboarded: boolean;
}

export interface Phase {
  id: number;
  title: string;
  durationDays: number;
  description: string;
  fullstackFocus: string;
  aiFocus: string;
  dsaFocus: string;
  majorProjectTitle: string;
  levelNumber: number;
}

export interface Project {
  id: string;
  phaseId: number;
  title: string;
  difficultyRating: number; // 1-5 stars
  skills: string[];
  estimatedHours: number;
  brief: string;
  requirements: string[];
  technicalConstraints: string[];
  suggestedArchitecture: string;
  acceptanceCriteria: string[];
  bonusChallenges: string[];
  status: TaskStatus;
  githubUrl?: string;
  demoUrl?: string;
  notes?: string;
  score?: number;
  passVerdict?: boolean;
  reviewFeedback?: string;
  reviewedAt?: string;
}

export interface SkillNode {
  id: string;
  name: string;
  category: 'Full-Stack' | 'AI Engineering' | 'DSA' | 'System Architecture';
  phaseId: number;
  parentIds: string[];
  status: 'LOCKED' | 'IN_PROGRESS' | 'UNLOCKED' | 'MASTERED';
  description: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  type: 'Video' | 'Documentation' | 'Course' | 'Article' | 'Interactive';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  url: string;
  channelOrAuthor: string;
  relatedSkills: string[];
  description: string;
  category: 'Full-Stack' | 'AI Engineering' | 'DSA' | 'General CS';
}

export interface WeeklyReview {
  weekNumber: number;
  startDate: string;
  endDate: string;
  fullstackScore: number;
  aiScore: number;
  dsaCompletedCount: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  nextWeekFocus: string[];
  bloomSummary: string;
}

export interface MonthlyReview {
  monthNumber: number;
  studyDaysCount: number;
  totalDays: number;
  currentStreak: number;
  longestStreak: number;
  fullstackSkillsGained: number;
  aiSkillsGained: number;
  dsaProblemsSolved: number;
  projectsCompleted: number;
  weakestArea: string;
  strongestArea: string;
  bloomReport: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bloom';
  text: string;
  timestamp: string;
  codeSnippet?: string;
  isHint?: boolean;
}

export interface AppState {
  user: UserProfile;
  days: BootcampDay[];
  projects: Project[];
  skills: SkillNode[];
  resources: ResourceItem[];
  weeklyReviews: WeeklyReview[];
  monthlyReviews: MonthlyReview[];
  chatHistory: ChatMessage[];
  bloomMemory: {
    weakTopics: string[];
    strongTopics: string[];
    lastReviews: string[];
  };
}
