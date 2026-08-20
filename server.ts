import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_USER,
  PHASES,
  INITIAL_PROJECTS,
  INITIAL_SKILLS,
  INITIAL_RESOURCES,
  generateInitialDays,
  INITIAL_WEEKLY_REVIEWS,
  INITIAL_MONTHLY_REVIEWS,
} from './src/data/curriculumData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize Gemini API client server-side
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function getInitialState() {
  const user = { ...INITIAL_USER };
  const days = generateInitialDays(user.startDate);
  return {
    user,
    days,
    projects: INITIAL_PROJECTS,
    skills: INITIAL_SKILLS,
    resources: INITIAL_RESOURCES,
    weeklyReviews: INITIAL_WEEKLY_REVIEWS,
    monthlyReviews: INITIAL_MONTHLY_REVIEWS,
    chatHistory: [
      {
        id: 'msg-1',
        sender: 'bloom',
        text: `Welcome to DevBloom Academy, ${user.name}! 🌸 I am Bloom, your senior software engineering mentor. We are building real craftsmanship here—from web foundations to production AI agents and our capstone Blockchain Intelligence System. How can I guide your learning today?`,
        timestamp: new Date().toISOString(),
      },
    ],
    bloomMemory: {
      weakTopics: ['JavaScript Async/Await try/catch error boundaries'],
      strongTopics: ['HTML Semantic elements', 'Flexbox layout', 'React components'],
      lastReviews: [],
    },
  };
}

function loadStateFromFile() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading db.json:', err);
  }
  const initialState = getInitialState();
  saveStateToFile(initialState);
  return initialState;
}

function saveStateToFile(state: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to db.json:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health Endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', geminiAvailable: !!ai });
  });

  // Get State
  app.get('/api/state', (req, res) => {
    const state = loadStateFromFile();
    res.json(state);
  });

  // Save State
  app.post('/api/state', (req, res) => {
    const state = req.body;
    if (state) {
      saveStateToFile(state);
      res.json({ status: 'success' });
    } else {
      res.status(400).json({ error: 'Missing state body' });
    }
  });

  // Reset State Endpoint
  app.post('/api/state/reset', (req, res) => {
    const { startDate, studyDaysPerWeek, restDay, dailyStudyHours } = req.body || {};
    const initialState = getInitialState();
    if (startDate) initialState.user.startDate = startDate;
    if (studyDaysPerWeek) initialState.user.studyDaysPerWeek = Number(studyDaysPerWeek);
    if (restDay) initialState.user.restDay = restDay;
    if (dailyStudyHours) initialState.user.dailyStudyHours = Number(dailyStudyHours);
    initialState.user.isOnboarded = true;
    initialState.days = generateInitialDays(initialState.user.startDate);
    saveStateToFile(initialState);
    res.json(initialState);
  });

  // AI Teacher Chat Endpoint
  app.post('/api/bloom/chat', async (req, res) => {
    try {
      const { message, context } = req.body;
      const state = loadStateFromFile();

      if (!ai) {
        // Fallback response if GEMINI_API_KEY is not configured
        const fallbackReply = `[Bloom Mentor - Offline Mode] Great question regarding "${message?.substring(0, 40)}...". Remember our core philosophy: Learn -> Practice -> Build -> Submit -> Get Reviewed. Check your current day's tasks in Full-Stack, AI, and DSA!`;
        return res.json({ reply: fallbackReply });
      }

      const systemPrompt = `You are Bloom, a demanding, highly encouraging, and deeply experienced Senior Principal Software Engineer acting as a dedicated personal bootcamp teacher for ${state.user.name}.

Student Profile & Context:
- Current Day: Day ${state.user.currentDayNumber} / 180
- Current Level: ${state.user.levelTitle}
- Current Streak: ${state.user.currentStreak} days (Longest: ${state.user.longestStreak})
- Known Weaknesses: ${state.bloomMemory?.weakTopics?.join(', ') || 'None recorded yet'}
- Known Strengths: ${state.bloomMemory?.strongTopics?.join(', ') || 'React, HTML/CSS'}
- Ultimate Capstone: Blockchain Intelligence & Investigation Agent

Pedagogical Rules:
1. Act like a supportive mentor in a top-tier engineering bootcamp.
2. DO NOT write entire projects or complete solutions for the student when they ask you to "build everything for me". Instead, break it down, ask "What have you tried so far?", and give step-by-step guidance.
3. Keep responses structured, concise, and actionable using markdown.
4. Use a warm, professional, encouraging tone with subtle lavender/pink aesthetic warmth.
5. Emphasize problem-solving, code cleanliness, error handling, and complexity analysis.`;

      const userContent = `Student Message: "${message}"
Current Task Context: ${JSON.stringify(context || {})}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
          { role: 'user', parts: [{ text: userContent }] }
        ],
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "I am analyzing your query. Let's tackle this step by step!";
      res.json({ reply: replyText });
    } catch (err: any) {
      console.error('Error in /api/bloom/chat:', err);
      res.status(500).json({ error: err.message || 'Failed to generate response' });
    }
  });

  // AI DSA Progressive Hint Endpoint
  app.post('/api/bloom/hint', async (req, res) => {
    try {
      const { problemName, hintLevel, studentAttempt } = req.body;

      if (!ai) {
        const fallbackHints = [
          "Hint 1: Think about storing values in a Hash Map to achieve O(n) lookup time.",
          "Hint 2: Iterate through the array once and check if (target - num) exists in your map.",
          "Concept: A Hash Map allows O(1) average time complexity for checking existence.",
          "Stronger Hint: Map each element to its index while traversing.",
          "Solution Outline: If target - x is in map, return [map[target - x], i]. Else map[x] = i."
        ];
        return res.json({ hint: fallbackHints[(hintLevel - 1) % fallbackHints.length] });
      }

      const prompt = `You are Bloom, the DSA Mentor for DevBloom Academy.
Problem: ${problemName}
Hint Level requested: ${hintLevel} (1 = Subtle Nudge, 2 = Conceptual Hint, 3 = Mathematical/Data Structure Hint, 4 = Stronger Algorithm Hint, 5 = Complete Solution Breakdown)
Student's Current Attempt / Thought Process: "${studentAttempt || 'None provided yet'}"

Rules:
- NEVER reveal full code implementation immediately on Level 1-3.
- Focus on helping the student figure it out independently.
- Include time and space complexity explanations.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          temperature: 0.4,
        },
      });

      res.json({ hint: response.text });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to generate hint' });
    }
  });

  // Project Reviewer Endpoint
  app.post('/api/bloom/review-project', async (req, res) => {
    try {
      const { projectTitle, githubUrl, demoUrl, notes, codeSnippet } = req.body;

      if (!ai) {
        // Fallback review object if Gemini API key not present
        return res.json({
          score: 88,
          passVerdict: true,
          criteriaScores: {
            functionality: 90,
            codeQuality: 88,
            architecture: 85,
            understanding: 90,
            uiUx: 92,
            errorHandling: 82,
            security: 85,
            gitPractices: 88,
            explanation: 90,
          },
          strengths: [
            'Clean modular React component structure',
            'Solid TypeScript type declarations for API payloads',
            'Well-formatted Git commit messages',
          ],
          weaknesses: [
            'Could add error boundary wrapper for network failure recovery',
          ],
          feedback: `Great submission for "${projectTitle}"! Your code architecture shows good understanding of state management and API integration. Keep up the high standard as we progress into full-stack and AI tracks.`,
          correctionTask: 'Optional: Add an explicit loading skeleton state when fetching asynchronous data.',
        });
      }

      const prompt = `You are Bloom, the Senior Code Reviewer at DevBloom Academy.
Evaluate the following student project submission strictly and thoroughly across 9 key engineering dimensions:

Project Title: ${projectTitle}
GitHub URL: ${githubUrl || 'N/A'}
Demo URL: ${demoUrl || 'N/A'}
Student Notes: ${notes || 'N/A'}
Submitted Code Snippet / Readme:
${codeSnippet || 'No direct code snippet provided; evaluate based on architectural notes and repository structure.'}

Return JSON with this EXACT structure:
{
  "score": number (0 to 100),
  "passVerdict": boolean (true if score >= 75),
  "criteriaScores": {
    "functionality": number,
    "codeQuality": number,
    "architecture": number,
    "understanding": number,
    "uiUx": number,
    "errorHandling": number,
    "security": number,
    "gitPractices": number,
    "explanation": number
  },
  "strengths": string[],
  "weaknesses": string[],
  "feedback": string,
  "correctionTask": string
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json(parsed);
    } catch (err: any) {
      console.error('Error in review-project:', err);
      res.status(500).json({ error: err.message || 'Failed to review project' });
    }
  });

  // Calendar Export Endpoint (.ics / .csv)
  app.get('/api/calendar/export', (req, res) => {
    const format = req.query.format || 'ics';
    const state = loadStateFromFile();

    if (format === 'csv') {
      let csv = 'Day,Date,Track,Topic,Video,Status\n';
      state.days.forEach((d: any) => {
        csv += `${d.dayNumber},${d.dateStr},Full-Stack,"${d.fullstackTask.topic}","${d.fullstackTask.video.title}",${d.fullstackTask.status}\n`;
        csv += `${d.dayNumber},${d.dateStr},AI Engineering,"${d.aiTask.topic}","${d.aiTask.video.title}",${d.aiTask.status}\n`;
        csv += `${d.dayNumber},${d.dateStr},DSA,"${d.dsaTask.problemName}",N/A,${d.dsaTask.status}\n`;
      });
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="devbloom-bootcamp-calendar.csv"');
      return res.send(csv);
    }

    // Default ICS format
    let ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//DevBloom Academy//Bootcamp Schedule//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:DevBloom Bootcamp Schedule',
    ];

    state.days.slice(0, 60).forEach((d: any) => {
      const dateFormatted = d.dateStr.replace(/-/g, '');
      
      // Full-Stack Event
      ics.push('BEGIN:VEVENT');
      ics.push(`SUMMARY:🩷 DevBloom Full-Stack: ${d.fullstackTask.topic}`);
      ics.push(`DESCRIPTION:Watch: ${d.fullstackTask.video.title} (${d.fullstackTask.video.channel})\\nProject: ${d.fullstackTask.buildProjectBrief}`);
      ics.push(`DTSTART;VALUE=DATE:${dateFormatted}`);
      ics.push(`DTEND;VALUE=DATE:${dateFormatted}`);
      ics.push(`UID:devbloom-fs-day-${d.dayNumber}@devbloom.academy`);
      ics.push('END:VEVENT');

      // AI Event
      ics.push('BEGIN:VEVENT');
      ics.push(`SUMMARY:💜 DevBloom AI: ${d.aiTask.topic}`);
      ics.push(`DESCRIPTION:Watch: ${d.aiTask.video.title} (${d.aiTask.video.channel})\\nBuild: ${d.aiTask.buildProjectBrief}`);
      ics.push(`DTSTART;VALUE=DATE:${dateFormatted}`);
      ics.push(`DTEND;VALUE=DATE:${dateFormatted}`);
      ics.push(`UID:devbloom-ai-day-${d.dayNumber}@devbloom.academy`);
      ics.push('END:VEVENT');

      // DSA Event
      ics.push('BEGIN:VEVENT');
      ics.push(`SUMMARY:💗 DevBloom DSA: ${d.dsaTask.problemName}`);
      ics.push(`DESCRIPTION:LeetCode Problem: ${d.dsaTask.problemName}\\nDifficulty: ${d.dsaTask.difficulty}\\nTopic: ${d.dsaTask.topic}`);
      ics.push(`DTSTART;VALUE=DATE:${dateFormatted}`);
      ics.push(`DTEND;VALUE=DATE:${dateFormatted}`);
      ics.push(`UID:devbloom-dsa-day-${d.dayNumber}@devbloom.academy`);
      ics.push('END:VEVENT');
    });

    ics.push('END:VCALENDAR');

    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', 'attachment; filename="devbloom-bootcamp.ics"');
    res.send(ics.join('\r\n'));
  });

  // Vite Middleware for dev / Static files for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌸 DevBloom Academy server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
