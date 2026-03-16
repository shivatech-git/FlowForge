import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import _ from "lodash";

// ─── ICONS ───
const Icons = {
  Home: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Board: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  List: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Calendar: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Pulse: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  Team: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  Settings: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  Plus: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  X: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Check: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  Clock: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Flag: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
  Chat: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  Attach: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>,
  Search: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Filter: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Gantt: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><rect x="3" y="4" width="12" height="4" rx="1"/><rect x="7" y="10" width="14" height="4" rx="1"/><rect x="5" y="16" width="10" height="4" rx="1"/></svg>,
  Trash: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  Edit: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Arrow: () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>,
  Zap: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  TrendUp: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  TrendDown: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
  AlertTriangle: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Grip: () => <svg width="10" height="14" fill="currentColor" viewBox="0 0 10 14"><circle cx="3" cy="2" r="1.5" opacity="0.4"/><circle cx="7" cy="2" r="1.5" opacity="0.4"/><circle cx="3" cy="7" r="1.5" opacity="0.4"/><circle cx="7" cy="7" r="1.5" opacity="0.4"/><circle cx="3" cy="12" r="1.5" opacity="0.4"/><circle cx="7" cy="12" r="1.5" opacity="0.4"/></svg>,
};

// ─── DATA ───
const TEAM_MEMBERS = [
  { id: "u1", name: "Arjun Mehta", avatar: "AM", color: "#E8453C", role: "Project Lead" },
  { id: "u2", name: "Priya Sharma", avatar: "PS", color: "#3B82F6", role: "Frontend Dev" },
  { id: "u3", name: "Rahul Verma", avatar: "RV", color: "#10B981", role: "Backend Dev" },
  { id: "u4", name: "Sneha Iyer", avatar: "SI", color: "#F59E0B", role: "Designer" },
  { id: "u5", name: "Vikram Das", avatar: "VD", color: "#8B5CF6", role: "QA Engineer" },
];

const INITIAL_PROJECTS = [
  { id: "p1", name: "Website Redesign", color: "#E8453C", icon: "🌐" },
  { id: "p2", name: "Mobile App v2", color: "#3B82F6", icon: "📱" },
  { id: "p3", name: "API Integration", color: "#10B981", icon: "🔗" },
];

const COLUMNS = [
  { id: "backlog", title: "Backlog", color: "#64748b" },
  { id: "todo", title: "To Do", color: "#3B82F6" },
  { id: "in_progress", title: "In Progress", color: "#F59E0B" },
  { id: "review", title: "Review", color: "#8B5CF6" },
  { id: "done", title: "Done", color: "#10B981" },
];

const PRIORITIES = { urgent: { label: "Urgent", color: "#E8453C" }, high: { label: "High", color: "#F59E0B" }, medium: { label: "Medium", color: "#3B82F6" }, low: { label: "Low", color: "#64748b" } };
const LABELS = ["Bug", "Feature", "Enhancement", "Documentation", "Design", "Research", "DevOps", "Testing"];

const generateId = () => Math.random().toString(36).substr(2, 9);

const INITIAL_TASKS = [
  { id: generateId(), title: "Design new landing page", description: "Create mockups for the redesigned landing page with modern aesthetics", status: "in_progress", priority: "high", projectId: "p1", assignees: ["u4", "u2"], labels: ["Design", "Feature"], dueDate: "2026-03-20", createdAt: "2026-03-01", subtasks: [{ id: "s1", title: "Wireframes", done: true }, { id: "s2", title: "Hi-fi mockups", done: false }, { id: "s3", title: "Responsive variants", done: false }], comments: [{ id: "c1", userId: "u1", text: "Let's go with the dark theme variant", time: "2026-03-10T10:30:00" }], timeLogged: 14, timeEstimate: 24, storyPoints: 8 },
  { id: generateId(), title: "Implement authentication flow", description: "Build OAuth2 + JWT auth with social logins", status: "in_progress", priority: "urgent", projectId: "p2", assignees: ["u3"], labels: ["Feature", "DevOps"], dueDate: "2026-03-18", createdAt: "2026-03-02", subtasks: [{ id: "s4", title: "OAuth setup", done: true }, { id: "s5", title: "JWT middleware", done: true }, { id: "s6", title: "Social login buttons", done: false }], comments: [], timeLogged: 18, timeEstimate: 20, storyPoints: 13 },
  { id: generateId(), title: "Fix navigation bug on mobile", description: "Hamburger menu not closing after selecting an item", status: "todo", priority: "urgent", projectId: "p1", assignees: ["u2"], labels: ["Bug"], dueDate: "2026-03-17", createdAt: "2026-03-08", subtasks: [], comments: [], timeLogged: 0, timeEstimate: 3, storyPoints: 2 },
  { id: generateId(), title: "API rate limiting", description: "Implement rate limiting middleware for all public endpoints", status: "review", priority: "high", projectId: "p3", assignees: ["u3", "u5"], labels: ["Feature", "DevOps"], dueDate: "2026-03-22", createdAt: "2026-03-05", subtasks: [{ id: "s7", title: "Redis setup", done: true }, { id: "s8", title: "Middleware code", done: true }, { id: "s9", title: "Load testing", done: false }], comments: [{ id: "c2", userId: "u5", text: "Load tests passing at 10k req/s", time: "2026-03-14T14:00:00" }], timeLogged: 12, timeEstimate: 16, storyPoints: 5 },
  { id: generateId(), title: "Write API documentation", description: "Complete OpenAPI spec and developer guide", status: "backlog", priority: "medium", projectId: "p3", assignees: ["u3"], labels: ["Documentation"], dueDate: "2026-03-28", createdAt: "2026-03-10", subtasks: [], comments: [], timeLogged: 0, timeEstimate: 12, storyPoints: 5 },
  { id: generateId(), title: "User onboarding flow", description: "Design and implement the new user onboarding experience", status: "todo", priority: "high", projectId: "p2", assignees: ["u4", "u2"], labels: ["Feature", "Design"], dueDate: "2026-03-25", createdAt: "2026-03-06", subtasks: [{ id: "s10", title: "User research", done: true }, { id: "s11", title: "Flow design", done: false }, { id: "s12", title: "Implementation", done: false }], comments: [], timeLogged: 6, timeEstimate: 30, storyPoints: 13 },
  { id: generateId(), title: "Performance optimization", description: "Reduce bundle size and improve LCP score", status: "backlog", priority: "medium", projectId: "p1", assignees: ["u2"], labels: ["Enhancement"], dueDate: "2026-04-01", createdAt: "2026-03-12", subtasks: [], comments: [], timeLogged: 0, timeEstimate: 16, storyPoints: 8 },
  { id: generateId(), title: "Integration test suite", description: "Set up Cypress E2E tests for critical user flows", status: "todo", priority: "medium", projectId: "p2", assignees: ["u5"], labels: ["Testing"], dueDate: "2026-03-30", createdAt: "2026-03-09", subtasks: [], comments: [], timeLogged: 2, timeEstimate: 20, storyPoints: 8 },
  { id: generateId(), title: "Database migration script", description: "Migrate from PostgreSQL 14 to 16 with zero downtime", status: "done", priority: "high", projectId: "p3", assignees: ["u3"], labels: ["DevOps"], dueDate: "2026-03-15", createdAt: "2026-03-01", subtasks: [{ id: "s13", title: "Backup strategy", done: true }, { id: "s14", title: "Migration script", done: true }, { id: "s15", title: "Rollback plan", done: true }], comments: [], timeLogged: 10, timeEstimate: 10, storyPoints: 5 },
  { id: generateId(), title: "Dark mode implementation", description: "Add system-aware dark mode with manual toggle", status: "done", priority: "low", projectId: "p1", assignees: ["u2", "u4"], labels: ["Feature", "Design"], dueDate: "2026-03-14", createdAt: "2026-02-28", subtasks: [], comments: [], timeLogged: 8, timeEstimate: 8, storyPoints: 3 },
  { id: generateId(), title: "Push notification service", description: "Build FCM-based push notification microservice", status: "backlog", priority: "medium", projectId: "p2", assignees: ["u3"], labels: ["Feature"], dueDate: "2026-04-05", createdAt: "2026-03-14", subtasks: [], comments: [], timeLogged: 0, timeEstimate: 24, storyPoints: 8 },
  { id: generateId(), title: "Webhook system design", description: "Design event-driven webhook system for API consumers", status: "backlog", priority: "low", projectId: "p3", assignees: ["u3", "u1"], labels: ["Research", "Feature"], dueDate: "2026-04-10", createdAt: "2026-03-13", subtasks: [], comments: [], timeLogged: 0, timeEstimate: 16, storyPoints: 13 },
];

// ─── STYLES ───
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg-deep: #0a0a0f;
  --bg-surface: #12121a;
  --bg-card: #1a1a25;
  --bg-elevated: #22222f;
  --bg-hover: #2a2a38;
  --border: #2a2a3a;
  --border-light: #333346;
  --text-primary: #e8e8f0;
  --text-secondary: #8888a0;
  --text-muted: #55556a;
  --accent: #6c5ce7;
  --accent-light: #a29bfe;
  --accent-glow: rgba(108, 92, 231, 0.15);
  --success: #00cec9;
  --success-bg: rgba(0, 206, 201, 0.1);
  --warning: #fdcb6e;
  --warning-bg: rgba(253, 203, 110, 0.1);
  --danger: #ff6b6b;
  --danger-bg: rgba(255, 107, 107, 0.1);
  --radius: 10px;
  --radius-sm: 6px;
  --radius-lg: 14px;
  --shadow: 0 4px 24px rgba(0,0,0,0.3);
  --shadow-lg: 0 12px 48px rgba(0,0,0,0.5);
  --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: var(--bg-deep); color: var(--text-primary); font-family: 'DM Sans', sans-serif; }

.app { display: flex; height: 100vh; overflow: hidden; background: var(--bg-deep); }

/* Sidebar */
.sidebar {
  width: 260px; min-width: 260px; background: var(--bg-surface);
  border-right: 1px solid var(--border); display: flex; flex-direction: column;
  padding: 0; overflow-y: auto;
}
.sidebar-logo { padding: 20px 20px 16px; display: flex; align-items: center; gap: 10px; }
.sidebar-logo .logo-icon {
  width: 36px; height: 36px; border-radius: var(--radius);
  background: linear-gradient(135deg, var(--accent), #a29bfe);
  display: flex; align-items: center; justify-content: center; font-size: 18px;
}
.sidebar-logo h1 { font-size: 17px; font-weight: 700; letter-spacing: -0.3px; }
.sidebar-section { padding: 8px 12px; }
.sidebar-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.2px; color: var(--text-muted); padding: 8px 8px 6px; }
.sidebar-item {
  display: flex; align-items: center; gap: 10px; padding: 8px 12px;
  border-radius: var(--radius-sm); cursor: pointer; color: var(--text-secondary);
  font-size: 13.5px; font-weight: 450; transition: var(--transition); position: relative;
}
.sidebar-item:hover { background: var(--bg-hover); color: var(--text-primary); }
.sidebar-item.active {
  background: var(--accent-glow); color: var(--accent-light);
}
.sidebar-item.active::before {
  content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
  width: 3px; height: 20px; background: var(--accent); border-radius: 0 3px 3px 0;
}
.sidebar-item .count {
  margin-left: auto; font-size: 11px; background: var(--bg-elevated);
  padding: 1px 7px; border-radius: 10px; font-weight: 500; font-family: 'JetBrains Mono', monospace;
}
.sidebar-project {
  display: flex; align-items: center; gap: 10px; padding: 7px 12px;
  border-radius: var(--radius-sm); cursor: pointer; font-size: 13px;
  color: var(--text-secondary); transition: var(--transition);
}
.sidebar-project:hover { background: var(--bg-hover); color: var(--text-primary); }
.sidebar-project .dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.sidebar-user {
  margin-top: auto; padding: 16px; border-top: 1px solid var(--border);
  display: flex; align-items: center; gap: 10px;
}
.avatar {
  width: 32px; height: 32px; border-radius: 50%; display: flex;
  align-items: center; justify-content: center; font-size: 12px;
  font-weight: 600; color: white; flex-shrink: 0;
}
.avatar-sm { width: 24px; height: 24px; font-size: 10px; }
.avatar-lg { width: 40px; height: 40px; font-size: 15px; }

/* Main */
.main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.topbar {
  padding: 14px 24px; display: flex; align-items: center; gap: 16px;
  border-bottom: 1px solid var(--border); background: var(--bg-surface);
  min-height: 56px;
}
.topbar h2 { font-size: 18px; font-weight: 700; letter-spacing: -0.3px; }
.search-box {
  display: flex; align-items: center; gap: 8px; background: var(--bg-card);
  border: 1px solid var(--border); border-radius: var(--radius); padding: 6px 12px;
  margin-left: auto; min-width: 240px; transition: var(--transition);
}
.search-box:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
.search-box input {
  background: none; border: none; outline: none; color: var(--text-primary);
  font-size: 13px; font-family: inherit; width: 100%;
}
.search-box input::placeholder { color: var(--text-muted); }

.content { flex: 1; overflow-y: auto; padding: 24px; }

/* View Tabs */
.view-tabs { display: flex; gap: 2px; background: var(--bg-card); border-radius: var(--radius); padding: 3px; }
.view-tab {
  padding: 6px 14px; border-radius: var(--radius-sm); font-size: 12.5px;
  font-weight: 500; cursor: pointer; color: var(--text-secondary);
  transition: var(--transition); display: flex; align-items: center; gap: 6px;
}
.view-tab:hover { color: var(--text-primary); }
.view-tab.active { background: var(--accent); color: white; }

/* Kanban */
.kanban { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 20px; min-height: calc(100vh - 180px); }
.kanban-column {
  min-width: 280px; max-width: 280px; flex-shrink: 0;
  background: var(--bg-surface); border-radius: var(--radius-lg);
  border: 1px solid var(--border); display: flex; flex-direction: column; max-height: calc(100vh - 180px);
}
.kanban-header {
  padding: 14px 16px; display: flex; align-items: center; gap: 10px;
  border-bottom: 1px solid var(--border); flex-shrink: 0;
}
.kanban-header .col-dot { width: 10px; height: 10px; border-radius: 50%; }
.kanban-header h3 { font-size: 13px; font-weight: 600; }
.kanban-header .col-count {
  font-size: 11px; color: var(--text-muted); font-family: 'JetBrains Mono', monospace;
  margin-left: auto; background: var(--bg-elevated); padding: 2px 8px; border-radius: 10px;
}
.kanban-cards { padding: 8px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 8px; }

/* Task Card */
.task-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 14px; cursor: pointer; transition: var(--transition); position: relative;
}
.task-card:hover { border-color: var(--border-light); transform: translateY(-1px); box-shadow: var(--shadow); }
.task-card.dragging { opacity: 0.5; transform: scale(0.96); }
.task-card .card-labels { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; }
.task-card .card-label {
  font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 10px;
  letter-spacing: 0.3px;
}
.task-card .card-title { font-size: 13.5px; font-weight: 550; line-height: 1.4; margin-bottom: 10px; }
.task-card .card-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.task-card .card-meta-item {
  display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--text-muted);
}
.task-card .card-assignees { margin-left: auto; display: flex; }
.task-card .card-assignees .avatar { margin-left: -6px; border: 2px solid var(--bg-card); }
.task-card .card-progress { margin-top: 10px; }
.task-card .progress-bar {
  height: 3px; background: var(--bg-elevated); border-radius: 3px; overflow: hidden;
}
.task-card .progress-fill { height: 100%; border-radius: 3px; transition: width 0.4s ease; }
.task-card .progress-text { font-size: 10px; color: var(--text-muted); margin-top: 4px; font-family: 'JetBrains Mono', monospace; }
.priority-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

/* Add Task */
.add-task-btn {
  display: flex; align-items: center; gap: 6px; padding: 8px 12px;
  color: var(--text-muted); font-size: 12.5px; cursor: pointer;
  border-radius: var(--radius-sm); transition: var(--transition); margin: 4px 8px 8px;
}
.add-task-btn:hover { background: var(--bg-hover); color: var(--text-secondary); }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
  z-index: 1000; display: flex; align-items: center; justify-content: center;
  animation: fadeIn 0.15s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal {
  background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-lg);
  width: 620px; max-width: 95vw; max-height: 90vh; overflow-y: auto;
  box-shadow: var(--shadow-lg); animation: modalIn 0.2s ease;
}
@keyframes modalIn { from { opacity: 0; transform: scale(0.96) translateY(10px); } to { opacity: 1; transform: none; } }
.modal-header {
  padding: 20px 24px 16px; display: flex; align-items: flex-start; justify-content: space-between;
  border-bottom: 1px solid var(--border);
}
.modal-body { padding: 20px 24px; }
.modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 8px; }

/* Forms */
.form-group { margin-bottom: 16px; }
.form-label { display: block; font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
.form-input, .form-select, .form-textarea {
  width: 100%; padding: 9px 12px; background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-sm); color: var(--text-primary); font-size: 13.5px;
  font-family: inherit; outline: none; transition: var(--transition);
}
.form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
.form-textarea { resize: vertical; min-height: 80px; }
.form-select { appearance: none; cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%238888a0' viewBox='0 0 24 24'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }
.form-select option { background: var(--bg-card); }

/* Buttons */
.btn {
  padding: 8px 16px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 550;
  font-family: inherit; cursor: pointer; border: 1px solid transparent;
  transition: var(--transition); display: inline-flex; align-items: center; gap: 6px;
}
.btn-primary { background: var(--accent); color: white; }
.btn-primary:hover { background: #5a4bd4; }
.btn-ghost { background: transparent; color: var(--text-secondary); border-color: var(--border); }
.btn-ghost:hover { background: var(--bg-hover); color: var(--text-primary); }
.btn-danger { background: var(--danger-bg); color: var(--danger); border-color: rgba(255,107,107,0.2); }
.btn-danger:hover { background: rgba(255,107,107,0.2); }
.btn-icon {
  width: 32px; height: 32px; padding: 0; display: flex; align-items: center;
  justify-content: center; border-radius: var(--radius-sm); background: transparent;
  border: none; color: var(--text-muted); cursor: pointer; transition: var(--transition);
}
.btn-icon:hover { background: var(--bg-hover); color: var(--text-primary); }

/* Labels */
.label-tag {
  display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px;
  border-radius: 10px; font-size: 11px; font-weight: 600; cursor: pointer;
  transition: var(--transition);
}

/* List View */
.list-view { }
.list-header {
  display: grid; grid-template-columns: 36px 1fr 120px 100px 100px 140px 80px;
  gap: 8px; padding: 8px 16px; font-size: 11px; font-weight: 600;
  color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border);
}
.list-row {
  display: grid; grid-template-columns: 36px 1fr 120px 100px 100px 140px 80px;
  gap: 8px; padding: 10px 16px; align-items: center; border-bottom: 1px solid var(--border);
  transition: var(--transition); cursor: pointer; font-size: 13px;
}
.list-row:hover { background: var(--bg-hover); }
.list-check {
  width: 18px; height: 18px; border: 2px solid var(--border-light);
  border-radius: 4px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: var(--transition);
}
.list-check.checked { background: var(--success); border-color: var(--success); }

/* Calendar */
.calendar-grid {
  display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px;
  background: var(--border); border-radius: var(--radius-lg); overflow: hidden;
}
.calendar-day-header {
  padding: 10px; text-align: center; font-size: 11px; font-weight: 600;
  color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;
  background: var(--bg-surface);
}
.calendar-day {
  min-height: 100px; padding: 8px; background: var(--bg-surface);
  transition: var(--transition); cursor: pointer;
}
.calendar-day:hover { background: var(--bg-card); }
.calendar-day.other-month { opacity: 0.3; }
.calendar-day.today { background: var(--accent-glow); }
.calendar-day .day-num { font-size: 12px; font-weight: 600; margin-bottom: 4px; color: var(--text-secondary); }
.calendar-day.today .day-num { color: var(--accent-light); }
.calendar-task {
  font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-bottom: 2px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  font-weight: 500;
}

/* Gantt */
.gantt-container { overflow-x: auto; }
.gantt-row {
  display: flex; align-items: center; border-bottom: 1px solid var(--border);
  min-height: 44px;
}
.gantt-label { width: 200px; min-width: 200px; padding: 8px 12px; font-size: 12.5px; font-weight: 500; }
.gantt-bar-area { flex: 1; position: relative; height: 44px; }
.gantt-bar {
  position: absolute; height: 26px; top: 9px; border-radius: 6px;
  display: flex; align-items: center; padding: 0 8px; font-size: 10px;
  font-weight: 600; color: white; cursor: pointer; transition: var(--transition);
  white-space: nowrap; overflow: hidden;
}
.gantt-bar:hover { filter: brightness(1.15); transform: scaleY(1.1); }

/* Pulse (Unique Feature) */
.pulse-container { max-width: 1000px; }
.pulse-hero {
  background: linear-gradient(135deg, rgba(108,92,231,0.12), rgba(0,206,201,0.08));
  border: 1px solid var(--border); border-radius: var(--radius-lg);
  padding: 28px 32px; margin-bottom: 24px; position: relative; overflow: hidden;
}
.pulse-hero::before {
  content: ''; position: absolute; top: -50%; right: -20%; width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(108,92,231,0.08), transparent 70%);
  pointer-events: none;
}
.pulse-score {
  font-size: 72px; font-weight: 700; letter-spacing: -3px; line-height: 1;
  background: linear-gradient(135deg, var(--accent-light), var(--success));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  font-family: 'JetBrains Mono', monospace;
}
.pulse-label { font-size: 14px; color: var(--text-secondary); margin-top: 4px; font-weight: 500; }
.pulse-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px; }
.pulse-metric {
  background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 18px; transition: var(--transition);
}
.pulse-metric:hover { border-color: var(--border-light); }
.pulse-metric .metric-label { font-size: 11px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.pulse-metric .metric-value { font-size: 28px; font-weight: 700; margin: 4px 0; font-family: 'JetBrains Mono', monospace; }
.pulse-metric .metric-change { font-size: 12px; display: flex; align-items: center; gap: 4px; }
.pulse-alerts { display: flex; flex-direction: column; gap: 10px; }
.pulse-alert {
  display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px;
  background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius);
}
.pulse-alert .alert-icon { width: 32px; height: 32px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.pulse-alert .alert-title { font-size: 13px; font-weight: 600; }
.pulse-alert .alert-desc { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }

.pulse-chart-container {
  background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-lg);
  padding: 20px; margin-bottom: 24px;
}
.pulse-chart-title { font-size: 13px; font-weight: 600; margin-bottom: 16px; }
.pulse-spark { display: flex; align-items: flex-end; gap: 3px; height: 80px; }
.pulse-spark-bar {
  flex: 1; border-radius: 3px 3px 0 0; transition: height 0.4s ease; min-width: 8px;
  cursor: pointer; position: relative;
}
.pulse-spark-bar:hover { filter: brightness(1.3); }

/* Team */
.team-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.team-card {
  background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-lg);
  padding: 20px; transition: var(--transition);
}
.team-card:hover { border-color: var(--border-light); transform: translateY(-2px); box-shadow: var(--shadow); }
.team-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.team-card .workload-bar { height: 6px; background: var(--bg-elevated); border-radius: 6px; overflow: hidden; margin-top: 8px; }
.team-card .workload-fill { height: 100%; border-radius: 6px; transition: width 0.4s ease; }

/* Tags */
.tag-row { display: flex; flex-wrap: wrap; gap: 4px; }
.tag {
  padding: 2px 8px; border-radius: 8px; font-size: 10px; font-weight: 600;
  background: var(--bg-elevated); color: var(--text-secondary);
}

/* Chip select */
.chip-select { display: flex; flex-wrap: wrap; gap: 6px; }
.chip {
  padding: 5px 12px; border-radius: 16px; font-size: 12px; font-weight: 500;
  border: 1px solid var(--border); cursor: pointer; transition: var(--transition);
  color: var(--text-secondary);
}
.chip:hover { border-color: var(--border-light); }
.chip.selected { background: var(--accent-glow); border-color: var(--accent); color: var(--accent-light); }

/* Multi-select */
.assignee-option {
  display: flex; align-items: center; gap: 8px; padding: 6px 10px;
  border-radius: var(--radius-sm); cursor: pointer; transition: var(--transition);
}
.assignee-option:hover { background: var(--bg-hover); }
.assignee-option.selected { background: var(--accent-glow); }

/* Subtask */
.subtask-item {
  display: flex; align-items: center; gap: 8px; padding: 6px 0;
  border-bottom: 1px solid var(--border);
}
.subtask-check {
  width: 16px; height: 16px; border: 2px solid var(--border-light);
  border-radius: 4px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: var(--transition); flex-shrink: 0;
}
.subtask-check.done { background: var(--success); border-color: var(--success); }
.subtask-text { font-size: 13px; flex: 1; }
.subtask-text.done { text-decoration: line-through; color: var(--text-muted); }

/* Comment */
.comment-item { display: flex; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--border); }
.comment-text { font-size: 13px; line-height: 1.5; }
.comment-meta { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--border-light); }

/* Drag ghost */
.drag-over { background: var(--accent-glow) !important; border-color: var(--accent) !important; }

/* Tooltip */
[data-tooltip] { position: relative; }
[data-tooltip]:hover::after {
  content: attr(data-tooltip); position: absolute; bottom: calc(100% + 6px);
  left: 50%; transform: translateX(-50%); padding: 4px 10px; background: var(--bg-elevated);
  border: 1px solid var(--border-light); border-radius: var(--radius-sm); font-size: 11px;
  white-space: nowrap; z-index: 100; pointer-events: none;
}

.filter-bar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.filter-chip {
  padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 500;
  background: var(--bg-card); border: 1px solid var(--border); cursor: pointer;
  color: var(--text-secondary); transition: var(--transition);
}
.filter-chip:hover { border-color: var(--border-light); }
.filter-chip.active { background: var(--accent-glow); border-color: var(--accent); color: var(--accent-light); }

.empty-state { text-align: center; padding: 48px; color: var(--text-muted); }
.empty-state .empty-icon { font-size: 48px; margin-bottom: 12px; }
.empty-state p { font-size: 14px; }

/* Detail Panel */
.detail-section { margin-bottom: 20px; }
.detail-section h4 { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
.detail-row { display: flex; align-items: center; gap: 8px; padding: 4px 0; font-size: 13px; }
.detail-label { width: 100px; color: var(--text-muted); font-size: 12px; flex-shrink: 0; }

.time-display { font-family: 'JetBrains Mono', monospace; font-size: 13px; }
.time-bar { height: 6px; background: var(--bg-elevated); border-radius: 6px; overflow: hidden; flex: 1; }
.time-fill { height: 100%; border-radius: 6px; }

@keyframes slideIn { from { opacity:0; transform:translateX(10px); } to { opacity:1; transform:none; } }
.animate-in { animation: slideIn 0.25s ease; }
`;

// ─── LABEL COLORS ───
const LABEL_COLORS = {
  Bug: { bg: "rgba(255,107,107,0.12)", color: "#ff6b6b", border: "rgba(255,107,107,0.25)" },
  Feature: { bg: "rgba(108,92,231,0.12)", color: "#a29bfe", border: "rgba(108,92,231,0.25)" },
  Enhancement: { bg: "rgba(0,206,201,0.12)", color: "#00cec9", border: "rgba(0,206,201,0.25)" },
  Documentation: { bg: "rgba(253,203,110,0.12)", color: "#fdcb6e", border: "rgba(253,203,110,0.25)" },
  Design: { bg: "rgba(232,69,60,0.12)", color: "#fab1a0", border: "rgba(232,69,60,0.25)" },
  Research: { bg: "rgba(59,130,246,0.12)", color: "#74b9ff", border: "rgba(59,130,246,0.25)" },
  DevOps: { bg: "rgba(99,110,114,0.12)", color: "#b2bec3", border: "rgba(99,110,114,0.25)" },
  Testing: { bg: "rgba(139,92,246,0.12)", color: "#d6bcfa", border: "rgba(139,92,246,0.25)" },
};

// ─── HELPER COMPONENTS ───
function Avatar({ user, size = "" }) {
  return (
    <div className={`avatar ${size === "sm" ? "avatar-sm" : size === "lg" ? "avatar-lg" : ""}`} style={{ background: user.color }}>
      {user.avatar}
    </div>
  );
}

function TaskCard({ task, onClick, onDragStart, onDragEnd }) {
  const project = INITIAL_PROJECTS.find(p => p.id === task.projectId);
  const subtaskDone = task.subtasks.filter(s => s.done).length;
  const subtaskTotal = task.subtasks.length;
  const timePercent = task.timeEstimate > 0 ? Math.min((task.timeLogged / task.timeEstimate) * 100, 100) : 0;

  return (
    <div
      className="task-card"
      draggable
      onClick={onClick}
      onDragStart={(e) => { e.dataTransfer.setData("taskId", task.id); onDragStart?.(task.id); }}
      onDragEnd={onDragEnd}
    >
      {task.labels.length > 0 && (
        <div className="card-labels">
          {task.labels.map(l => (
            <span key={l} className="card-label" style={{ background: LABEL_COLORS[l]?.bg, color: LABEL_COLORS[l]?.color, border: `1px solid ${LABEL_COLORS[l]?.border}` }}>{l}</span>
          ))}
        </div>
      )}
      <div className="card-title">{task.title}</div>
      <div className="card-meta">
        <span className="card-meta-item"><span className="priority-dot" style={{ background: PRIORITIES[task.priority]?.color }} />{PRIORITIES[task.priority]?.label}</span>
        {task.dueDate && <span className="card-meta-item"><Icons.Clock />{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
        {subtaskTotal > 0 && <span className="card-meta-item"><Icons.Check />{subtaskDone}/{subtaskTotal}</span>}
        {task.comments.length > 0 && <span className="card-meta-item"><Icons.Chat />{task.comments.length}</span>}
        {task.storyPoints > 0 && <span className="card-meta-item" style={{ background: 'var(--bg-elevated)', padding: '1px 6px', borderRadius: 8, fontFamily: "'JetBrains Mono', monospace" }}>{task.storyPoints}sp</span>}
        <div className="card-assignees">
          {task.assignees.map(aId => { const u = TEAM_MEMBERS.find(m => m.id === aId); return u ? <Avatar key={aId} user={u} size="sm" /> : null; })}
        </div>
      </div>
      {subtaskTotal > 0 && (
        <div className="card-progress">
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${(subtaskDone / subtaskTotal) * 100}%`, background: subtaskDone === subtaskTotal ? 'var(--success)' : 'var(--accent)' }} /></div>
          <div className="progress-text">{subtaskDone}/{subtaskTotal} subtasks</div>
        </div>
      )}
      {timePercent > 0 && subtaskTotal === 0 && (
        <div className="card-progress">
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${timePercent}%`, background: timePercent > 90 ? 'var(--warning)' : 'var(--accent)' }} /></div>
          <div className="progress-text">{task.timeLogged}h / {task.timeEstimate}h</div>
        </div>
      )}
    </div>
  );
}

// ─── TASK MODAL ───
function TaskModal({ task, onClose, onSave, onDelete }) {
  const isNew = !task.id;
  const [form, setForm] = useState(task ? { ...task } : {
    title: "", description: "", status: "todo", priority: "medium", projectId: "p1",
    assignees: [], labels: [], dueDate: "", subtasks: [], comments: [],
    timeLogged: 0, timeEstimate: 0, storyPoints: 0, createdAt: new Date().toISOString().slice(0, 10),
  });
  const [newSubtask, setNewSubtask] = useState("");
  const [newComment, setNewComment] = useState("");

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const toggleAssignee = (id) => {
    setForm(f => ({ ...f, assignees: f.assignees.includes(id) ? f.assignees.filter(a => a !== id) : [...f.assignees, id] }));
  };
  const toggleLabel = (l) => {
    setForm(f => ({ ...f, labels: f.labels.includes(l) ? f.labels.filter(x => x !== l) : [...f.labels, l] }));
  };
  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setForm(f => ({ ...f, subtasks: [...f.subtasks, { id: generateId(), title: newSubtask.trim(), done: false }] }));
    setNewSubtask("");
  };
  const toggleSubtask = (sid) => {
    setForm(f => ({ ...f, subtasks: f.subtasks.map(s => s.id === sid ? { ...s, done: !s.done } : s) }));
  };
  const removeSubtask = (sid) => {
    setForm(f => ({ ...f, subtasks: f.subtasks.filter(s => s.id !== sid) }));
  };
  const addComment = () => {
    if (!newComment.trim()) return;
    setForm(f => ({ ...f, comments: [...f.comments, { id: generateId(), userId: "u1", text: newComment.trim(), time: new Date().toISOString() }] }));
    setNewComment("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: 17, fontWeight: 700 }}>{isNew ? "Create Task" : "Edit Task"}</h3>
          <button className="btn-icon" onClick={onClose}><Icons.X /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" value={form.title} onChange={e => update("title", e.target.value)} placeholder="Task title..." />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} onChange={e => update("description", e.target.value)} placeholder="Describe the task..." />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={e => update("status", e.target.value)}>
                {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-select" value={form.priority} onChange={e => update("priority", e.target.value)}>
                {Object.entries(PRIORITIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Project</label>
              <select className="form-select" value={form.projectId} onChange={e => update("projectId", e.target.value)}>
                {INITIAL_PROJECTS.map(p => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input className="form-input" type="date" value={form.dueDate} onChange={e => update("dueDate", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Time Estimate (hrs)</label>
              <input className="form-input" type="number" min="0" value={form.timeEstimate} onChange={e => update("timeEstimate", Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Story Points</label>
              <input className="form-input" type="number" min="0" value={form.storyPoints} onChange={e => update("storyPoints", Number(e.target.value))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Assignees</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {TEAM_MEMBERS.map(u => (
                <div key={u.id} className={`assignee-option ${form.assignees.includes(u.id) ? "selected" : ""}`} onClick={() => toggleAssignee(u.id)}>
                  <Avatar user={u} size="sm" />
                  <span style={{ fontSize: 13 }}>{u.name}</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: "auto" }}>{u.role}</span>
                  {form.assignees.includes(u.id) && <span style={{ color: "var(--success)" }}><Icons.Check /></span>}
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Labels</label>
            <div className="chip-select">
              {LABELS.map(l => (
                <span key={l} className={`chip ${form.labels.includes(l) ? "selected" : ""}`} onClick={() => toggleLabel(l)}>{l}</span>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Subtasks</label>
            {form.subtasks.map(s => (
              <div key={s.id} className="subtask-item">
                <div className={`subtask-check ${s.done ? "done" : ""}`} onClick={() => toggleSubtask(s.id)}>
                  {s.done && <Icons.Check />}
                </div>
                <span className={`subtask-text ${s.done ? "done" : ""}`}>{s.title}</span>
                <button className="btn-icon" onClick={() => removeSubtask(s.id)}><Icons.X /></button>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input className="form-input" value={newSubtask} onChange={e => setNewSubtask(e.target.value)} placeholder="Add subtask..." onKeyDown={e => e.key === "Enter" && addSubtask()} style={{ flex: 1 }} />
              <button className="btn btn-ghost" onClick={addSubtask}><Icons.Plus />Add</button>
            </div>
          </div>
          {!isNew && (
            <div className="form-group">
              <label className="form-label">Time Logged</label>
              <input className="form-input" type="number" min="0" value={form.timeLogged} onChange={e => update("timeLogged", Number(e.target.value))} style={{ width: 120 }} />
              {form.timeEstimate > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <div className="time-bar"><div className="time-fill" style={{ width: `${Math.min((form.timeLogged / form.timeEstimate) * 100, 100)}%`, background: form.timeLogged > form.timeEstimate ? "var(--danger)" : "var(--accent)" }} /></div>
                  <span className="time-display" style={{ color: form.timeLogged > form.timeEstimate ? "var(--danger)" : "var(--text-secondary)" }}>{form.timeLogged}h / {form.timeEstimate}h</span>
                </div>
              )}
            </div>
          )}
          {!isNew && (
            <div className="form-group">
              <label className="form-label">Comments</label>
              {form.comments.map(c => {
                const u = TEAM_MEMBERS.find(m => m.id === c.userId);
                return (
                  <div key={c.id} className="comment-item">
                    {u && <Avatar user={u} size="sm" />}
                    <div>
                      <div className="comment-text">{c.text}</div>
                      <div className="comment-meta">{u?.name} · {new Date(c.time).toLocaleString()}</div>
                    </div>
                  </div>
                );
              })}
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <input className="form-input" value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Add a comment..." onKeyDown={e => e.key === "Enter" && addComment()} style={{ flex: 1 }} />
                <button className="btn btn-ghost" onClick={addComment}><Icons.Chat />Send</button>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          {!isNew && <button className="btn btn-danger" onClick={() => { onDelete(form.id); onClose(); }} style={{ marginRight: "auto" }}><Icons.Trash />Delete</button>}
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { if (!form.title.trim()) return; onSave({ ...form, id: form.id || generateId() }); onClose(); }}>{isNew ? "Create" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── VIEWS ───
function KanbanView({ tasks, onTaskClick, onUpdateTask }) {
  const [dragOverCol, setDragOverCol] = useState(null);

  const handleDrop = (e, colId) => {
    e.preventDefault();
    setDragOverCol(null);
    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== colId) {
      onUpdateTask({ ...task, status: colId });
    }
  };

  return (
    <div className="kanban">
      {COLUMNS.map(col => {
        const colTasks = tasks.filter(t => t.status === col.id);
        return (
          <div
            key={col.id}
            className={`kanban-column ${dragOverCol === col.id ? "drag-over" : ""}`}
            onDragOver={e => { e.preventDefault(); setDragOverCol(col.id); }}
            onDragLeave={() => setDragOverCol(null)}
            onDrop={e => handleDrop(e, col.id)}
          >
            <div className="kanban-header">
              <div className="col-dot" style={{ background: col.color }} />
              <h3>{col.title}</h3>
              <span className="col-count">{colTasks.length}</span>
            </div>
            <div className="kanban-cards">
              {colTasks.map(task => <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />)}
            </div>
            <div className="add-task-btn" onClick={() => onTaskClick({ status: col.id })}><Icons.Plus /> Add task</div>
          </div>
        );
      })}
    </div>
  );
}

function ListView({ tasks, onTaskClick, onUpdateTask }) {
  return (
    <div className="list-view">
      <div className="list-header">
        <span></span><span>Task</span><span>Project</span><span>Priority</span><span>Status</span><span>Assignees</span><span>Due</span>
      </div>
      {tasks.map(task => {
        const project = INITIAL_PROJECTS.find(p => p.id === task.projectId);
        const isDone = task.status === "done";
        return (
          <div key={task.id} className="list-row" onClick={() => onTaskClick(task)}>
            <div className={`list-check ${isDone ? "checked" : ""}`} onClick={e => { e.stopPropagation(); onUpdateTask({ ...task, status: isDone ? "todo" : "done" }); }}>
              {isDone && <Icons.Check />}
            </div>
            <div>
              <div style={{ fontWeight: 550, fontSize: 13, opacity: isDone ? 0.5 : 1, textDecoration: isDone ? 'line-through' : 'none' }}>{task.title}</div>
              <div className="tag-row" style={{ marginTop: 4 }}>
                {task.labels.map(l => <span key={l} className="tag" style={{ background: LABEL_COLORS[l]?.bg, color: LABEL_COLORS[l]?.color }}>{l}</span>)}
              </div>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{project?.icon} {project?.name}</div>
            <div><span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}><span className="priority-dot" style={{ background: PRIORITIES[task.priority]?.color }} />{PRIORITIES[task.priority]?.label}</span></div>
            <div><span className="tag" style={{ background: COLUMNS.find(c => c.id === task.status)?.color + '22', color: COLUMNS.find(c => c.id === task.status)?.color }}>{COLUMNS.find(c => c.id === task.status)?.title}</span></div>
            <div style={{ display: "flex" }}>
              {task.assignees.slice(0, 3).map(aId => { const u = TEAM_MEMBERS.find(m => m.id === aId); return u ? <Avatar key={aId} user={u} size="sm" /> : null; })}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "—"}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CalendarView({ tasks }) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1));
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const today = new Date();

  const days = [];
  for (let i = firstDay - 1; i >= 0; i--) days.push({ day: daysInPrev - i, otherMonth: true });
  for (let i = 1; i <= daysInMonth; i++) days.push({ day: i, otherMonth: false });
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) days.push({ day: i, otherMonth: true });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
        <button className="btn btn-ghost" onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>←</button>
        <h3 style={{ fontSize: 16, fontWeight: 600, minWidth: 160, textAlign: "center" }}>
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <button className="btn btn-ghost" onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>→</button>
      </div>
      <div className="calendar-grid">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d} className="calendar-day-header">{d}</div>)}
        {days.map((d, i) => {
          const dateStr = !d.otherMonth ? `${year}-${String(month+1).padStart(2,'0')}-${String(d.day).padStart(2,'0')}` : null;
          const dayTasks = dateStr ? tasks.filter(t => t.dueDate === dateStr) : [];
          const isToday = !d.otherMonth && d.day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          return (
            <div key={i} className={`calendar-day ${d.otherMonth ? "other-month" : ""} ${isToday ? "today" : ""}`}>
              <div className="day-num">{d.day}</div>
              {dayTasks.slice(0, 3).map(t => {
                const p = INITIAL_PROJECTS.find(p => p.id === t.projectId);
                return <div key={t.id} className="calendar-task" style={{ background: p?.color + '22', color: p?.color }}>{t.title}</div>;
              })}
              {dayTasks.length > 3 && <div style={{ fontSize: 10, color: "var(--text-muted)", paddingLeft: 6 }}>+{dayTasks.length - 3} more</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GanttView({ tasks }) {
  const activeTasks = tasks.filter(t => t.dueDate && t.createdAt);
  const startDate = new Date(2026, 2, 1);
  const endDate = new Date(2026, 3, 15);
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  const dayHeaders = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dayHeaders.push(new Date(d));
  }

  return (
    <div className="gantt-container">
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: 8 }}>
        <div style={{ width: 200, minWidth: 200, padding: "8px 12px", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Task</div>
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {dayHeaders.filter((_, i) => i % 3 === 0).map((d, i) => (
            <div key={i} style={{ flex: "0 0 " + (100 * 3 / totalDays) + "%", fontSize: 10, color: "var(--text-muted)", padding: "8px 4px", borderLeft: "1px solid var(--border)", fontFamily: "'JetBrains Mono', monospace" }}>
              {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          ))}
        </div>
      </div>
      {activeTasks.map(task => {
        const taskStart = new Date(task.createdAt);
        const taskEnd = new Date(task.dueDate);
        const left = Math.max(0, (taskStart - startDate) / (1000 * 60 * 60 * 24)) / totalDays * 100;
        const width = Math.max(2, (taskEnd - taskStart) / (1000 * 60 * 60 * 24)) / totalDays * 100;
        const project = INITIAL_PROJECTS.find(p => p.id === task.projectId);
        return (
          <div key={task.id} className="gantt-row">
            <div className="gantt-label">{task.title}</div>
            <div className="gantt-bar-area">
              <div className="gantt-bar" style={{ left: `${left}%`, width: `${width}%`, background: `linear-gradient(135deg, ${project?.color}cc, ${project?.color}88)` }}>
                {task.title}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── PROJECT PULSE (UNIQUE FEATURE) ───
function PulseView({ tasks }) {
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === "done").length;
  const inProgressTasks = tasks.filter(t => t.status === "in_progress").length;
  const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done").length;
  const blockedTasks = tasks.filter(t => t.status === "review").length;
  const totalPoints = tasks.reduce((s, t) => s + (t.storyPoints || 0), 0);
  const donePoints = tasks.filter(t => t.status === "done").reduce((s, t) => s + (t.storyPoints || 0), 0);
  const totalTimeEst = tasks.reduce((s, t) => s + (t.timeEstimate || 0), 0);
  const totalTimeLog = tasks.reduce((s, t) => s + (t.timeLogged || 0), 0);

  // Velocity: done points / total points × 100
  const velocity = totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0;
  // Health score: weighted combination
  const completionRate = totalTasks > 0 ? doneTasks / totalTasks : 0;
  const overdueRate = totalTasks > 0 ? overdueTasks / totalTasks : 0;
  const progressRate = totalTasks > 0 ? (doneTasks + inProgressTasks) / totalTasks : 0;
  const timeEfficiency = totalTimeEst > 0 ? Math.min(totalTimeLog / totalTimeEst, 1.5) : 0.5;
  const healthScore = Math.round(
    Math.max(0, Math.min(100,
      (completionRate * 35) + (progressRate * 25) + ((1 - overdueRate) * 25) + ((1 - Math.abs(1 - timeEfficiency)) * 15)
    ) * 100 / 100)
  );
  const pulseScore = Math.round(healthScore * 0.6 + velocity * 0.4);

  // Spark chart data (simulated daily velocity over 14 days)
  const sparkData = Array.from({ length: 14 }, (_, i) => {
    const base = pulseScore + (Math.sin(i * 0.7) * 15) + (i * 1.2);
    return Math.max(10, Math.min(100, Math.round(base + (Math.random() * 10 - 5))));
  });

  // Alerts
  const alerts = [];
  if (overdueTasks > 0) alerts.push({ type: "danger", icon: <Icons.AlertTriangle />, title: `${overdueTasks} overdue task${overdueTasks > 1 ? "s" : ""}`, desc: "These tasks have passed their due date and need immediate attention." });
  const urgentUndone = tasks.filter(t => t.priority === "urgent" && t.status !== "done");
  if (urgentUndone.length > 0) alerts.push({ type: "warning", icon: <Icons.Flag />, title: `${urgentUndone.length} urgent task${urgentUndone.length > 1 ? "s" : ""} pending`, desc: urgentUndone.map(t => t.title).join(", ") });
  if (blockedTasks > 1) alerts.push({ type: "info", icon: <Icons.Clock />, title: `${blockedTasks} tasks in review`, desc: "Multiple tasks awaiting review may indicate a bottleneck." });
  const unassigned = tasks.filter(t => t.assignees.length === 0 && t.status !== "done");
  if (unassigned.length > 0) alerts.push({ type: "muted", icon: <Icons.Team />, title: `${unassigned.length} unassigned task${unassigned.length > 1 ? "s" : ""}`, desc: "Tasks without assignees risk being overlooked." });

  // Team workload prediction
  const teamLoad = TEAM_MEMBERS.map(m => {
    const memberTasks = tasks.filter(t => t.assignees.includes(m.id) && t.status !== "done");
    const totalHrs = memberTasks.reduce((s, t) => s + (t.timeEstimate - t.timeLogged), 0);
    return { ...m, activeTasks: memberTasks.length, remainingHrs: Math.max(0, totalHrs), risk: totalHrs > 30 ? "high" : totalHrs > 15 ? "medium" : "low" };
  });

  const alertColors = { danger: { bg: "var(--danger-bg)", border: "rgba(255,107,107,0.3)", iconBg: "var(--danger-bg)" }, warning: { bg: "var(--warning-bg)", border: "rgba(253,203,110,0.3)", iconBg: "var(--warning-bg)" }, info: { bg: "var(--accent-glow)", border: "rgba(108,92,231,0.3)", iconBg: "var(--accent-glow)" }, muted: { bg: "rgba(85,85,106,0.1)", border: "rgba(85,85,106,0.2)", iconBg: "rgba(85,85,106,0.1)" } };

  return (
    <div className="pulse-container animate-in">
      <div className="pulse-hero">
        <div style={{ display: "flex", alignItems: "flex-end", gap: 24 }}>
          <div>
            <div className="pulse-score">{pulseScore}</div>
            <div className="pulse-label">Project Pulse Score</div>
          </div>
          <div style={{ flex: 1, paddingBottom: 8 }}>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>
              {pulseScore >= 70 ? "🟢 Projects are on track. Strong momentum across the board." : pulseScore >= 45 ? "🟡 Some areas need attention. Review overdue items and blockers." : "🔴 Projects need immediate intervention. Multiple risk factors detected."}
            </div>
            <div style={{ display: "flex", gap: 20, fontSize: 12, color: "var(--text-muted)" }}>
              <span>Health: {healthScore}%</span>
              <span>Velocity: {velocity}%</span>
              <span>Completion: {Math.round(completionRate * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pulse-grid">
        <div className="pulse-metric">
          <div className="metric-label">Completion Rate</div>
          <div className="metric-value" style={{ color: "var(--success)" }}>{doneTasks}/{totalTasks}</div>
          <div className="metric-change" style={{ color: "var(--success)" }}><Icons.TrendUp />{Math.round(completionRate * 100)}% done</div>
        </div>
        <div className="pulse-metric">
          <div className="metric-label">Story Points Burned</div>
          <div className="metric-value" style={{ color: "var(--accent-light)" }}>{donePoints}<span style={{ fontSize: 16, color: "var(--text-muted)" }}>/{totalPoints}</span></div>
          <div className="metric-change" style={{ color: "var(--accent-light)" }}><Icons.Zap />{velocity}% velocity</div>
        </div>
        <div className="pulse-metric">
          <div className="metric-label">Time Tracked</div>
          <div className="metric-value">{totalTimeLog}<span style={{ fontSize: 16, color: "var(--text-muted)" }}>h /{totalTimeEst}h</span></div>
          <div className="metric-change" style={{ color: totalTimeLog > totalTimeEst ? "var(--danger)" : "var(--text-secondary)" }}>
            {totalTimeEst > 0 ? Math.round((totalTimeLog / totalTimeEst) * 100) : 0}% of estimate
          </div>
        </div>
        <div className="pulse-metric">
          <div className="metric-label">At Risk</div>
          <div className="metric-value" style={{ color: overdueTasks > 0 ? "var(--danger)" : "var(--success)" }}>{overdueTasks}</div>
          <div className="metric-change" style={{ color: overdueTasks > 0 ? "var(--danger)" : "var(--success)" }}>
            {overdueTasks > 0 ? <><Icons.TrendDown />overdue tasks</> : <><Icons.TrendUp />no overdue</>}
          </div>
        </div>
      </div>

      <div className="pulse-chart-container">
        <div className="pulse-chart-title">Velocity Trend (14-day)</div>
        <div className="pulse-spark">
          {sparkData.map((v, i) => (
            <div
              key={i}
              className="pulse-spark-bar"
              style={{
                height: `${v}%`,
                background: v >= 65 ? "var(--success)" : v >= 40 ? "var(--warning)" : "var(--danger)",
                opacity: 0.6 + (i / 14) * 0.4,
              }}
              data-tooltip={`Day ${i + 1}: ${v}%`}
            />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 10, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
          <span>Mar 3</span><span>Mar 9</span><span>Mar 16</span>
        </div>
      </div>

      {alerts.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Icons.AlertTriangle /> Smart Alerts
          </h3>
          <div className="pulse-alerts">
            {alerts.map((a, i) => (
              <div key={i} className="pulse-alert" style={{ borderLeft: `3px solid ${alertColors[a.type]?.border}` }}>
                <div className="alert-icon" style={{ background: alertColors[a.type]?.iconBg, color: a.type === "danger" ? "var(--danger)" : a.type === "warning" ? "var(--warning)" : "var(--accent-light)" }}>{a.icon}</div>
                <div><div className="alert-title">{a.title}</div><div className="alert-desc">{a.desc}</div></div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <Icons.Team /> Team Workload Forecast
        </h3>
        <div className="team-grid">
          {teamLoad.map(m => (
            <div key={m.id} className="team-card">
              <div className="team-card-header">
                <Avatar user={m} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{m.role}</div>
                </div>
                <span style={{
                  marginLeft: "auto", fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 10,
                  background: m.risk === "high" ? "var(--danger-bg)" : m.risk === "medium" ? "var(--warning-bg)" : "var(--success-bg)",
                  color: m.risk === "high" ? "var(--danger)" : m.risk === "medium" ? "var(--warning)" : "var(--success)",
                }}>{m.risk === "high" ? "Overloaded" : m.risk === "medium" ? "Busy" : "Available"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-secondary)" }}>
                <span>{m.activeTasks} active tasks</span>
                <span className="time-display">{m.remainingHrs}h remaining</span>
              </div>
              <div className="workload-bar">
                <div className="workload-fill" style={{
                  width: `${Math.min((m.remainingHrs / 40) * 100, 100)}%`,
                  background: m.risk === "high" ? "var(--danger)" : m.risk === "medium" ? "var(--warning)" : "var(--success)",
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TeamView({ tasks }) {
  return (
    <div className="team-grid">
      {TEAM_MEMBERS.map(m => {
        const memberTasks = tasks.filter(t => t.assignees.includes(m.id));
        const doneTasks = memberTasks.filter(t => t.status === "done").length;
        const totalPoints = memberTasks.reduce((s, t) => s + (t.storyPoints || 0), 0);
        const totalHrs = memberTasks.reduce((s, t) => s + (t.timeLogged || 0), 0);
        return (
          <div key={m.id} className="team-card">
            <div className="team-card-header">
              <Avatar user={m} size="lg" />
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{m.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{m.role}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 12, textAlign: "center" }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{memberTasks.length}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Tasks</div>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: "var(--success)" }}>{doneTasks}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Done</div>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: "var(--accent-light)" }}>{totalPoints}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Points</div>
              </div>
            </div>
            <div className="workload-bar" style={{ marginTop: 12 }}>
              <div className="workload-fill" style={{ width: `${memberTasks.length > 0 ? (doneTasks / memberTasks.length) * 100 : 0}%`, background: "var(--success)" }} />
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6, fontFamily: "'JetBrains Mono', monospace" }}>{totalHrs}h logged</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN APP ───
export default function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [activeNav, setActiveNav] = useState("board");
  const [activeView, setActiveView] = useState("kanban");
  const [selectedProject, setSelectedProject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalTask, setModalTask] = useState(null);
  const [filterPriority, setFilterPriority] = useState("all");

  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    if (selectedProject !== "all") filtered = filtered.filter(t => t.projectId === selectedProject);
    if (filterPriority !== "all") filtered = filtered.filter(t => t.priority === filterPriority);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.labels.some(l => l.toLowerCase().includes(q)));
    }
    return filtered;
  }, [tasks, selectedProject, filterPriority, searchQuery]);

  const handleSaveTask = (task) => {
    setTasks(prev => {
      const exists = prev.find(t => t.id === task.id);
      if (exists) return prev.map(t => t.id === task.id ? task : t);
      return [...prev, task];
    });
  };
  const handleDeleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));
  const handleUpdateTask = (task) => setTasks(prev => prev.map(t => t.id === task.id ? task : t));

  const openNewTask = (defaults = {}) => setModalTask({ title: "", description: "", status: "todo", priority: "medium", projectId: selectedProject === "all" ? "p1" : selectedProject, assignees: [], labels: [], dueDate: "", subtasks: [], comments: [], timeLogged: 0, timeEstimate: 0, storyPoints: 0, createdAt: new Date().toISOString().slice(0, 10), ...defaults });

  const navItems = [
    { id: "board", label: "Board", icon: <Icons.Board />, count: null },
    { id: "pulse", label: "Project Pulse", icon: <Icons.Pulse />, count: null },
    { id: "team", label: "Team", icon: <Icons.Team />, count: TEAM_MEMBERS.length },
  ];

  const viewTabs = [
    { id: "kanban", label: "Kanban", icon: <Icons.Board /> },
    { id: "list", label: "List", icon: <Icons.List /> },
    { id: "calendar", label: "Calendar", icon: <Icons.Calendar /> },
    { id: "gantt", label: "Gantt", icon: <Icons.Gantt /> },
  ];

  const renderView = () => {
    if (activeNav === "pulse") return <PulseView tasks={tasks} />;
    if (activeNav === "team") return <TeamView tasks={filteredTasks} />;
    switch (activeView) {
      case "kanban": return <KanbanView tasks={filteredTasks} onTaskClick={setModalTask} onUpdateTask={handleUpdateTask} />;
      case "list": return <ListView tasks={filteredTasks} onTaskClick={setModalTask} onUpdateTask={handleUpdateTask} />;
      case "calendar": return <CalendarView tasks={filteredTasks} />;
      case "gantt": return <GanttView tasks={filteredTasks} />;
      default: return null;
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">⚡</div>
            <h1>FlowForge</h1>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Navigation</div>
            {navItems.map(item => (
              <div key={item.id} className={`sidebar-item ${activeNav === item.id ? "active" : ""}`} onClick={() => setActiveNav(item.id)}>
                {item.icon} {item.label}
                {item.count !== null && <span className="count">{item.count}</span>}
              </div>
            ))}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Projects</div>
            <div className={`sidebar-project ${selectedProject === "all" ? "active sidebar-item" : ""}`} onClick={() => { setSelectedProject("all"); setActiveNav("board"); }} style={{ fontWeight: selectedProject === "all" ? 600 : 400 }}>
              <span style={{ fontSize: 14 }}>📋</span> All Projects
              <span className="count" style={{ marginLeft: "auto" }}>{tasks.length}</span>
            </div>
            {INITIAL_PROJECTS.map(p => (
              <div key={p.id} className={`sidebar-project ${selectedProject === p.id ? "active sidebar-item" : ""}`} onClick={() => { setSelectedProject(p.id); setActiveNav("board"); }}>
                <div className="dot" style={{ background: p.color }} />
                {p.icon} {p.name}
                <span className="count" style={{ marginLeft: "auto" }}>{tasks.filter(t => t.projectId === p.id).length}</span>
              </div>
            ))}
          </div>

          <div className="sidebar-user">
            <Avatar user={TEAM_MEMBERS[0]} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{TEAM_MEMBERS[0].name}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{TEAM_MEMBERS[0].role}</div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main">
          <div className="topbar">
            <h2>{activeNav === "pulse" ? "⚡ Project Pulse" : activeNav === "team" ? "👥 Team" : selectedProject === "all" ? "All Projects" : INITIAL_PROJECTS.find(p => p.id === selectedProject)?.icon + " " + INITIAL_PROJECTS.find(p => p.id === selectedProject)?.name}</h2>

            {activeNav === "board" && (
              <div className="view-tabs">
                {viewTabs.map(v => (
                  <div key={v.id} className={`view-tab ${activeView === v.id ? "active" : ""}`} onClick={() => setActiveView(v.id)}>
                    {v.icon} {v.label}
                  </div>
                ))}
              </div>
            )}

            <div className="search-box">
              <Icons.Search />
              <input placeholder="Search tasks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>

            {activeNav === "board" && (
              <div className="filter-bar">
                <span style={{ color: "var(--text-muted)", fontSize: 12 }}><Icons.Filter /></span>
                {["all", ...Object.keys(PRIORITIES)].map(p => (
                  <span key={p} className={`filter-chip ${filterPriority === p ? "active" : ""}`} onClick={() => setFilterPriority(p)}>
                    {p === "all" ? "All" : PRIORITIES[p].label}
                  </span>
                ))}
              </div>
            )}

            {activeNav === "board" && (
              <button className="btn btn-primary" onClick={() => openNewTask()}>
                <Icons.Plus /> New Task
              </button>
            )}
          </div>

          <div className="content">
            {renderView()}
          </div>
        </main>

        {/* Modal */}
        {modalTask && (
          <TaskModal
            task={modalTask}
            onClose={() => setModalTask(null)}
            onSave={handleSaveTask}
            onDelete={handleDeleteTask}
          />
        )}
      </div>
    </>
  );
}
