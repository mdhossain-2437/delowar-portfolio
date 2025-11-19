// server/index.ts
import "dotenv/config";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/dbStorage.ts
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { eq, and, desc, asc, or, sql as sql2 } from "drizzle-orm";
import bcrypt from "bcrypt";
import ws from "ws";

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("user")
  // user, admin
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true
});
var sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull()
});
var insertSessionSchema = createInsertSchema(sessions).omit({
  id: true
});
var projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  techStack: text("tech_stack").array().notNull(),
  category: text("category").notNull(),
  // web, mobile, ai, backend, etc.
  featured: boolean("featured").notNull().default(false),
  status: text("status").notNull().default("completed"),
  // in-progress, completed, archived
  thumbnail: text("thumbnail"),
  images: text("images").array(),
  demoUrl: text("demo_url"),
  githubUrl: text("github_url"),
  caseStudyContent: text("case_study_content"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
});
var insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var blogPosts = pgTable("blog_posts", {
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
  readingTime: integer("reading_time")
  // in minutes
});
var insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  updatedAt: true
});
var blogTags = pgTable("blog_tags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  count: integer("count").notNull().default(0)
});
var insertBlogTagSchema = createInsertSchema(blogTags).omit({
  id: true
});
var skills = pgTable("skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  // frontend, backend, devops, tools
  proficiency: integer("proficiency").notNull(),
  // 1-100
  icon: text("icon"),
  order: integer("order").notNull().default(0)
});
var insertSkillSchema = createInsertSchema(skills).omit({
  id: true
});
var skillCategories = pgTable("skill_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  skills: text("skills").array().notNull().default(sql`ARRAY[]::text[]`),
  // array of skill IDs
  order: integer("order").notNull().default(0)
});
var insertSkillCategorySchema = createInsertSchema(skillCategories).omit({
  id: true
});
var contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  reason: text("reason").notNull(),
  // general, project, job, collaboration, etc.
  subject: text("subject").notNull().default("General inquiry"),
  message: text("message").notNull(),
  attachedFile: text("attached_file"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  status: text("status").notNull().default("new"),
  // new, read, replied
  replyMessage: text("reply_message"),
  replySubject: text("reply_subject"),
  repliedAt: timestamp("replied_at"),
  responderEmail: text("responder_email")
});
var insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true
});
var guestbookEntries = pgTable("guestbook_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  githubId: text("github_id").notNull(),
  githubLogin: text("github_login").notNull(),
  githubName: text("github_name").notNull(),
  githubAvatar: text("github_avatar"),
  githubProfile: text("github_profile"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`)
});
var insertGuestbookEntrySchema = createInsertSchema(guestbookEntries).omit({
  id: true,
  createdAt: true
});
var playgroundEntries = pgTable("playground_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  demoUrl: text("demo_url"),
  codeUrl: text("code_url"),
  thumbnail: text("thumbnail"),
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  createdAt: timestamp("created_at").notNull().default(sql`now()`)
});
var insertPlaygroundEntrySchema = createInsertSchema(playgroundEntries).omit({
  id: true,
  createdAt: true
});
var resumeSections = pgTable("resume_sections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  // experience, education, certification
  title: text("title").notNull(),
  organization: text("organization").notNull(),
  location: text("location"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  description: text("description").array().notNull().default(sql`ARRAY[]::text[]`),
  current: boolean("current").notNull().default(false)
});
var insertResumeSectionSchema = createInsertSchema(resumeSections).omit({
  id: true
});
var siteConfig = pgTable("site_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  darkMode: boolean("dark_mode").notNull().default(true),
  language: text("language").notNull().default("en"),
  analyticsEnabled: boolean("analytics_enabled").notNull().default(false)
});
var insertSiteConfigSchema = createInsertSchema(siteConfig).omit({
  id: true
});
var timelineEvents = pgTable("timeline_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  year: integer("year").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  // career, open_source, awards, life_events
  icon: text("icon"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`)
});
var insertTimelineEventSchema = createInsertSchema(timelineEvents).omit({
  id: true,
  createdAt: true
});
var achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  // github, leetcode, blog, manual
  icon: text("icon"),
  badge: text("badge"),
  value: text("value"),
  // e.g., "100+ Stars", "50 Problems Solved"
  source: text("source"),
  // github, leetcode, manual
  sourceUrl: text("source_url"),
  achievedAt: timestamp("achieved_at").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`)
});
var insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true
});
var tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("todo"),
  // todo, doing, done
  priority: text("priority").notNull().default("medium"),
  // low, medium, high
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  dueDate: timestamp("due_date"),
  recurring: boolean("recurring").notNull().default(false),
  recurringPattern: text("recurring_pattern"),
  // daily, weekly, monthly
  projectId: varchar("project_id").references(() => projects.id, { onDelete: "set null" }),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
}, (table) => ({
  userStatusIdx: index("tasks_user_status_idx").on(table.userId, table.status),
  userDueDateIdx: index("tasks_user_due_date_idx").on(table.userId, table.dueDate)
}));
var insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var notes = pgTable("notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  folder: text("folder"),
  // Backend, DevOps, Interview, Ideas
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  isPinned: boolean("is_pinned").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
});
var insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var codeSnippets = pgTable("code_snippets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  code: text("code").notNull(),
  language: text("language").notNull(),
  // js, ts, python, etc.
  description: text("description"),
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  isFavorite: boolean("is_favorite").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
});
var insertCodeSnippetSchema = createInsertSchema(codeSnippets).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var learningItems = pgTable("learning_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  type: text("type").notNull(),
  // course, book, tutorial, video
  status: text("status").notNull().default("not_started"),
  // not_started, in_progress, completed
  progress: integer("progress").notNull().default(0),
  // 0-100
  url: text("url"),
  platform: text("platform"),
  // Udemy, YouTube, etc.
  notes: text("notes"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
});
var insertLearningItemSchema = createInsertSchema(learningItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var roadmapGoals = pgTable("roadmap_goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  timeframe: text("timeframe").notNull(),
  // short_term, long_term
  category: text("category").notNull(),
  // skill, project, certification
  status: text("status").notNull().default("planned"),
  // planned, in_progress, achieved
  targetDate: timestamp("target_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`)
});
var insertRoadmapGoalSchema = createInsertSchema(roadmapGoals).omit({
  id: true,
  createdAt: true
});
var timeEntries = pgTable("time_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  taskId: varchar("task_id").references(() => tasks.id, { onDelete: "set null" }),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: "set null" }),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  duration: integer("duration"),
  // in seconds
  isRunning: boolean("is_running").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`)
}, (table) => ({
  userStartTimeIdx: index("time_entries_user_start_time_idx").on(table.userId, table.startTime)
}));
var insertTimeEntrySchema = createInsertSchema(timeEntries).omit({
  id: true,
  createdAt: true
});
var habits = pgTable("habits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  frequency: text("frequency").notNull().default("daily"),
  // daily, weekly
  targetValue: integer("target_value").notNull().default(1),
  unit: text("unit"),
  // hours, pages, times
  color: text("color"),
  icon: text("icon"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`)
}, (table) => ({
  userIdIdx: index("habits_user_id_idx").on(table.userId)
}));
var insertHabitSchema = createInsertSchema(habits).omit({
  id: true,
  createdAt: true
});
var habitLogs = pgTable("habit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  habitId: varchar("habit_id").notNull().references(() => habits.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  completed: boolean("completed").notNull().default(false),
  value: integer("value").notNull().default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`)
}, (table) => ({
  userDateIdx: index("habit_logs_user_date_idx").on(table.userId, table.date)
}));
var insertHabitLogSchema = createInsertSchema(habitLogs).omit({
  id: true,
  createdAt: true
});
var calendarEvents = pgTable("calendar_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  // task_deadline, meeting, interview, event
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  allDay: boolean("all_day").notNull().default(false),
  location: text("location"),
  attendees: jsonb("attendees").notNull().default(sql`'[]'::jsonb`),
  taskId: varchar("task_id").references(() => tasks.id, { onDelete: "cascade" }),
  color: text("color"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
}, (table) => ({
  userStartTimeIdx: index("calendar_events_user_start_time_idx").on(table.userId, table.startTime)
}));
var insertCalendarEventSchema = createInsertSchema(calendarEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  company: text("company"),
  email: text("email").notNull(),
  phone: text("phone"),
  timezone: text("timezone"),
  address: text("address"),
  notes: text("notes"),
  status: text("status").notNull().default("active"),
  // active, inactive, archived
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
});
var insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var proposals = pgTable("proposals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  clientId: varchar("client_id").references(() => clients.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  scope: text("scope").notNull(),
  timeline: text("timeline").notNull(),
  pricing: text("pricing").notNull(),
  amount: integer("amount"),
  // in cents
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("draft"),
  // draft, sent, accepted, rejected
  pdfUrl: text("pdf_url"),
  sentAt: timestamp("sent_at"),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
});
var insertProposalSchema = createInsertSchema(proposals).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  clientId: varchar("client_id").references(() => clients.id, { onDelete: "set null" }),
  invoiceNumber: text("invoice_number").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  items: jsonb("items").notNull(),
  subtotal: integer("subtotal").notNull(),
  // in cents
  tax: integer("tax").notNull().default(0),
  // in cents
  total: integer("total").notNull(),
  // in cents
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("draft"),
  // draft, sent, paid, overdue, cancelled
  paymentMethod: text("payment_method"),
  // PayPal, Wise, Bank, etc.
  paymentDate: timestamp("payment_date"),
  dueDate: timestamp("due_date"),
  sentAt: timestamp("sent_at"),
  pdfUrl: text("pdf_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
}, (table) => ({
  userStatusIdx: index("invoices_user_status_idx").on(table.userId, table.status)
}));
var insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var expenses = pgTable("expenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  amount: integer("amount").notNull(),
  // in cents
  currency: text("currency").notNull().default("USD"),
  category: text("category").notNull(),
  // subscription, course, domain, hosting, etc.
  recurring: boolean("recurring").notNull().default(false),
  recurringPattern: text("recurring_pattern"),
  // monthly, yearly
  date: timestamp("date").notNull(),
  receipt: text("receipt"),
  // URL to receipt image
  createdAt: timestamp("created_at").notNull().default(sql`now()`)
});
var insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
  createdAt: true
});
var incomeEntries = pgTable("income_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  amount: integer("amount").notNull(),
  // in cents
  currency: text("currency").notNull().default("USD"),
  source: text("source").notNull(),
  // salary, freelance, other
  invoiceId: varchar("invoice_id").references(() => invoices.id, { onDelete: "set null" }),
  date: timestamp("date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`)
});
var insertIncomeEntrySchema = createInsertSchema(incomeEntries).omit({
  id: true,
  createdAt: true
});
var testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role").notNull(),
  company: text("company"),
  avatar: text("avatar"),
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5),
  // 1-5
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`)
});
var insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true
});

// server/dbStorage.ts
neonConfig.webSocketConstructor = ws;
var connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Provision the Neon serverless instance and set the environment variable before starting the server."
  );
}
var pool = new Pool({ connectionString });
var db = drizzle(pool);
var DbStorage = class {
  // ==================== USER METHODS ====================
  async getUserById(id) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }
  async getUserByUsername(username) {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }
  async insertUser(data) {
    const result = await db.insert(users).values(data).returning();
    return result[0];
  }
  // ==================== PROJECT METHODS ====================
  async getProjects(filters) {
    let query = db.select().from(projects);
    const conditions = [];
    if (filters?.category) {
      conditions.push(eq(projects.category, filters.category));
    }
    if (filters?.featured !== void 0) {
      conditions.push(eq(projects.featured, filters.featured));
    }
    if (filters?.status) {
      conditions.push(eq(projects.status, filters.status));
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    const result = await query.orderBy(desc(projects.createdAt));
    return result;
  }
  async getProjectBySlug(slug) {
    const result = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
    return result[0];
  }
  async insertProject(data) {
    const result = await db.insert(projects).values(data).returning();
    return result[0];
  }
  async updateProject(id, data) {
    const result = await db.update(projects).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(projects.id, id)).returning();
    if (!result[0]) throw new Error("Project not found");
    return result[0];
  }
  async deleteProject(id) {
    await db.delete(projects).where(eq(projects.id, id));
  }
  // ==================== BLOG METHODS ====================
  async getBlogPosts(filters) {
    let query = db.select().from(blogPosts);
    const conditions = [];
    if (filters?.tag) {
      conditions.push(sql2`${filters.tag} = ANY(${blogPosts.tags})`);
    }
    if (filters?.search) {
      const searchTerm = `%${filters.search.toLowerCase()}%`;
      conditions.push(
        or(
          sql2`LOWER(${blogPosts.title}) LIKE ${searchTerm}`,
          sql2`LOWER(${blogPosts.excerpt}) LIKE ${searchTerm}`
        )
      );
    }
    if (filters?.featured !== void 0) {
      conditions.push(eq(blogPosts.featured, filters.featured));
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    const result = await query.orderBy(desc(blogPosts.publishedAt));
    return result;
  }
  async getBlogPostBySlug(slug) {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    return result[0];
  }
  async insertBlogPost(data) {
    const result = await db.insert(blogPosts).values(data).returning();
    return result[0];
  }
  async updateBlogPost(id, data) {
    const result = await db.update(blogPosts).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(blogPosts.id, id)).returning();
    if (!result[0]) throw new Error("Blog post not found");
    return result[0];
  }
  async deleteBlogPost(id) {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }
  async getBlogTags() {
    return await db.select().from(blogTags);
  }
  // ==================== SKILL METHODS ====================
  async getSkills() {
    return await db.select().from(skills).orderBy(asc(skills.order));
  }
  async insertSkill(data) {
    const result = await db.insert(skills).values(data).returning();
    return result[0];
  }
  async updateSkill(id, data) {
    const result = await db.update(skills).set(data).where(eq(skills.id, id)).returning();
    if (!result[0]) throw new Error("Skill not found");
    return result[0];
  }
  async deleteSkill(id) {
    await db.delete(skills).where(eq(skills.id, id));
  }
  // ==================== TESTIMONIAL METHODS ====================
  async getTestimonials(filters) {
    let query = db.select().from(testimonials);
    if (filters?.featured !== void 0) {
      query = query.where(eq(testimonials.featured, filters.featured));
    }
    const result = await query.orderBy(desc(testimonials.createdAt));
    return result;
  }
  async insertTestimonial(data) {
    const result = await db.insert(testimonials).values(data).returning();
    return result[0];
  }
  async updateTestimonial(id, data) {
    const result = await db.update(testimonials).set(data).where(eq(testimonials.id, id)).returning();
    if (!result[0]) throw new Error("Testimonial not found");
    return result[0];
  }
  async deleteTestimonial(id) {
    await db.delete(testimonials).where(eq(testimonials.id, id));
  }
  // ==================== TIMELINE METHODS ====================
  async getTimelineEvents(filters) {
    let query = db.select().from(timelineEvents);
    if (filters?.category) {
      query = query.where(eq(timelineEvents.category, filters.category));
    }
    const result = await query.orderBy(desc(timelineEvents.year), asc(timelineEvents.order));
    return result;
  }
  async insertTimelineEvent(data) {
    const result = await db.insert(timelineEvents).values(data).returning();
    return result[0];
  }
  async updateTimelineEvent(id, data) {
    const result = await db.update(timelineEvents).set(data).where(eq(timelineEvents.id, id)).returning();
    if (!result[0]) throw new Error("Timeline event not found");
    return result[0];
  }
  async deleteTimelineEvent(id) {
    await db.delete(timelineEvents).where(eq(timelineEvents.id, id));
  }
  // ==================== ACHIEVEMENT METHODS ====================
  async getAchievements(filters) {
    let query = db.select().from(achievements);
    if (filters?.category) {
      query = query.where(eq(achievements.category, filters.category));
    }
    const result = await query.orderBy(desc(achievements.achievedAt));
    return result;
  }
  async insertAchievement(data) {
    const result = await db.insert(achievements).values(data).returning();
    return result[0];
  }
  // ==================== CONTACT METHODS ====================
  async insertContactMessage(data) {
    const result = await db.insert(contactMessages).values(data).returning();
    return result[0];
  }
  async getContactMessages() {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }
  async getContactMessageById(id) {
    const result = await db.select().from(contactMessages).where(eq(contactMessages.id, id)).limit(1);
    return result[0];
  }
  async updateContactMessage(id, data) {
    const result = await db.update(contactMessages).set(data).where(eq(contactMessages.id, id)).returning();
    if (!result[0]) throw new Error("Contact message not found");
    return result[0];
  }
  // ==================== GUESTBOOK METHODS ====================
  async insertGuestbookEntry(data) {
    const result = await db.insert(guestbookEntries).values(data).returning();
    return result[0];
  }
  async getGuestbookEntries(limit = 40) {
    return await db.select().from(guestbookEntries).orderBy(desc(guestbookEntries.createdAt)).limit(limit);
  }
  // ==================== WORKSPACE: TASK METHODS ====================
  async getTasks(userId, filters) {
    let query = db.select().from(tasks);
    const conditions = [eq(tasks.userId, userId)];
    if (filters?.status) {
      conditions.push(eq(tasks.status, filters.status));
    }
    if (filters?.priority) {
      conditions.push(eq(tasks.priority, filters.priority));
    }
    query = query.where(and(...conditions));
    const result = await query.orderBy(desc(tasks.createdAt));
    return result;
  }
  async insertTask(data) {
    const result = await db.insert(tasks).values(data).returning();
    return result[0];
  }
  async updateTask(id, userId, data) {
    const result = await db.update(tasks).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(and(eq(tasks.id, id), eq(tasks.userId, userId))).returning();
    if (!result[0]) throw new Error("Task not found");
    return result[0];
  }
  async deleteTask(id, userId) {
    const result = await db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId))).returning();
    if (!result[0]) throw new Error("Task not found");
  }
  // ==================== WORKSPACE: NOTE METHODS ====================
  async getNotes(userId) {
    return await db.select().from(notes).where(eq(notes.userId, userId)).orderBy(desc(notes.updatedAt));
  }
  async insertNote(data) {
    const result = await db.insert(notes).values(data).returning();
    return result[0];
  }
  async updateNote(id, userId, data) {
    const result = await db.update(notes).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(and(eq(notes.id, id), eq(notes.userId, userId))).returning();
    if (!result[0]) throw new Error("Note not found");
    return result[0];
  }
  async deleteNote(id, userId) {
    const result = await db.delete(notes).where(and(eq(notes.id, id), eq(notes.userId, userId))).returning();
    if (!result[0]) throw new Error("Note not found");
  }
  // ==================== WORKSPACE: CODE SNIPPET METHODS ====================
  async getCodeSnippets(userId) {
    return await db.select().from(codeSnippets).where(eq(codeSnippets.userId, userId)).orderBy(desc(codeSnippets.createdAt));
  }
  async insertCodeSnippet(data) {
    const result = await db.insert(codeSnippets).values(data).returning();
    return result[0];
  }
  // ==================== WORKSPACE: LEARNING METHODS ====================
  async getLearningItems(userId) {
    return await db.select().from(learningItems).where(eq(learningItems.userId, userId)).orderBy(desc(learningItems.createdAt));
  }
  async insertLearningItem(data) {
    const result = await db.insert(learningItems).values(data).returning();
    return result[0];
  }
  // ==================== WORKSPACE: TIME TRACKING METHODS ====================
  async getTimeEntries(userId) {
    return await db.select().from(timeEntries).where(eq(timeEntries.userId, userId)).orderBy(desc(timeEntries.startTime));
  }
  async startTimeEntry(data) {
    const result = await db.insert(timeEntries).values({ ...data, startTime: /* @__PURE__ */ new Date(), isRunning: true }).returning();
    return result[0];
  }
  async stopTimeEntry(id, userId) {
    const existing = await db.select().from(timeEntries).where(and(eq(timeEntries.id, id), eq(timeEntries.userId, userId))).limit(1);
    if (!existing[0]) throw new Error("Time entry not found");
    const endTime = /* @__PURE__ */ new Date();
    const duration = Math.floor((endTime.getTime() - new Date(existing[0].startTime).getTime()) / 1e3);
    const result = await db.update(timeEntries).set({ endTime, duration, isRunning: false }).where(eq(timeEntries.id, id)).returning();
    return result[0];
  }
  // ==================== WORKSPACE: HABIT METHODS ====================
  async getHabits(userId) {
    return await db.select().from(habits).where(eq(habits.userId, userId)).orderBy(desc(habits.createdAt));
  }
  async insertHabit(data) {
    const result = await db.insert(habits).values(data).returning();
    return result[0];
  }
  async logHabit(data) {
    const result = await db.insert(habitLogs).values(data).returning();
    return result[0];
  }
  // ==================== WORKSPACE: CALENDAR METHODS ====================
  async getCalendarEvents(userId) {
    return await db.select().from(calendarEvents).where(eq(calendarEvents.userId, userId)).orderBy(asc(calendarEvents.startTime));
  }
  async insertCalendarEvent(data) {
    const result = await db.insert(calendarEvents).values(data).returning();
    return result[0];
  }
  // ==================== BUSINESS: CLIENT METHODS ====================
  async getClients(userId) {
    return await db.select().from(clients).where(eq(clients.userId, userId)).orderBy(desc(clients.createdAt));
  }
  async insertClient(data) {
    const result = await db.insert(clients).values(data).returning();
    return result[0];
  }
  // ==================== BUSINESS: PROPOSAL METHODS ====================
  async getProposals(userId) {
    return await db.select().from(proposals).where(eq(proposals.userId, userId)).orderBy(desc(proposals.createdAt));
  }
  async insertProposal(data) {
    const result = await db.insert(proposals).values(data).returning();
    return result[0];
  }
  // ==================== BUSINESS: INVOICE METHODS ====================
  async getInvoices(userId) {
    return await db.select().from(invoices).where(eq(invoices.userId, userId)).orderBy(desc(invoices.createdAt));
  }
  async insertInvoice(data) {
    const result = await db.insert(invoices).values(data).returning();
    return result[0];
  }
  // ==================== BUSINESS: FINANCE METHODS ====================
  async getFinanceOverview(userId) {
    const allInvoices = await db.select().from(invoices).where(eq(invoices.userId, userId));
    const allExpenses = await db.select().from(expenses).where(eq(expenses.userId, userId));
    const allIncome = await db.select().from(incomeEntries).where(eq(incomeEntries.userId, userId));
    const totalIncome = allIncome.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = allExpenses.reduce((sum, e) => sum + e.amount, 0);
    const profit = totalIncome - totalExpenses;
    return {
      totalIncome,
      totalExpenses,
      profit,
      paidInvoices: allInvoices.filter((i) => i.status === "paid").length,
      pendingInvoices: allInvoices.filter((i) => i.status === "sent").length
    };
  }
  async getExpenses(userId) {
    return await db.select().from(expenses).where(eq(expenses.userId, userId)).orderBy(desc(expenses.date));
  }
  async insertExpense(data) {
    const result = await db.insert(expenses).values(data).returning();
    return result[0];
  }
  async getIncomeEntries(userId) {
    return await db.select().from(incomeEntries).where(eq(incomeEntries.userId, userId)).orderBy(desc(incomeEntries.date));
  }
  async insertIncomeEntry(data) {
    const result = await db.insert(incomeEntries).values(data).returning();
    return result[0];
  }
  // ==================== RESUME METHODS ====================
  async getResumeSections() {
    return await db.select().from(resumeSections).orderBy(desc(resumeSections.startDate));
  }
  async insertResumeSection(data) {
    const result = await db.insert(resumeSections).values(data).returning();
    return result[0];
  }
  // ==================== PLAYGROUND METHODS ====================
  async getPlaygroundEntries() {
    return await db.select().from(playgroundEntries).orderBy(desc(playgroundEntries.createdAt));
  }
  async insertPlaygroundEntry(data) {
    const result = await db.insert(playgroundEntries).values(data).returning();
    return result[0];
  }
  // ==================== SEED DATA ====================
  async seedDatabase() {
    try {
      console.log("\u{1F331} Starting database seed...");
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const [adminUser] = await db.insert(users).values({
        username: "admin",
        password: hashedPassword,
        email: "admin@portfolio.com",
        name: "Delowar Hossain",
        role: "admin"
      }).onConflictDoNothing().returning();
      if (adminUser) {
        console.log("\u2705 Admin user created");
      }
      await db.insert(projects).values([
        {
          title: "AI Coding Agent",
          slug: "ai-coding-agent",
          description: "An intelligent coding assistant powered by GPT-4 that helps developers write better code",
          longDescription: "Built a comprehensive AI coding agent that understands context, suggests improvements, and generates code snippets. Integrated with VS Code and supports multiple programming languages.",
          techStack: ["TypeScript", "OpenAI GPT-4", "Node.js", "VS Code API"],
          category: "ai",
          featured: true,
          status: "completed",
          thumbnail: "/attached_assets/generated_images/AI_Coding_Agent_visualization_292c3380.png",
          githubUrl: "https://github.com/delowar/ai-coding-agent",
          demoUrl: "https://ai-agent-demo.com"
        },
        {
          title: "E-Commerce Platform",
          slug: "ecommerce-platform",
          description: "Full-stack e-commerce solution with payment integration and admin dashboard",
          longDescription: "Developed a modern e-commerce platform with React, Node.js, and PostgreSQL. Features include product management, shopping cart, payment processing with Stripe, and comprehensive admin panel.",
          techStack: ["React", "Node.js", "PostgreSQL", "Stripe", "Redis"],
          category: "web",
          featured: true,
          status: "completed",
          githubUrl: "https://github.com/delowar/ecommerce-platform"
        },
        {
          title: "Task Management App",
          slug: "task-management-app",
          description: "Collaborative task management tool with real-time updates",
          techStack: ["Vue.js", "Firebase", "Tailwind CSS"],
          category: "web",
          featured: false,
          status: "completed"
        },
        {
          title: "Weather Forecasting API",
          slug: "weather-api",
          description: "RESTful API for weather data with caching and rate limiting",
          techStack: ["Python", "FastAPI", "Redis", "PostgreSQL"],
          category: "backend",
          featured: false,
          status: "in-progress"
        },
        {
          title: "Mobile Banking App",
          slug: "mobile-banking",
          description: "Secure mobile banking application with biometric authentication",
          techStack: ["React Native", "Node.js", "MongoDB", "Plaid API"],
          category: "mobile",
          featured: true,
          status: "completed"
        }
      ]).onConflictDoNothing();
      console.log("\u2705 Projects seeded");
      await db.insert(blogPosts).values([
        {
          title: "Building Scalable APIs with Node.js",
          slug: "building-scalable-apis-nodejs",
          excerpt: "Learn best practices for building production-ready APIs that can handle millions of requests",
          content: "In this comprehensive guide, we'll explore the architecture patterns and tools needed to build APIs that scale...",
          author: "Delowar Hossain",
          publishedAt: /* @__PURE__ */ new Date("2024-11-01"),
          tags: ["Node.js", "API", "Backend", "Performance"],
          featured: true,
          readingTime: 12
        },
        {
          title: "React Performance Optimization Tips",
          slug: "react-performance-optimization",
          excerpt: "Practical techniques to make your React applications lightning fast",
          content: "React is fast by default, but there are many ways to make it even faster. Let's dive into memoization, lazy loading, and more...",
          author: "Delowar Hossain",
          publishedAt: /* @__PURE__ */ new Date("2024-10-15"),
          tags: ["React", "Performance", "Frontend"],
          featured: true,
          readingTime: 8
        },
        {
          title: "Getting Started with PostgreSQL",
          slug: "getting-started-postgresql",
          excerpt: "A beginner's guide to the world's most advanced open-source database",
          content: "PostgreSQL is a powerful, open-source relational database. In this tutorial, we'll cover installation, basic queries, and schema design...",
          author: "Delowar Hossain",
          publishedAt: /* @__PURE__ */ new Date("2024-09-20"),
          tags: ["PostgreSQL", "Database", "SQL"],
          featured: false,
          readingTime: 15
        }
      ]).onConflictDoNothing();
      console.log("\u2705 Blog posts seeded");
      await db.insert(skills).values([
        { name: "JavaScript", category: "frontend", proficiency: 95, icon: "SiJavascript", order: 1 },
        { name: "TypeScript", category: "frontend", proficiency: 90, icon: "SiTypescript", order: 2 },
        { name: "React", category: "frontend", proficiency: 92, icon: "SiReact", order: 3 },
        { name: "Node.js", category: "backend", proficiency: 88, icon: "SiNodedotjs", order: 4 },
        { name: "PostgreSQL", category: "backend", proficiency: 85, icon: "SiPostgresql", order: 5 },
        { name: "Python", category: "backend", proficiency: 82, icon: "SiPython", order: 6 },
        { name: "Docker", category: "devops", proficiency: 78, icon: "SiDocker", order: 7 },
        { name: "Git", category: "tools", proficiency: 90, icon: "SiGit", order: 8 },
        { name: "Tailwind CSS", category: "frontend", proficiency: 87, icon: "SiTailwindcss", order: 9 },
        { name: "MongoDB", category: "backend", proficiency: 80, icon: "SiMongodb", order: 10 }
      ]).onConflictDoNothing();
      console.log("\u2705 Skills seeded");
      await db.insert(timelineEvents).values([
        {
          year: 2024,
          title: "Senior Full-Stack Developer",
          description: "Leading development of enterprise applications at TechCorp",
          category: "career",
          icon: "Briefcase",
          order: 1
        },
        {
          year: 2023,
          title: "Open Source Contributor",
          description: "Contributed to major open-source projects including React and Node.js",
          category: "open_source",
          icon: "Github",
          order: 1
        },
        {
          year: 2022,
          title: "Full-Stack Developer",
          description: "Built scalable web applications using modern technologies",
          category: "career",
          icon: "Code",
          order: 1
        }
      ]).onConflictDoNothing();
      console.log("\u2705 Timeline events seeded");
      await db.insert(testimonials).values([
        {
          name: "Sarah Johnson",
          role: "Product Manager",
          company: "TechCorp",
          content: "Delowar is an exceptional developer who consistently delivers high-quality work. His attention to detail and problem-solving skills are outstanding.",
          rating: 5,
          featured: true
        },
        {
          name: "Michael Chen",
          role: "CTO",
          company: "StartupXYZ",
          content: "Working with Delowar was a pleasure. He transformed our vision into reality with clean, maintainable code.",
          rating: 5,
          featured: true
        }
      ]).onConflictDoNothing();
      console.log("\u2705 Testimonials seeded");
      console.log("\u{1F389} Database seeding completed successfully!");
    } catch (error) {
      console.error("\u274C Error seeding database:", error);
      throw error;
    }
  }
};
var storage = new DbStorage();

// server/routes.ts
import { randomUUID } from "crypto";

// server/services/digitalGarden.ts
var NOTION_BASE_URL = "https://api.notion.com/v1";
var NOTION_VERSION = "2022-06-28";
var fallbackGarden = [
  {
    id: "mock-automation",
    title: "Automation Blueprints",
    summary: "Notes from building multi-surface automation between Notion, Linear, and GitHub Actions to keep client workspaces in sync.",
    tags: ["automation", "systems thinking"],
    url: "https://www.notion.so/",
    lastSynced: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "mock-ux-writing",
    title: "UX Story Beats",
    summary: "Progress log on weaving storytelling into scroll experiences. Covers GSAP timelines, progressive disclosure, and measuring engagement.",
    tags: ["ux", "motion"],
    url: "https://www.notion.so/",
    lastSynced: (/* @__PURE__ */ new Date()).toISOString()
  }
];
var parseRichText = (richText) => richText?.map((t) => t.plain_text).join("") ?? "";
var parseTitle = (title) => parseRichText(title?.[0]?.plain_text ? [title[0]] : title);
async function fetchGardenEntries() {
  const token = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!token || !databaseId) {
    return fallbackGarden;
  }
  try {
    const response = await fetch(`${NOTION_BASE_URL}/databases/${databaseId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        page_size: 10,
        sorts: [{ property: "Last updated", direction: "descending" }]
      })
    });
    if (!response.ok) {
      throw new Error(`Notion API error: ${response.status}`);
    }
    const data = await response.json();
    return data.results.map((page) => {
      const properties = page.properties ?? {};
      const titleProp = properties.Name ?? properties.title;
      const tags = (properties.Tags?.multi_select ?? []).map((tag) => tag.name);
      return {
        id: page.id,
        title: parseTitle(titleProp?.title ?? []),
        summary: parseRichText(properties.Summary?.rich_text ?? []),
        url: page.url,
        tags,
        lastSynced: page.last_edited_time
      };
    });
  } catch (error) {
    console.warn("Notion fetch failed, falling back to mock entries:", error);
    return fallbackGarden;
  }
}

// server/routes.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import bcrypt2 from "bcrypt";
import { z } from "zod";

// server/services/mailer.ts
import { Resend } from "resend";

// server/config.ts
var appConfig = {
  contactInboxEmail: process.env.CONTACT_INBOX_EMAIL || "mdhossain2437@gmail.com",
  resendApiKey: process.env.RESEND_API_KEY || "",
  emailSender: process.env.MAIL_FROM || "Delowar Hossain <portfolio@notifications.delowar.dev>",
  profile: {
    name: process.env.PORTFOLIO_NAME || "Delowar Hossain",
    title: process.env.PORTFOLIO_TITLE || "Product Engineer & AI Explorer",
    location: process.env.PORTFOLIO_LOCATION || "Dhaka, Bangladesh",
    timezone: process.env.PORTFOLIO_TIMEZONE || "GMT+6",
    bio: process.env.PORTFOLIO_BIO || "Shipping expressive web/AI products, automations, and developer tools for ambitious teams.",
    availability: process.env.PORTFOLIO_AVAILABILITY || "Open for freelance & consulting",
    avatar: process.env.PORTFOLIO_AVATAR || "https://avatars.githubusercontent.com/u/97281919?v=4",
    socials: {
      github: "https://github.com/mdhossain-2437",
      linkedin: "https://www.linkedin.com/in/mdhossain2437/",
      twitter: "https://twitter.com/mdhossain2437"
    }
  },
  publicApiBase: process.env.PUBLIC_API_BASE || process.env.PUBLIC_SITE_URL || "http://localhost:5000",
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || "",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n") : "",
    adminEmails: process.env.FIREBASE_ADMIN_EMAILS ? process.env.FIREBASE_ADMIN_EMAILS.split(",").map(
      (email) => email.trim().toLowerCase()
    ) : ["mdhossain2437@gmail.com"]
  }
};

// server/services/mailer.ts
var resend = appConfig.resendApiKey !== "" ? new Resend(appConfig.resendApiKey) : void 0;
async function sendContactNotification(payload) {
  if (!resend) {
    console.warn("Resend API key missing. Skipping email notification.");
    return;
  }
  try {
    await resend.emails.send({
      from: appConfig.emailSender,
      to: appConfig.contactInboxEmail,
      subject: `Portfolio contact from ${payload.name}: ${payload.subject}`,
      text: [
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        `Subject: ${payload.subject}`,
        "",
        payload.message
      ].join("\n")
    });
  } catch (error) {
    console.error("Failed to send contact notification:", error);
  }
}

// server/swagger.ts
import swaggerUi from "swagger-ui-express";
var servers = [
  {
    url: appConfig.publicApiBase.replace(/\/$/, ""),
    description: "Production / canonical"
  },
  {
    url: "http://localhost:5000",
    description: "Local development"
  }
];
var swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Delowar Portfolio API",
    version: "1.0.0",
    description: "Public API surface that mirrors the portfolio content. Designed for demos, hackable dashboards, and DX inspiration.",
    contact: {
      name: appConfig.profile.name,
      url: appConfig.profile.socials.linkedin
    }
  },
  servers,
  paths: {
    "/api/public/profile": {
      get: {
        summary: "Get profile",
        description: "Returns the public profile/bio JSON.",
        responses: {
          "200": {
            description: "Profile payload",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    title: { type: "string" },
                    bio: { type: "string" },
                    location: { type: "string" },
                    timezone: { type: "string" },
                    availability: { type: "string" },
                    socials: {
                      type: "object",
                      additionalProperties: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/public/projects": {
      get: {
        summary: "List projects",
        parameters: [
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 25 }
          }
        ],
        responses: {
          "200": {
            description: "Array of projects",
            content: {
              "application/json": {
                schema: { type: "array", items: { type: "object" } }
              }
            }
          }
        }
      }
    },
    "/api/og": {
      get: {
        summary: "Generate OG image",
        parameters: [
          {
            name: "title",
            in: "query",
            schema: { type: "string" }
          },
          {
            name: "highlight",
            in: "query",
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": {
            description: "SVG OG card",
            content: {
              "image/svg+xml": {}
            }
          }
        }
      }
    }
  }
};
function mountSwagger(app2) {
  app2.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// server/services/webauthnMemory.ts
import crypto from "crypto";
var challengeStore = /* @__PURE__ */ new Map();
function createChallenge(userId) {
  const challenge = crypto.randomBytes(32).toString("base64url");
  challengeStore.set(userId, challenge);
  return challenge;
}
function verifyChallenge(userId, challenge) {
  const stored = challengeStore.get(userId);
  if (!stored) return false;
  const ok = stored === challenge;
  if (ok) {
    challengeStore.delete(userId);
  }
  return ok;
}

// server/security.ts
import helmet from "helmet";
var PROD_CSP = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
    imgSrc: ["'self'", "data:", "https://*"],
    connectSrc: ["'self'", "https://api.delowarhossain.dev", "https://*.ingest.sentry.io"],
    frameSrc: ["'self'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: []
  }
};
var DEV_CSP = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'", "http://localhost:5000"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    fontSrc: ["'self'", "data:"],
    imgSrc: ["'self'", "data:", "blob:"],
    connectSrc: ["'self'", "ws://localhost:5000", "http://localhost:5000"],
    frameSrc: ["'self'"],
    objectSrc: ["'none'"]
  }
};
var profile;
function applySecurity(app2) {
  const isProduction = app2.get("env") === "production";
  app2.disable("x-powered-by");
  const csp = isProduction ? PROD_CSP : DEV_CSP;
  profile = {
    mode: isProduction ? "production" : "development",
    csp,
    hstsEnabled: Boolean(isProduction)
  };
  app2.use(
    helmet({
      contentSecurityPolicy: csp,
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
      crossOriginResourcePolicy: { policy: "same-origin" },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      dnsPrefetchControl: { allow: false },
      frameguard: { action: "deny" },
      hsts: isProduction ? {
        maxAge: 60 * 60 * 24 * 365,
        includeSubDomains: true,
        preload: true
      } : false,
      permittedCrossDomainPolicies: { permittedPolicies: "none" }
    })
  );
  app2.use((_req, res, next) => {
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-DNS-Prefetch-Control", "off");
    next();
  });
}
function getSecurityProfile() {
  return profile;
}

// server/routes.ts
var parseBooleanQuery = (value) => typeof value === "string" ? value === "true" : void 0;
var parseStringQuery = (value) => typeof value === "string" && value.length > 0 ? value : void 0;
var contactMessageSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  subject: z.string().min(2).max(150).default("General inquiry"),
  message: z.string().min(10).max(2e3),
  reason: z.string().optional()
});
var newsletterSchema = z.object({
  email: z.string().email(),
  source: z.string().optional()
});
var bugReportSchema = z.object({
  message: z.string().min(6).max(2e3),
  steps: z.string().max(500).optional(),
  screenshot: z.string().max(2e6).optional()
});
var guestbookMessageSchema = z.object({
  message: z.string().min(4).max(360)
});
var defaultGithubCallback = (() => {
  try {
    if (!process.env.PUBLIC_SITE_URL) return "";
    return new URL("/api/auth/github/callback", process.env.PUBLIC_SITE_URL).toString();
  } catch {
    return "";
  }
})();
var githubConfig = {
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackUrl: process.env.GITHUB_CALLBACK_URL || defaultGithubCallback
};
var isGithubAuthConfigured = () => Boolean(githubConfig.clientId && githubConfig.clientSecret && githubConfig.callbackUrl);
var openWeatherKey = process.env.OPENWEATHER_API_KEY;
var getPublicProfile = () => ({
  ...appConfig.profile,
  updatedAt: (/* @__PURE__ */ new Date()).toISOString()
});
var githubUsername = process.env.GITHUB_USERNAME || "mdhossain-2437";
var experienceStartYear = parseInt(process.env.EXPERIENCE_START_YEAR || "2017", 10);
var siteLaunchedAt = new Date(process.env.SITE_LAUNCHED_AT || "2021-01-01");
var ogViewCounter = 42e3;
var buildOgSvg = (title, highlight, secondary) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop stop-color="#7c3aed" offset="0%"/>
      <stop stop-color="#0ea5e9" offset="100%"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#020617"/>
  <rect x="40" y="40" width="1120" height="550" rx="32" fill="url(#g)" opacity="0.08"/>
  <text x="80" y="180" font-family="Inter, sans-serif" font-size="64" fill="#e2e8f0">${title}</text>
  <text x="80" y="260" font-family="Inter, sans-serif" font-size="42" fill="#cbd5f5">${highlight}</text>
  <text x="80" y="330" font-family="Inter, sans-serif" font-size="28" fill="#94a3b8">${secondary}</text>
  <text x="80" y="520" font-family="Inter, sans-serif" font-size="24" fill="#f1f5f9">api: ${appConfig.publicApiBase.replace(/^https?:\/\//, "")}</text>
  <text x="80" y="560" font-family="Inter, sans-serif" font-size="20" fill="#94a3b8">views: ${ogViewCounter.toLocaleString()}</text>
</svg>`;
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}
function requireUser(req) {
  if (!req.user) {
    throw new Error("Authenticated user not found on request object");
  }
  return req.user;
}
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Forbidden - Admin access required" });
}
async function registerRoutes(app2) {
  mountSwagger(app2);
  app2.use(
    session({
      secret: process.env.SESSION_SECRET || "portfolio-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1e3
        // 7 days
      }
    })
  );
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Invalid credentials" });
        }
        const isValid = await bcrypt2.compare(password, user.password);
        if (!isValid) {
          return done(null, false, { message: "Invalid credentials" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUserById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password, email, name } = req.body;
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const hashedPassword = await bcrypt2.hash(password, 10);
      const user = await storage.insertUser({
        username,
        password: hashedPassword,
        email,
        name,
        role: "user"
      });
      res.json({ success: true, user: { id: user.id, username: user.username, name: user.name } });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    const user = requireUser(req);
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role
      }
    });
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });
  app2.get("/api/auth/me", isAuthenticated, (req, res) => {
    const user = requireUser(req);
    res.json({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role
      }
    });
  });
  app2.get("/api/projects", async (req, res) => {
    try {
      const { category, featured, status } = req.query;
      const projects2 = await storage.getProjects({
        category: parseStringQuery(category),
        featured: parseBooleanQuery(featured),
        status: parseStringQuery(status)
      });
      res.json(projects2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/projects/:slug", async (req, res) => {
    try {
      const project = await storage.getProjectBySlug(req.params.slug);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/projects", isAdmin, async (req, res) => {
    try {
      const project = await storage.insertProject(req.body);
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.put("/api/projects/:id", isAdmin, async (req, res) => {
    try {
      const project = await storage.updateProject(req.params.id, req.body);
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.delete("/api/projects/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteProject(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/blog", async (req, res) => {
    try {
      const { tag, search, featured } = req.query;
      const posts = await storage.getBlogPosts({
        tag: parseStringQuery(tag),
        search: parseStringQuery(search),
        featured: parseBooleanQuery(featured)
      });
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/blog", isAdmin, async (req, res) => {
    try {
      const post = await storage.insertBlogPost(req.body);
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.put("/api/blog/:id", isAdmin, async (req, res) => {
    try {
      const post = await storage.updateBlogPost(req.params.id, req.body);
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.delete("/api/blog/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteBlogPost(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/blog/tags", async (req, res) => {
    try {
      const tags = await storage.getBlogTags();
      res.json(tags);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/public/profile", (_req, res) => {
    res.json(getPublicProfile());
  });
  app2.get("/api/public/projects", async (req, res) => {
    try {
      const limit = Math.min(
        25,
        Math.max(1, parseInt(req.query.limit || "12", 10) || 12)
      );
      const projects2 = await storage.getProjects();
      res.json(projects2.slice(0, limit));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/og", (req, res) => {
    ogViewCounter++;
    const title = typeof req.query.title === "string" && req.query.title || appConfig.profile.name;
    const highlight = typeof req.query.highlight === "string" && req.query.highlight || `Latest commit-ready build \u2022 ${(/* @__PURE__ */ new Date()).toLocaleDateString()}`;
    const secondary = typeof req.query.secondary === "string" && req.query.secondary || appConfig.profile.title;
    const svg = buildOgSvg(title, highlight, secondary);
    res.setHeader("Content-Type", "image/svg+xml");
    res.send(svg);
  });
  app2.get("/api/garden", async (_req, res) => {
    try {
      const entries = await fetchGardenEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/stats", async (_req, res) => {
    try {
      const contributionsRes = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${githubUsername}`,
        {
          headers: { "User-Agent": "delowar-portfolio" }
        }
      );
      const contributions = contributionsRes.ok ? await contributionsRes.json() : null;
      const total = contributions?.totalContributions ?? 0;
      const yearsOfExperience = Math.max(1, (/* @__PURE__ */ new Date()).getFullYear() - experienceStartYear);
      const uptimeDays = Math.max(
        1,
        Math.floor((Date.now() - siteLaunchedAt.getTime()) / (1e3 * 60 * 60 * 24))
      );
      const coffeesConsumed = Math.round(uptimeDays * 1.1);
      res.json({ commits: total, yearsOfExperience, coffeesConsumed, uptimeDays });
    } catch {
      const yearsOfExperience = Math.max(1, (/* @__PURE__ */ new Date()).getFullYear() - experienceStartYear);
      const uptimeDays = Math.max(
        1,
        Math.floor((Date.now() - siteLaunchedAt.getTime()) / (1e3 * 60 * 60 * 24))
      );
      res.json({
        commits: 1800,
        yearsOfExperience,
        coffeesConsumed: Math.round(uptimeDays * 1.1),
        uptimeDays
      });
    }
  });
  app2.get("/api/skills", async (req, res) => {
    try {
      const skills2 = await storage.getSkills();
      res.json(skills2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/skills", isAdmin, async (req, res) => {
    try {
      const skill = await storage.insertSkill(req.body);
      res.json(skill);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.put("/api/skills/:id", isAdmin, async (req, res) => {
    try {
      const skill = await storage.updateSkill(req.params.id, req.body);
      res.json(skill);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.delete("/api/skills/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteSkill(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/testimonials", async (req, res) => {
    try {
      const { featured } = req.query;
      const testimonials2 = await storage.getTestimonials({
        featured: parseBooleanQuery(featured)
      });
      res.json(testimonials2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/testimonials", isAdmin, async (req, res) => {
    try {
      const testimonial = await storage.insertTestimonial(req.body);
      res.json(testimonial);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.put("/api/testimonials/:id", isAdmin, async (req, res) => {
    try {
      const testimonial = await storage.updateTestimonial(req.params.id, req.body);
      res.json(testimonial);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.delete("/api/testimonials/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteTestimonial(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/timeline", async (req, res) => {
    try {
      const { category } = req.query;
      const events = await storage.getTimelineEvents({
        category
      });
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/timeline", isAdmin, async (req, res) => {
    try {
      const event = await storage.insertTimelineEvent(req.body);
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.put("/api/timeline/:id", isAdmin, async (req, res) => {
    try {
      const event = await storage.updateTimelineEvent(req.params.id, req.body);
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.delete("/api/timeline/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteTimelineEvent(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/achievements", async (req, res) => {
    try {
      const { category } = req.query;
      const achievements2 = await storage.getAchievements({
        category
      });
      res.json(achievements2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/achievements", isAdmin, async (req, res) => {
    try {
      const achievement = await storage.insertAchievement(req.body);
      res.json(achievement);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const parsed = contactMessageSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0]?.message ?? "Invalid form data" });
      }
      const payload = parsed.data;
      const sanitizedMessage = {
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        subject: payload.subject.trim() || "General inquiry",
        message: payload.message.trim(),
        reason: payload.reason?.trim() || "general",
        status: "new"
      };
      const message = await storage.insertContactMessage(sanitizedMessage);
      await sendContactNotification({
        name: message.name,
        email: message.email,
        subject: message.subject,
        message: message.message
      });
      res.json({ success: true, message });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/newsletter", async (req, res) => {
    try {
      const parsed = newsletterSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid newsletter payload" });
      }
      await sendContactNotification({
        name: "Newsletter Opt-in",
        email: parsed.data.email,
        subject: "New subscriber",
        message: `Add ${parsed.data.email} to the update list.
Source: ${parsed.data.source ?? "home newsletter"}`
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/bug-report", async (req, res) => {
    try {
      const parsed = bugReportSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid bug payload" });
      }
      const { message, steps, screenshot } = parsed.data;
      await sendContactNotification({
        name: "Bug widget",
        email: appConfig.contactInboxEmail,
        subject: "New onsite bug report",
        message: [
          "Bug summary:",
          message,
          "",
          steps ? `Steps: ${steps}` : "",
          screenshot ? `Screenshot (base64): ${screenshot.slice(0, 80)}...` : ""
        ].filter(Boolean).join("\n")
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/contact/messages", isAdmin, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/webauthn/challenge", (req, res) => {
    const userId = typeof req.body?.userId === "string" && req.body.userId.trim() || "demo-user";
    const challenge = createChallenge(userId);
    res.json({
      userId,
      challenge,
      rpId: new URL(appConfig.publicApiBase).hostname,
      name: appConfig.profile.name
    });
  });
  app2.post("/api/webauthn/verify", (req, res) => {
    const { userId, challenge } = req.body ?? {};
    if (!userId || !challenge) {
      return res.status(400).json({ message: "Missing payload" });
    }
    const ok = verifyChallenge(userId, challenge);
    if (!ok) {
      return res.status(400).json({ message: "Challenge mismatch" });
    }
    res.json({ success: true });
  });
  app2.get("/api/environment/weather", async (req, res) => {
    if (!openWeatherKey) {
      return res.status(503).json({ message: "Weather service is not configured." });
    }
    const lat = parseFloat(req.query.lat ?? "");
    const lon = parseFloat(req.query.lon ?? "");
    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      return res.status(400).json({ message: "Latitude and longitude are required." });
    }
    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        appid: openWeatherKey,
        units: "metric"
      });
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?${params}`);
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      const data = await response.json();
      const condition = data.weather?.[0]?.main ?? "Unknown";
      const description = data.weather?.[0]?.description ?? "";
      const temperature = data.main?.temp ?? null;
      const isRaining = typeof condition === "string" && ["Rain", "Thunderstorm", "Drizzle"].includes(condition);
      res.json({
        condition,
        description,
        temperature,
        isRaining,
        timestamp: Date.now()
      });
    } catch (error) {
      res.status(500).json({ message: error.message ?? "Failed to fetch weather." });
    }
  });
  app2.get("/api/auth/github", (req, res) => {
    if (!isGithubAuthConfigured()) {
      return res.status(503).json({ message: "GitHub OAuth is not configured yet." });
    }
    const state = randomUUID();
    req.session.githubOAuthState = state;
    const params = new URLSearchParams({
      client_id: githubConfig.clientId,
      redirect_uri: githubConfig.callbackUrl,
      scope: "read:user",
      state,
      allow_signup: "true"
    });
    res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
  });
  app2.get("/api/auth/github/callback", async (req, res) => {
    if (!isGithubAuthConfigured()) {
      return res.status(503).send("GitHub OAuth is not configured yet.");
    }
    const { code, state } = req.query;
    if (typeof code !== "string" || typeof state !== "string") {
      return res.status(400).send("Missing code or state.");
    }
    if (!req.session.githubOAuthState || req.session.githubOAuthState !== state) {
      return res.status(400).send("Invalid OAuth state.");
    }
    try {
      const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body: new URLSearchParams({
          client_id: githubConfig.clientId,
          client_secret: githubConfig.clientSecret,
          code,
          redirect_uri: githubConfig.callbackUrl
        })
      });
      const tokenPayload = await tokenResponse.json();
      if (!tokenPayload.access_token) {
        throw new Error(tokenPayload.error_description || "Failed to exchange GitHub code.");
      }
      const profileResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokenPayload.access_token}`,
          "User-Agent": "delowar-portfolio"
        }
      });
      if (!profileResponse.ok) {
        throw new Error("Failed to fetch GitHub profile.");
      }
      const profile2 = await profileResponse.json();
      req.session.githubUser = {
        id: String(profile2.id),
        login: profile2.login,
        name: profile2.name || profile2.login,
        avatarUrl: profile2.avatar_url || "",
        profileUrl: profile2.html_url || `https://github.com/${profile2.login}`
      };
      req.session.githubOAuthState = void 0;
      res.redirect("/guestbook?auth=github");
    } catch (error) {
      console.error("GitHub OAuth callback error:", error);
      res.redirect("/guestbook?auth=error");
    }
  });
  app2.post("/api/auth/github/logout", (req, res) => {
    delete req.session.githubUser;
    res.json({ success: true });
  });
  app2.get("/api/guestbook/session", (req, res) => {
    res.json({ user: req.session.githubUser ?? null });
  });
  app2.get("/api/guestbook", async (req, res) => {
    try {
      const limit = Math.min(
        100,
        Math.max(1, parseInt(req.query.limit || "40", 10) || 40)
      );
      const entries = await storage.getGuestbookEntries(limit);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/guestbook", async (req, res) => {
    if (!req.session.githubUser) {
      return res.status(401).json({ message: "Sign in with GitHub to leave a note." });
    }
    try {
      const parsed = guestbookMessageSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0]?.message ?? "Invalid message." });
      }
      const entry = await storage.insertGuestbookEntry({
        githubId: req.session.githubUser.id,
        githubLogin: req.session.githubUser.login,
        githubName: req.session.githubUser.name,
        githubAvatar: req.session.githubUser.avatarUrl,
        githubProfile: req.session.githubUser.profileUrl,
        message: parsed.data.message.trim()
      });
      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/workspace/tasks", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const { status, priority } = req.query;
      const tasks2 = await storage.getTasks(user.id, {
        status,
        priority
      });
      res.json(tasks2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/workspace/tasks", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const task = await storage.insertTask({
        ...req.body,
        userId: user.id
      });
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.put("/api/workspace/tasks/:id", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const task = await storage.updateTask(req.params.id, user.id, req.body);
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.delete("/api/workspace/tasks/:id", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      await storage.deleteTask(req.params.id, user.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/workspace/notes", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const notes2 = await storage.getNotes(user.id);
      res.json(notes2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/workspace/notes", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const note = await storage.insertNote({
        ...req.body,
        userId: user.id
      });
      res.json(note);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.put("/api/workspace/notes/:id", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const note = await storage.updateNote(req.params.id, user.id, req.body);
      res.json(note);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.delete("/api/workspace/notes/:id", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      await storage.deleteNote(req.params.id, user.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/workspace/snippets", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const snippets = await storage.getCodeSnippets(user.id);
      res.json(snippets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/workspace/snippets", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const snippet = await storage.insertCodeSnippet({
        ...req.body,
        userId: user.id
      });
      res.json(snippet);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/workspace/learning", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const items = await storage.getLearningItems(user.id);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/workspace/learning", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const item = await storage.insertLearningItem({
        ...req.body,
        userId: user.id
      });
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/workspace/time-entries", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const entries = await storage.getTimeEntries(user.id);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/workspace/time-entries/start", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const entry = await storage.startTimeEntry({
        userId: user.id,
        ...req.body
      });
      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/workspace/time-entries/:id/stop", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const entry = await storage.stopTimeEntry(req.params.id, user.id);
      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/workspace/habits", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const habits2 = await storage.getHabits(user.id);
      res.json(habits2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/workspace/habits", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const habit = await storage.insertHabit({
        ...req.body,
        userId: user.id
      });
      res.json(habit);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/workspace/habits/:id/log", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const log2 = await storage.logHabit({
        habitId: req.params.id,
        userId: user.id,
        ...req.body
      });
      res.json(log2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/workspace/calendar", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const events = await storage.getCalendarEvents(user.id);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/workspace/calendar", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const event = await storage.insertCalendarEvent({
        ...req.body,
        userId: user.id
      });
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/business/clients", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const clients2 = await storage.getClients(user.id);
      res.json(clients2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/business/clients", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const client = await storage.insertClient({
        ...req.body,
        userId: user.id
      });
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/business/proposals", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const proposals2 = await storage.getProposals(user.id);
      res.json(proposals2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/business/proposals", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const proposal = await storage.insertProposal({
        ...req.body,
        userId: user.id
      });
      res.json(proposal);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/business/invoices", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const invoices2 = await storage.getInvoices(user.id);
      res.json(invoices2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/business/invoices", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const invoice = await storage.insertInvoice({
        ...req.body,
        userId: user.id
      });
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/business/finance/overview", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const overview = await storage.getFinanceOverview(user.id);
      res.json(overview);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/business/expenses", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const expenses2 = await storage.getExpenses(user.id);
      res.json(expenses2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/business/expenses", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const expense = await storage.insertExpense({
        ...req.body,
        userId: user.id
      });
      res.json(expense);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/business/income", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const income = await storage.getIncomeEntries(user.id);
      res.json(income);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/business/income", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const incomeEntry = await storage.insertIncomeEntry({
        ...req.body,
        userId: user.id
      });
      res.json(incomeEntry);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/resume", async (req, res) => {
    try {
      const sections = await storage.getResumeSections();
      res.json(sections);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/resume", isAdmin, async (req, res) => {
    try {
      const section = await storage.insertResumeSection(req.body);
      res.json(section);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/playground", async (req, res) => {
    try {
      const entries = await storage.getPlaygroundEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/playground", isAdmin, async (req, res) => {
    try {
      const entry = await storage.insertPlaygroundEntry(req.body);
      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/seed", isAdmin, async (req, res) => {
    try {
      await storage.seedDatabase();
      res.json({ success: true, message: "Database seeded successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/health/security", (_req, res) => {
    res.json({
      profile: getSecurityProfile(),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var enableRuntimeOverlay = process.env.VITE_RUNTIME_OVERLAY === "true";
var vite_config_default = defineConfig(async () => {
  const cartographerPlugins = process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
    (await import("@replit/vite-plugin-cartographer")).cartographer()
  ] : [];
  return {
    plugins: [
      react(),
      ...enableRuntimeOverlay ? [runtimeErrorOverlay()] : [],
      ...cartographerPlugins
    ],
    resolve: {
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime"
      ],
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@mediapipe/tasks-vision": path.resolve(
          import.meta.dirname,
          "client",
          "src",
          "shims",
          "mediapipe-stub.js"
        ),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets")
      }
    },
    root: path.resolve(import.meta.dirname, "client"),
    define: {
      global: "globalThis"
    },
    optimizeDeps: {
      include: ["react", "react-dom", "react-dom/client", "@jsquash/jpeg"]
    },
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("three") || id.includes("@react-three"))
                return "three-vendor";
              if (id.includes("@mediapipe")) return "mediapipe-vendor";
              if (id.includes("react") || id.includes("react-dom"))
                return "react-vendor";
              return "vendor";
            }
          }
        }
      }
    },
    server: {
      host: "0.0.0.0",
      port: 5e3,
      strictPort: true,
      hmr: {
        clientPort: 5e3
      },
      fs: {
        strict: true,
        deny: ["**/.*"]
      }
    }
  };
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json({ limit: "2mb" }));
app.use(express2.urlencoded({ extended: false, limit: "2mb" }));
applySecurity(app);
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  try {
    const adminUser = await storage.getUserByUsername("admin");
    if (!adminUser) {
      log("Database is empty, seeding with initial data...");
      await storage.seedDatabase();
      log("\u2705 Database seeded successfully");
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    log(`\u26A0\uFE0F Error checking/seeding database: ${reason}`);
  }
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "5000", 10);
  const maxAttempts = process.env.PORT ? 0 : 5;
  const startServer = (port, attemptsLeft) => {
    const listener = server.listen(
      {
        port,
        host: "0.0.0.0"
      },
      () => {
        log(`serving on port ${port}`);
      }
    );
    listener.on("error", (error) => {
      if (error.code === "EADDRINUSE" && attemptsLeft > 0) {
        const nextPort = port + 1;
        log(
          `\u26A0\uFE0F Port ${port} is in use, attempting to use ${nextPort}. Set PORT env to override.`
        );
        listener.close();
        setTimeout(() => startServer(nextPort, attemptsLeft - 1), 250);
      } else if (error.code === "EADDRINUSE") {
        log(
          `\u274C Port ${port} is already in use. Please free the port or set PORT to a different value.`
        );
        process.exit(1);
      } else {
        log(`\u274C Failed to start server: ${error.message}`);
        process.exit(1);
      }
    });
  };
  startServer(preferredPort, maxAttempts);
})();
