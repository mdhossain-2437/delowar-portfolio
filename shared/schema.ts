import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
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
