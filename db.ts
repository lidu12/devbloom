import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'devbloom.sqlite');
const db = new Database(DB_PATH);

// Enable WAL mode for high performance and concurrency
db.pragma('journal_mode = WAL');

// Initialize Database SQL Schema
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      current_level INTEGER,
      level_title TEXT,
      start_date TEXT,
      daily_study_hours INTEGER,
      study_days_per_week INTEGER,
      rest_day TEXT,
      target_completion_date TEXT,
      dsa_language TEXT,
      current_day_number INTEGER,
      current_streak INTEGER,
      longest_streak INTEGER,
      total_study_days INTEGER,
      is_onboarded INTEGER
    );

    CREATE TABLE IF NOT EXISTS bootcamp_days (
      day_number INTEGER PRIMARY KEY,
      date_str TEXT,
      is_rest_day INTEGER,
      phase_id INTEGER,
      phase_title TEXT,
      is_completed INTEGER,
      fullstack_task TEXT,
      ai_task TEXT,
      dsa_task TEXT
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT,
      phase_id INTEGER,
      status TEXT,
      github_url TEXT,
      demo_url TEXT,
      notes TEXT,
      data_json TEXT
    );

    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      data_json TEXT
    );

    CREATE TABLE IF NOT EXISTS resources (
      id TEXT PRIMARY KEY,
      data_json TEXT
    );

    CREATE TABLE IF NOT EXISTS weekly_reviews (
      id TEXT PRIMARY KEY,
      data_json TEXT
    );

    CREATE TABLE IF NOT EXISTS monthly_reviews (
      id TEXT PRIMARY KEY,
      data_json TEXT
    );

    CREATE TABLE IF NOT EXISTS chat_history (
      id TEXT PRIMARY KEY,
      sender TEXT,
      text TEXT,
      timestamp TEXT
    );

    CREATE TABLE IF NOT EXISTS bloom_memory (
      id TEXT PRIMARY KEY,
      weak_topics TEXT,
      strong_topics TEXT,
      last_reviews TEXT
    );
  `);
}

// Function to load entire app state from SQL tables
export function loadStateFromSQL(): any | null {
  initDatabase();

  const userRow: any = db.prepare(`SELECT * FROM users WHERE id = 'current'`).get();
  if (!userRow) {
    return null; // Database not seeded yet
  }

  const user = {
    name: userRow.name || '',
    currentLevel: userRow.current_level,
    levelTitle: userRow.level_title,
    startDate: userRow.start_date,
    dailyStudyHours: userRow.daily_study_hours,
    studyDaysPerWeek: userRow.study_days_per_week,
    restDay: userRow.rest_day,
    targetCompletionDate: userRow.target_completion_date,
    dsaLanguage: userRow.dsa_language,
    currentDayNumber: userRow.current_day_number,
    currentStreak: userRow.current_streak,
    longestStreak: userRow.longest_streak,
    totalStudyDays: userRow.total_study_days,
    isOnboarded: Boolean(userRow.is_onboarded),
  };

  const dayRows: any[] = db.prepare(`SELECT * FROM bootcamp_days ORDER BY day_number ASC`).all();
  const days = dayRows.map((d) => ({
    dayNumber: d.day_number,
    dateStr: d.date_str,
    isRestDay: Boolean(d.is_rest_day),
    phaseId: d.phase_id,
    phaseTitle: d.phase_title,
    isCompleted: Boolean(d.is_completed),
    fullstackTask: JSON.parse(d.fullstack_task || '{}'),
    aiTask: JSON.parse(d.ai_task || '{}'),
    dsaTask: JSON.parse(d.dsa_task || '{}'),
  }));

  const projectRows: any[] = db.prepare(`SELECT * FROM projects`).all();
  const projects = projectRows.map((p) => {
    const base = JSON.parse(p.data_json || '{}');
    return {
      ...base,
      id: p.id,
      title: p.title,
      phaseId: p.phase_id,
      status: p.status,
      githubUrl: p.github_url,
      demoUrl: p.demo_url,
      notes: p.notes,
    };
  });

  const skillRows: any[] = db.prepare(`SELECT * FROM skills`).all();
  const skills = skillRows.map((s) => JSON.parse(s.data_json));

  const resourceRows: any[] = db.prepare(`SELECT * FROM resources`).all();
  const resources = resourceRows.map((r) => JSON.parse(r.data_json));

  const weeklyReviewRows: any[] = db.prepare(`SELECT * FROM weekly_reviews`).all();
  const weeklyReviews = weeklyReviewRows.map((w) => JSON.parse(w.data_json));

  const monthlyReviewRows: any[] = db.prepare(`SELECT * FROM monthly_reviews`).all();
  const monthlyReviews = monthlyReviewRows.map((m) => JSON.parse(m.data_json));

  const chatRows: any[] = db.prepare(`SELECT * FROM chat_history ORDER BY rowid ASC`).all();
  const chatHistory = chatRows.map((c) => ({
    id: c.id,
    sender: c.sender,
    text: c.text,
    timestamp: c.timestamp,
  }));

  const memoryRow: any = db.prepare(`SELECT * FROM bloom_memory WHERE id = 'current'`).get();
  const bloomMemory = memoryRow
    ? {
        weakTopics: JSON.parse(memoryRow.weak_topics || '[]'),
        strongTopics: JSON.parse(memoryRow.strong_topics || '[]'),
        lastReviews: JSON.parse(memoryRow.last_reviews || '[]'),
      }
    : { weakTopics: [], strongTopics: [], lastReviews: [] };

  return {
    user,
    days,
    projects,
    skills,
    resources,
    weeklyReviews,
    monthlyReviews,
    chatHistory,
    bloomMemory,
  };
}

// Function to save entire app state into SQL tables using an atomic SQL transaction
export function saveStateToSQL(state: any) {
  initDatabase();

  const insertUser = db.prepare(`
    INSERT INTO users (
      id, name, current_level, level_title, start_date, daily_study_hours,
      study_days_per_week, rest_day, target_completion_date, dsa_language,
      current_day_number, current_streak, longest_streak, total_study_days, is_onboarded
    ) VALUES (
      'current', @name, @currentLevel, @levelTitle, @startDate, @dailyStudyHours,
      @studyDaysPerWeek, @restDay, @targetCompletionDate, @dsaLanguage,
      @currentDayNumber, @currentStreak, @longestStreak, @totalStudyDays, @isOnboarded
    )
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      current_level = excluded.current_level,
      level_title = excluded.level_title,
      start_date = excluded.start_date,
      daily_study_hours = excluded.daily_study_hours,
      study_days_per_week = excluded.study_days_per_week,
      rest_day = excluded.rest_day,
      target_completion_date = excluded.target_completion_date,
      dsa_language = excluded.dsa_language,
      current_day_number = excluded.current_day_number,
      current_streak = excluded.current_streak,
      longest_streak = excluded.longest_streak,
      total_study_days = excluded.total_study_days,
      is_onboarded = excluded.is_onboarded
  `);

  const insertDay = db.prepare(`
    INSERT INTO bootcamp_days (
      day_number, date_str, is_rest_day, phase_id, phase_title, is_completed,
      fullstack_task, ai_task, dsa_task
    ) VALUES (
      @dayNumber, @dateStr, @isRestDay, @phaseId, @phaseTitle, @isCompleted,
      @fullstackTask, @aiTask, @dsaTask
    )
    ON CONFLICT(day_number) DO UPDATE SET
      date_str = excluded.date_str,
      is_rest_day = excluded.is_rest_day,
      phase_id = excluded.phase_id,
      phase_title = excluded.phase_title,
      is_completed = excluded.is_completed,
      fullstack_task = excluded.fullstack_task,
      ai_task = excluded.ai_task,
      dsa_task = excluded.dsa_task
  `);

  const insertProject = db.prepare(`
    INSERT INTO projects (
      id, title, phase_id, status, github_url, demo_url, notes, data_json
    ) VALUES (
      @id, @title, @phaseId, @status, @githubUrl, @demoUrl, @notes, @dataJson
    )
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      phase_id = excluded.phase_id,
      status = excluded.status,
      github_url = excluded.github_url,
      demo_url = excluded.demo_url,
      notes = excluded.notes,
      data_json = excluded.data_json
  `);

  const insertSkill = db.prepare(`
    INSERT INTO skills (id, data_json) VALUES (@id, @dataJson)
    ON CONFLICT(id) DO UPDATE SET data_json = excluded.data_json
  `);

  const insertResource = db.prepare(`
    INSERT INTO resources (id, data_json) VALUES (@id, @dataJson)
    ON CONFLICT(id) DO UPDATE SET data_json = excluded.data_json
  `);

  const insertWeeklyReview = db.prepare(`
    INSERT INTO weekly_reviews (id, data_json) VALUES (@id, @dataJson)
    ON CONFLICT(id) DO UPDATE SET data_json = excluded.data_json
  `);

  const insertMonthlyReview = db.prepare(`
    INSERT INTO monthly_reviews (id, data_json) VALUES (@id, @dataJson)
    ON CONFLICT(id) DO UPDATE SET data_json = excluded.data_json
  `);

  const insertChat = db.prepare(`
    INSERT INTO chat_history (id, sender, text, timestamp)
    VALUES (@id, @sender, @text, @timestamp)
    ON CONFLICT(id) DO UPDATE SET
      sender = excluded.sender,
      text = excluded.text,
      timestamp = excluded.timestamp
  `);

  const insertMemory = db.prepare(`
    INSERT INTO bloom_memory (id, weak_topics, strong_topics, last_reviews)
    VALUES ('current', @weakTopics, @strongTopics, @lastReviews)
    ON CONFLICT(id) DO UPDATE SET
      weak_topics = excluded.weak_topics,
      strong_topics = excluded.strong_topics,
      last_reviews = excluded.last_reviews
  `);

  const transaction = db.transaction(() => {
    if (state.user) {
      insertUser.run({
        name: state.user.name || '',
        currentLevel: state.user.currentLevel || 1,
        levelTitle: state.user.levelTitle || '',
        startDate: state.user.startDate || '',
        dailyStudyHours: state.user.dailyStudyHours || 4,
        studyDaysPerWeek: state.user.studyDaysPerWeek || 6,
        restDay: state.user.restDay || 'Sunday',
        targetCompletionDate: state.user.targetCompletionDate || '',
        dsaLanguage: state.user.dsaLanguage || 'Python',
        currentDayNumber: state.user.currentDayNumber || 1,
        currentStreak: state.user.currentStreak || 0,
        longestStreak: state.user.longestStreak || 0,
        totalStudyDays: state.user.totalStudyDays || 0,
        isOnboarded: state.user.isOnboarded ? 1 : 0,
      });
    }

    if (Array.isArray(state.days)) {
      for (const d of state.days) {
        insertDay.run({
          dayNumber: d.dayNumber,
          dateStr: d.dateStr || '',
          isRestDay: d.isRestDay ? 1 : 0,
          phaseId: d.phaseId,
          phaseTitle: d.phaseTitle || '',
          isCompleted: d.isCompleted ? 1 : 0,
          fullstackTask: JSON.stringify(d.fullstackTask || {}),
          aiTask: JSON.stringify(d.aiTask || {}),
          dsaTask: JSON.stringify(d.dsaTask || {}),
        });
      }
    }

    if (Array.isArray(state.projects)) {
      for (const p of state.projects) {
        insertProject.run({
          id: p.id,
          title: p.title || '',
          phaseId: p.phaseId || 0,
          status: p.status || 'LOCKED',
          githubUrl: p.githubUrl || '',
          demoUrl: p.demoUrl || '',
          notes: p.notes || '',
          dataJson: JSON.stringify(p),
        });
      }
    }

    if (Array.isArray(state.skills)) {
      for (const s of state.skills) {
        insertSkill.run({ id: s.id, dataJson: JSON.stringify(s) });
      }
    }

    if (Array.isArray(state.resources)) {
      for (const r of state.resources) {
        insertResource.run({ id: r.id, dataJson: JSON.stringify(r) });
      }
    }

    if (Array.isArray(state.weeklyReviews)) {
      for (const w of state.weeklyReviews) {
        insertWeeklyReview.run({ id: `w-${w.weekNumber}`, dataJson: JSON.stringify(w) });
      }
    }

    if (Array.isArray(state.monthlyReviews)) {
      for (const m of state.monthlyReviews) {
        insertMonthlyReview.run({ id: `m-${m.monthNumber}`, dataJson: JSON.stringify(m) });
      }
    }

    if (Array.isArray(state.chatHistory)) {
      for (const c of state.chatHistory) {
        insertChat.run({
          id: c.id,
          sender: c.sender,
          text: c.text,
          timestamp: c.timestamp || new Date().toISOString(),
        });
      }
    }

    if (state.bloomMemory) {
      insertMemory.run({
        weakTopics: JSON.stringify(state.bloomMemory.weakTopics || []),
        strongTopics: JSON.stringify(state.bloomMemory.strongTopics || []),
        lastReviews: JSON.stringify(state.bloomMemory.lastReviews || []),
      });
    }
  });

  transaction();
}
