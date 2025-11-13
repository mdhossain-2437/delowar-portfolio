import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ==================== USER & AUTH ====================

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("user"), // user, admin
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
});

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;

// ==================== PROJECTS ====================

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  techStack: text("tech_stack").array().notNull(),
  category: text("category").notNull(), // web, mobile, ai, backend, etc.
  featured: boolean("featured").notNull().default(false),
  status: text("status").notNull().default("completed"), // in-progress, completed, archived
  thumbnail: text("thumbnail"),
  images: text("images").array(),
  demoUrl: text("demo_url"),
  githubUrl: text("github_url"),
  caseStudyContent: text("case_study_content"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// ==================== BLOG ====================

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content"),
  mdxContent: text("mdx_content"),
  author: text("author").notNull(),
  publishedAt: timestamp("published_at"),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  featured: boolean("featured").notNull().default(false),
  coverImage: text("cover_image"),
  readingTime: integer("reading_time"), // in minutes
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  updatedAt: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export const blogTags = pgTable("blog_tags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  count: integer("count").notNull().default(0),
});

export const insertBlogTagSchema = createInsertSchema(blogTags).omit({
  id: true,
});

export type InsertBlogTag = z.infer<typeof insertBlogTagSchema>;
export type BlogTag = typeof blogTags.$inferSelect;

// ==================== SKILLS ====================

export const skills = pgTable("skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(), // frontend, backend, devops, tools
  proficiency: integer("proficiency").notNull(), // 1-100
  icon: text("icon"),
  order: integer("order").notNull().default(0),
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
});

export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skills.$inferSelect;

export const skillCategories = pgTable("skill_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  skills: text("skills").array().notNull().default(sql`ARRAY[]::text[]`), // array of skill IDs
  order: integer("order").notNull().default(0),
});

export const insertSkillCategorySchema = createInsertSchema(skillCategories).omit({
  id: true,
});

export type InsertSkillCategory = z.infer<typeof insertSkillCategorySchema>;
export type SkillCategory = typeof skillCategories.$inferSelect;

// ==================== CONTACT ====================

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  reason: text("reason").notNull(), // general, project, job, collaboration, etc.
  message: text("message").notNull(),
  attachedFile: text("attached_file"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  status: text("status").notNull().default("new"), // new, read, replied
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

// ==================== PLAYGROUND ====================

export const playgroundEntries = pgTable("playground_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  demoUrl: text("demo_url"),
  codeUrl: text("code_url"),
  thumbnail: text("thumbnail"),
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertPlaygroundEntrySchema = createInsertSchema(playgroundEntries).omit({
  id: true,
  createdAt: true,
});

export type InsertPlaygroundEntry = z.infer<typeof insertPlaygroundEntrySchema>;
export type PlaygroundEntry = typeof playgroundEntries.$inferSelect;

// ==================== RESUME ====================

export const resumeSections = pgTable("resume_sections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // experience, education, certification
  title: text("title").notNull(),
  organization: text("organization").notNull(),
  location: text("location"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  description: text("description").array().notNull().default(sql`ARRAY[]::text[]`),
  current: boolean("current").notNull().default(false),
});

export const insertResumeSectionSchema = createInsertSchema(resumeSections).omit({
  id: true,
});

export type InsertResumeSection = z.infer<typeof insertResumeSectionSchema>;
export type ResumeSection = typeof resumeSections.$inferSelect;

// ==================== SITE CONFIG ====================

export const siteConfig = pgTable("site_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  darkMode: boolean("dark_mode").notNull().default(true),
  language: text("language").notNull().default("en"),
  analyticsEnabled: boolean("analytics_enabled").notNull().default(false),
});

export const insertSiteConfigSchema = createInsertSchema(siteConfig).omit({
  id: true,
});

export type InsertSiteConfig = z.infer<typeof insertSiteConfigSchema>;
export type SiteConfig = typeof siteConfig.$inferSelect;

// ==================== TIMELINE & ACHIEVEMENTS ====================

export const timelineEvents = pgTable("timeline_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  year: integer("year").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // career, open_source, awards, life_events
  icon: text("icon"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertTimelineEventSchema = createInsertSchema(timelineEvents).omit({
  id: true,
  createdAt: true,
});

export type InsertTimelineEvent = z.infer<typeof insertTimelineEventSchema>;
export type TimelineEvent = typeof timelineEvents.$inferSelect;

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // github, leetcode, blog, manual
  icon: text("icon"),
  badge: text("badge"),
  value: text("value"), // e.g., "100+ Stars", "50 Problems Solved"
  source: text("source"), // github, leetcode, manual
  sourceUrl: text("source_url"),
  achievedAt: timestamp("achieved_at").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
});

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

// ==================== WORKSPACE: TASKS ====================

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("todo"), // todo, doing, done
  priority: text("priority").notNull().default("medium"), // low, medium, high
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  dueDate: timestamp("due_date"),
  recurring: boolean("recurring").notNull().default(false),
  recurringPattern: text("recurring_pattern"), // daily, weekly, monthly
  projectId: varchar("project_id").references(() => projects.id, { onDelete: "set null" }),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
}, (table) => ({
  userStatusIdx: index("tasks_user_status_idx").on(table.userId, table.status),
  userDueDateIdx: index("tasks_user_due_date_idx").on(table.userId, table.dueDate),
}));

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

// ==================== WORKSPACE: NOTES ====================

export const notes = pgTable("notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  folder: text("folder"), // Backend, DevOps, Interview, Ideas
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  isPinned: boolean("is_pinned").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;

// ==================== WORKSPACE: CODE SNIPPETS ====================

export const codeSnippets = pgTable("code_snippets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  code: text("code").notNull(),
  language: text("language").notNull(), // js, ts, python, etc.
  description: text("description"),
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  isFavorite: boolean("is_favorite").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertCodeSnippetSchema = createInsertSchema(codeSnippets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCodeSnippet = z.infer<typeof insertCodeSnippetSchema>;
export type CodeSnippet = typeof codeSnippets.$inferSelect;

// ==================== WORKSPACE: LEARNING ====================

export const learningItems = pgTable("learning_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  type: text("type").notNull(), // course, book, tutorial, video
  status: text("status").notNull().default("not_started"), // not_started, in_progress, completed
  progress: integer("progress").notNull().default(0), // 0-100
  url: text("url"),
  platform: text("platform"), // Udemy, YouTube, etc.
  notes: text("notes"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertLearningItemSchema = createInsertSchema(learningItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertLearningItem = z.infer<typeof insertLearningItemSchema>;
export type LearningItem = typeof learningItems.$inferSelect;

export const roadmapGoals = pgTable("roadmap_goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  timeframe: text("timeframe").notNull(), // short_term, long_term
  category: text("category").notNull(), // skill, project, certification
  status: text("status").notNull().default("planned"), // planned, in_progress, achieved
  targetDate: timestamp("target_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertRoadmapGoalSchema = createInsertSchema(roadmapGoals).omit({
  id: true,
  createdAt: true,
});

export type InsertRoadmapGoal = z.infer<typeof insertRoadmapGoalSchema>;
export type RoadmapGoal = typeof roadmapGoals.$inferSelect;

// ==================== WORKSPACE: TIME TRACKING ====================

export const timeEntries = pgTable("time_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  taskId: varchar("task_id").references(() => tasks.id, { onDelete: "set null" }),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: "set null" }),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  duration: integer("duration"), // in seconds
  isRunning: boolean("is_running").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
}, (table) => ({
  userStartTimeIdx: index("time_entries_user_start_time_idx").on(table.userId, table.startTime),
}));

export const insertTimeEntrySchema = createInsertSchema(timeEntries).omit({
  id: true,
  createdAt: true,
});

export type InsertTimeEntry = z.infer<typeof insertTimeEntrySchema>;
export type TimeEntry = typeof timeEntries.$inferSelect;

// ==================== WORKSPACE: HABITS ====================

export const habits = pgTable("habits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  frequency: text("frequency").notNull().default("daily"), // daily, weekly
  targetValue: integer("target_value").notNull().default(1),
  unit: text("unit"), // hours, pages, times
  color: text("color"),
  icon: text("icon"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
}, (table) => ({
  userIdIdx: index("habits_user_id_idx").on(table.userId),
}));

export const insertHabitSchema = createInsertSchema(habits).omit({
  id: true,
  createdAt: true,
});

export type InsertHabit = z.infer<typeof insertHabitSchema>;
export type Habit = typeof habits.$inferSelect;

export const habitLogs = pgTable("habit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  habitId: varchar("habit_id").notNull().references(() => habits.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  completed: boolean("completed").notNull().default(false),
  value: integer("value").notNull().default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
}, (table) => ({
  userDateIdx: index("habit_logs_user_date_idx").on(table.userId, table.date),
}));

export const insertHabitLogSchema = createInsertSchema(habitLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertHabitLog = z.infer<typeof insertHabitLogSchema>;
export type HabitLog = typeof habitLogs.$inferSelect;

// ==================== WORKSPACE: CALENDAR ====================

export const calendarEvents = pgTable("calendar_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // task_deadline, meeting, interview, event
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  allDay: boolean("all_day").notNull().default(false),
  location: text("location"),
  attendees: jsonb("attendees").notNull().default(sql`'[]'::jsonb`),
  taskId: varchar("task_id").references(() => tasks.id, { onDelete: "cascade" }),
  color: text("color"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
}, (table) => ({
  userStartTimeIdx: index("calendar_events_user_start_time_idx").on(table.userId, table.startTime),
}));

export const insertCalendarEventSchema = createInsertSchema(calendarEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCalendarEvent = z.infer<typeof insertCalendarEventSchema>;
export type CalendarEvent = typeof calendarEvents.$inferSelect;

// ==================== BUSINESS HUB: CLIENTS ====================

export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  company: text("company"),
  email: text("email").notNull(),
  phone: text("phone"),
  timezone: text("timezone"),
  address: text("address"),
  notes: text("notes"),
  status: text("status").notNull().default("active"), // active, inactive, archived
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

// ==================== BUSINESS HUB: PROPOSALS ====================

export const proposals = pgTable("proposals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  clientId: varchar("client_id").references(() => clients.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  scope: text("scope").notNull(),
  timeline: text("timeline").notNull(),
  pricing: text("pricing").notNull(),
  amount: integer("amount"), // in cents
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("draft"), // draft, sent, accepted, rejected
  pdfUrl: text("pdf_url"),
  sentAt: timestamp("sent_at"),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertProposalSchema = createInsertSchema(proposals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type Proposal = typeof proposals.$inferSelect;

// ==================== BUSINESS HUB: INVOICES ====================

export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  clientId: varchar("client_id").references(() => clients.id, { onDelete: "set null" }),
  invoiceNumber: text("invoice_number").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  items: jsonb("items").notNull(),
  subtotal: integer("subtotal").notNull(), // in cents
  tax: integer("tax").notNull().default(0), // in cents
  total: integer("total").notNull(), // in cents
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("draft"), // draft, sent, paid, overdue, cancelled
  paymentMethod: text("payment_method"), // PayPal, Wise, Bank, etc.
  paymentDate: timestamp("payment_date"),
  dueDate: timestamp("due_date"),
  sentAt: timestamp("sent_at"),
  pdfUrl: text("pdf_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
}, (table) => ({
  userStatusIdx: index("invoices_user_status_idx").on(table.userId, table.status),
}));

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;

// ==================== BUSINESS HUB: EXPENSES ====================

export const expenses = pgTable("expenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  amount: integer("amount").notNull(), // in cents
  currency: text("currency").notNull().default("USD"),
  category: text("category").notNull(), // subscription, course, domain, hosting, etc.
  recurring: boolean("recurring").notNull().default(false),
  recurringPattern: text("recurring_pattern"), // monthly, yearly
  date: timestamp("date").notNull(),
  receipt: text("receipt"), // URL to receipt image
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
  createdAt: true,
});

export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type Expense = typeof expenses.$inferSelect;

// ==================== BUSINESS HUB: INCOME ====================

export const incomeEntries = pgTable("income_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  amount: integer("amount").notNull(), // in cents
  currency: text("currency").notNull().default("USD"),
  source: text("source").notNull(), // salary, freelance, other
  invoiceId: varchar("invoice_id").references(() => invoices.id, { onDelete: "set null" }),
  date: timestamp("date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertIncomeEntrySchema = createInsertSchema(incomeEntries).omit({
  id: true,
  createdAt: true,
});

export type InsertIncomeEntry = z.infer<typeof insertIncomeEntrySchema>;
export type IncomeEntry = typeof incomeEntries.$inferSelect;

// ==================== TESTIMONIALS ====================

export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role").notNull(),
  company: text("company"),
  avatar: text("avatar"),
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5), // 1-5
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
});

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
