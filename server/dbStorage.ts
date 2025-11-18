import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { eq, and, desc, asc, or, sql, like } from "drizzle-orm";
import bcrypt from "bcrypt";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
import {
  users,
  projects,
  blogPosts,
  blogTags,
  skills,
  testimonials,
  timelineEvents,
  achievements,
  contactMessages,
  playgroundEntries,
  resumeSections,
  tasks,
  notes,
  codeSnippets,
  learningItems,
  timeEntries,
  habits,
  habitLogs,
  calendarEvents,
  clients,
  proposals,
  invoices,
  expenses,
  incomeEntries,
  type User, type InsertUser,
  type Project, type InsertProject,
  type BlogPost, type InsertBlogPost,
  type BlogTag,
  type Skill, type InsertSkill,
  type Testimonial, type InsertTestimonial,
  type TimelineEvent, type InsertTimelineEvent,
  type Achievement, type InsertAchievement,
  type ContactMessage, type InsertContactMessage,
  guestbookEntries, type GuestbookEntry, type InsertGuestbookEntry,
  type PlaygroundEntry, type InsertPlaygroundEntry,
  type ResumeSection, type InsertResumeSection,
  type Task, type InsertTask,
  type Note, type InsertNote,
  type CodeSnippet, type InsertCodeSnippet,
  type LearningItem, type InsertLearningItem,
  type TimeEntry, type InsertTimeEntry,
  type Habit, type InsertHabit,
  type HabitLog, type InsertHabitLog,
  type CalendarEvent, type InsertCalendarEvent,
  type Client, type InsertClient,
  type Proposal, type InsertProposal,
  type Invoice, type InsertInvoice,
  type Expense, type InsertExpense,
  type IncomeEntry, type InsertIncomeEntry,
} from "@shared/schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Provision the Neon serverless instance and set the environment variable before starting the server.",
  );
}

const pool = new Pool({ connectionString });
const db = drizzle(pool);

export class DbStorage {
  // ==================== USER METHODS ====================
  async getUserById(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async insertUser(data: InsertUser): Promise<User> {
    const result = await db.insert(users).values(data).returning();
    return result[0];
  }

  // ==================== PROJECT METHODS ====================
  async getProjects(filters?: { category?: string; featured?: boolean; status?: string }): Promise<Project[]> {
    let query = db.select().from(projects);
    const conditions = [];

    if (filters?.category) {
      conditions.push(eq(projects.category, filters.category));
    }
    if (filters?.featured !== undefined) {
      conditions.push(eq(projects.featured, filters.featured));
    }
    if (filters?.status) {
      conditions.push(eq(projects.status, filters.status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const result = await query.orderBy(desc(projects.createdAt));
    return result;
  }

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
    return result[0];
  }

  async insertProject(data: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(data).returning();
    return result[0];
  }

  async updateProject(id: string, data: Partial<InsertProject>): Promise<Project> {
    const result = await db
      .update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    
    if (!result[0]) throw new Error("Project not found");
    return result[0];
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // ==================== BLOG METHODS ====================
  async getBlogPosts(filters?: { tag?: string; search?: string; featured?: boolean }): Promise<BlogPost[]> {
    let query = db.select().from(blogPosts);
    const conditions = [];

    if (filters?.tag) {
      conditions.push(sql`${filters.tag} = ANY(${blogPosts.tags})`);
    }
    if (filters?.search) {
      const searchTerm = `%${filters.search.toLowerCase()}%`;
      conditions.push(
        or(
          sql`LOWER(${blogPosts.title}) LIKE ${searchTerm}`,
          sql`LOWER(${blogPosts.excerpt}) LIKE ${searchTerm}`
        )
      );
    }
    if (filters?.featured !== undefined) {
      conditions.push(eq(blogPosts.featured, filters.featured));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const result = await query.orderBy(desc(blogPosts.publishedAt));
    return result;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    return result[0];
  }

  async insertBlogPost(data: InsertBlogPost): Promise<BlogPost> {
    const result = await db.insert(blogPosts).values(data).returning();
    return result[0];
  }

  async updateBlogPost(id: string, data: Partial<InsertBlogPost>): Promise<BlogPost> {
    const result = await db
      .update(blogPosts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    
    if (!result[0]) throw new Error("Blog post not found");
    return result[0];
  }

  async deleteBlogPost(id: string): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  async getBlogTags(): Promise<BlogTag[]> {
    return await db.select().from(blogTags);
  }

  // ==================== SKILL METHODS ====================
  async getSkills(): Promise<Skill[]> {
    return await db.select().from(skills).orderBy(asc(skills.order));
  }

  async insertSkill(data: InsertSkill): Promise<Skill> {
    const result = await db.insert(skills).values(data).returning();
    return result[0];
  }

  async updateSkill(id: string, data: Partial<InsertSkill>): Promise<Skill> {
    const result = await db
      .update(skills)
      .set(data)
      .where(eq(skills.id, id))
      .returning();
    
    if (!result[0]) throw new Error("Skill not found");
    return result[0];
  }

  async deleteSkill(id: string): Promise<void> {
    await db.delete(skills).where(eq(skills.id, id));
  }

  // ==================== TESTIMONIAL METHODS ====================
  async getTestimonials(filters?: { featured?: boolean }): Promise<Testimonial[]> {
    let query = db.select().from(testimonials);

    if (filters?.featured !== undefined) {
      query = query.where(eq(testimonials.featured, filters.featured)) as any;
    }

    const result = await query.orderBy(desc(testimonials.createdAt));
    return result;
  }

  async insertTestimonial(data: InsertTestimonial): Promise<Testimonial> {
    const result = await db.insert(testimonials).values(data).returning();
    return result[0];
  }

  async updateTestimonial(id: string, data: Partial<InsertTestimonial>): Promise<Testimonial> {
    const result = await db
      .update(testimonials)
      .set(data)
      .where(eq(testimonials.id, id))
      .returning();
    
    if (!result[0]) throw new Error("Testimonial not found");
    return result[0];
  }

  async deleteTestimonial(id: string): Promise<void> {
    await db.delete(testimonials).where(eq(testimonials.id, id));
  }

  // ==================== TIMELINE METHODS ====================
  async getTimelineEvents(filters?: { category?: string }): Promise<TimelineEvent[]> {
    let query = db.select().from(timelineEvents);

    if (filters?.category) {
      query = query.where(eq(timelineEvents.category, filters.category)) as any;
    }

    const result = await query.orderBy(desc(timelineEvents.year), asc(timelineEvents.order));
    return result;
  }

  async insertTimelineEvent(data: InsertTimelineEvent): Promise<TimelineEvent> {
    const result = await db.insert(timelineEvents).values(data).returning();
    return result[0];
  }

  async updateTimelineEvent(id: string, data: Partial<InsertTimelineEvent>): Promise<TimelineEvent> {
    const result = await db
      .update(timelineEvents)
      .set(data)
      .where(eq(timelineEvents.id, id))
      .returning();
    
    if (!result[0]) throw new Error("Timeline event not found");
    return result[0];
  }

  async deleteTimelineEvent(id: string): Promise<void> {
    await db.delete(timelineEvents).where(eq(timelineEvents.id, id));
  }

  // ==================== ACHIEVEMENT METHODS ====================
  async getAchievements(filters?: { category?: string }): Promise<Achievement[]> {
    let query = db.select().from(achievements);

    if (filters?.category) {
      query = query.where(eq(achievements.category, filters.category)) as any;
    }

    const result = await query.orderBy(desc(achievements.achievedAt));
    return result;
  }

  async insertAchievement(data: InsertAchievement): Promise<Achievement> {
    const result = await db.insert(achievements).values(data).returning();
    return result[0];
  }

  // ==================== CONTACT METHODS ====================
  async insertContactMessage(data: InsertContactMessage): Promise<ContactMessage> {
    const result = await db.insert(contactMessages).values(data).returning();
    return result[0];
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async getContactMessageById(id: string): Promise<ContactMessage | undefined> {
    const result = await db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.id, id))
      .limit(1);
    return result[0];
  }

  async updateContactMessage(
    id: string,
    data: Partial<ContactMessage>,
  ): Promise<ContactMessage> {
    const result = await db
      .update(contactMessages)
      .set(data)
      .where(eq(contactMessages.id, id))
      .returning();
    if (!result[0]) throw new Error("Contact message not found");
    return result[0];
  }

  // ==================== GUESTBOOK METHODS ====================
  async insertGuestbookEntry(data: InsertGuestbookEntry): Promise<GuestbookEntry> {
    const result = await db.insert(guestbookEntries).values(data).returning();
    return result[0];
  }

  async getGuestbookEntries(limit = 40): Promise<GuestbookEntry[]> {
    return await db
      .select()
      .from(guestbookEntries)
      .orderBy(desc(guestbookEntries.createdAt))
      .limit(limit);
  }

  // ==================== WORKSPACE: TASK METHODS ====================
  async getTasks(userId: string, filters?: { status?: string; priority?: string }): Promise<Task[]> {
    let query = db.select().from(tasks);
    const conditions = [eq(tasks.userId, userId)];

    if (filters?.status) {
      conditions.push(eq(tasks.status, filters.status));
    }
    if (filters?.priority) {
      conditions.push(eq(tasks.priority, filters.priority));
    }

    query = query.where(and(...conditions)) as any;
    const result = await query.orderBy(desc(tasks.createdAt));
    return result;
  }

  async insertTask(data: InsertTask): Promise<Task> {
    const result = await db.insert(tasks).values(data).returning();
    return result[0];
  }

  async updateTask(id: string, userId: string, data: Partial<InsertTask>): Promise<Task> {
    const result = await db
      .update(tasks)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    
    if (!result[0]) throw new Error("Task not found");
    return result[0];
  }

  async deleteTask(id: string, userId: string): Promise<void> {
    const result = await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    
    if (!result[0]) throw new Error("Task not found");
  }

  // ==================== WORKSPACE: NOTE METHODS ====================
  async getNotes(userId: string): Promise<Note[]> {
    return await db
      .select()
      .from(notes)
      .where(eq(notes.userId, userId))
      .orderBy(desc(notes.updatedAt));
  }

  async insertNote(data: InsertNote): Promise<Note> {
    const result = await db.insert(notes).values(data).returning();
    return result[0];
  }

  async updateNote(id: string, userId: string, data: Partial<InsertNote>): Promise<Note> {
    const result = await db
      .update(notes)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning();
    
    if (!result[0]) throw new Error("Note not found");
    return result[0];
  }

  async deleteNote(id: string, userId: string): Promise<void> {
    const result = await db
      .delete(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning();
    
    if (!result[0]) throw new Error("Note not found");
  }

  // ==================== WORKSPACE: CODE SNIPPET METHODS ====================
  async getCodeSnippets(userId: string): Promise<CodeSnippet[]> {
    return await db
      .select()
      .from(codeSnippets)
      .where(eq(codeSnippets.userId, userId))
      .orderBy(desc(codeSnippets.createdAt));
  }

  async insertCodeSnippet(data: InsertCodeSnippet): Promise<CodeSnippet> {
    const result = await db.insert(codeSnippets).values(data).returning();
    return result[0];
  }

  // ==================== WORKSPACE: LEARNING METHODS ====================
  async getLearningItems(userId: string): Promise<LearningItem[]> {
    return await db
      .select()
      .from(learningItems)
      .where(eq(learningItems.userId, userId))
      .orderBy(desc(learningItems.createdAt));
  }

  async insertLearningItem(data: InsertLearningItem): Promise<LearningItem> {
    const result = await db.insert(learningItems).values(data).returning();
    return result[0];
  }

  // ==================== WORKSPACE: TIME TRACKING METHODS ====================
  async getTimeEntries(userId: string): Promise<TimeEntry[]> {
    return await db
      .select()
      .from(timeEntries)
      .where(eq(timeEntries.userId, userId))
      .orderBy(desc(timeEntries.startTime));
  }

  async startTimeEntry(data: InsertTimeEntry): Promise<TimeEntry> {
    const result = await db
      .insert(timeEntries)
      .values({ ...data, startTime: new Date(), isRunning: true })
      .returning();
    return result[0];
  }

  async stopTimeEntry(id: string, userId: string): Promise<TimeEntry> {
    const existing = await db
      .select()
      .from(timeEntries)
      .where(and(eq(timeEntries.id, id), eq(timeEntries.userId, userId)))
      .limit(1);

    if (!existing[0]) throw new Error("Time entry not found");

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - new Date(existing[0].startTime).getTime()) / 1000);

    const result = await db
      .update(timeEntries)
      .set({ endTime, duration, isRunning: false })
      .where(eq(timeEntries.id, id))
      .returning();

    return result[0];
  }

  // ==================== WORKSPACE: HABIT METHODS ====================
  async getHabits(userId: string): Promise<Habit[]> {
    return await db
      .select()
      .from(habits)
      .where(eq(habits.userId, userId))
      .orderBy(desc(habits.createdAt));
  }

  async insertHabit(data: InsertHabit): Promise<Habit> {
    const result = await db.insert(habits).values(data).returning();
    return result[0];
  }

  async logHabit(data: InsertHabitLog): Promise<HabitLog> {
    const result = await db.insert(habitLogs).values(data).returning();
    return result[0];
  }

  // ==================== WORKSPACE: CALENDAR METHODS ====================
  async getCalendarEvents(userId: string): Promise<CalendarEvent[]> {
    return await db
      .select()
      .from(calendarEvents)
      .where(eq(calendarEvents.userId, userId))
      .orderBy(asc(calendarEvents.startTime));
  }

  async insertCalendarEvent(data: InsertCalendarEvent): Promise<CalendarEvent> {
    const result = await db.insert(calendarEvents).values(data).returning();
    return result[0];
  }

  // ==================== BUSINESS: CLIENT METHODS ====================
  async getClients(userId: string): Promise<Client[]> {
    return await db
      .select()
      .from(clients)
      .where(eq(clients.userId, userId))
      .orderBy(desc(clients.createdAt));
  }

  async insertClient(data: InsertClient): Promise<Client> {
    const result = await db.insert(clients).values(data).returning();
    return result[0];
  }

  // ==================== BUSINESS: PROPOSAL METHODS ====================
  async getProposals(userId: string): Promise<Proposal[]> {
    return await db
      .select()
      .from(proposals)
      .where(eq(proposals.userId, userId))
      .orderBy(desc(proposals.createdAt));
  }

  async insertProposal(data: InsertProposal): Promise<Proposal> {
    const result = await db.insert(proposals).values(data).returning();
    return result[0];
  }

  // ==================== BUSINESS: INVOICE METHODS ====================
  async getInvoices(userId: string): Promise<Invoice[]> {
    return await db
      .select()
      .from(invoices)
      .where(eq(invoices.userId, userId))
      .orderBy(desc(invoices.createdAt));
  }

  async insertInvoice(data: InsertInvoice): Promise<Invoice> {
    const result = await db.insert(invoices).values(data).returning();
    return result[0];
  }

  // ==================== BUSINESS: FINANCE METHODS ====================
  async getFinanceOverview(userId: string): Promise<any> {
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
      paidInvoices: allInvoices.filter(i => i.status === 'paid').length,
      pendingInvoices: allInvoices.filter(i => i.status === 'sent').length,
    };
  }

  async getExpenses(userId: string): Promise<Expense[]> {
    return await db
      .select()
      .from(expenses)
      .where(eq(expenses.userId, userId))
      .orderBy(desc(expenses.date));
  }

  async insertExpense(data: InsertExpense): Promise<Expense> {
    const result = await db.insert(expenses).values(data).returning();
    return result[0];
  }

  async getIncomeEntries(userId: string): Promise<IncomeEntry[]> {
    return await db
      .select()
      .from(incomeEntries)
      .where(eq(incomeEntries.userId, userId))
      .orderBy(desc(incomeEntries.date));
  }

  async insertIncomeEntry(data: InsertIncomeEntry): Promise<IncomeEntry> {
    const result = await db.insert(incomeEntries).values(data).returning();
    return result[0];
  }

  // ==================== RESUME METHODS ====================
  async getResumeSections(): Promise<ResumeSection[]> {
    return await db
      .select()
      .from(resumeSections)
      .orderBy(desc(resumeSections.startDate));
  }

  async insertResumeSection(data: InsertResumeSection): Promise<ResumeSection> {
    const result = await db.insert(resumeSections).values(data).returning();
    return result[0];
  }

  // ==================== PLAYGROUND METHODS ====================
  async getPlaygroundEntries(): Promise<PlaygroundEntry[]> {
    return await db
      .select()
      .from(playgroundEntries)
      .orderBy(desc(playgroundEntries.createdAt));
  }

  async insertPlaygroundEntry(data: InsertPlaygroundEntry): Promise<PlaygroundEntry> {
    const result = await db.insert(playgroundEntries).values(data).returning();
    return result[0];
  }

  // ==================== SEED DATA ====================
  async seedDatabase(): Promise<void> {
    try {
      console.log("🌱 Starting database seed...");

      const hashedPassword = await bcrypt.hash("admin123", 10);
      const [adminUser] = await db
        .insert(users)
        .values({
          username: "admin",
          password: hashedPassword,
          email: "admin@portfolio.com",
          name: "Delowar Hossain",
          role: "admin",
        })
        .onConflictDoNothing()
        .returning();

      if (adminUser) {
        console.log("✅ Admin user created");
      }

      await db
        .insert(projects)
        .values([
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
            demoUrl: "https://ai-agent-demo.com",
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
            githubUrl: "https://github.com/delowar/ecommerce-platform",
          },
          {
            title: "Task Management App",
            slug: "task-management-app",
            description: "Collaborative task management tool with real-time updates",
            techStack: ["Vue.js", "Firebase", "Tailwind CSS"],
            category: "web",
            featured: false,
            status: "completed",
          },
          {
            title: "Weather Forecasting API",
            slug: "weather-api",
            description: "RESTful API for weather data with caching and rate limiting",
            techStack: ["Python", "FastAPI", "Redis", "PostgreSQL"],
            category: "backend",
            featured: false,
            status: "in-progress",
          },
          {
            title: "Mobile Banking App",
            slug: "mobile-banking",
            description: "Secure mobile banking application with biometric authentication",
            techStack: ["React Native", "Node.js", "MongoDB", "Plaid API"],
            category: "mobile",
            featured: true,
            status: "completed",
          },
        ])
        .onConflictDoNothing();
      console.log("✅ Projects seeded");

      await db
        .insert(blogPosts)
        .values([
          {
            title: "Building Scalable APIs with Node.js",
            slug: "building-scalable-apis-nodejs",
            excerpt: "Learn best practices for building production-ready APIs that can handle millions of requests",
            content: "In this comprehensive guide, we'll explore the architecture patterns and tools needed to build APIs that scale...",
            author: "Delowar Hossain",
            publishedAt: new Date("2024-11-01"),
            tags: ["Node.js", "API", "Backend", "Performance"],
            featured: true,
            readingTime: 12,
          },
          {
            title: "React Performance Optimization Tips",
            slug: "react-performance-optimization",
            excerpt: "Practical techniques to make your React applications lightning fast",
            content: "React is fast by default, but there are many ways to make it even faster. Let's dive into memoization, lazy loading, and more...",
            author: "Delowar Hossain",
            publishedAt: new Date("2024-10-15"),
            tags: ["React", "Performance", "Frontend"],
            featured: true,
            readingTime: 8,
          },
          {
            title: "Getting Started with PostgreSQL",
            slug: "getting-started-postgresql",
            excerpt: "A beginner's guide to the world's most advanced open-source database",
            content: "PostgreSQL is a powerful, open-source relational database. In this tutorial, we'll cover installation, basic queries, and schema design...",
            author: "Delowar Hossain",
            publishedAt: new Date("2024-09-20"),
            tags: ["PostgreSQL", "Database", "SQL"],
            featured: false,
            readingTime: 15,
          },
        ])
        .onConflictDoNothing();
      console.log("✅ Blog posts seeded");

      await db
        .insert(skills)
        .values([
          { name: "JavaScript", category: "frontend", proficiency: 95, icon: "SiJavascript", order: 1 },
          { name: "TypeScript", category: "frontend", proficiency: 90, icon: "SiTypescript", order: 2 },
          { name: "React", category: "frontend", proficiency: 92, icon: "SiReact", order: 3 },
          { name: "Node.js", category: "backend", proficiency: 88, icon: "SiNodedotjs", order: 4 },
          { name: "PostgreSQL", category: "backend", proficiency: 85, icon: "SiPostgresql", order: 5 },
          { name: "Python", category: "backend", proficiency: 82, icon: "SiPython", order: 6 },
          { name: "Docker", category: "devops", proficiency: 78, icon: "SiDocker", order: 7 },
          { name: "Git", category: "tools", proficiency: 90, icon: "SiGit", order: 8 },
          { name: "Tailwind CSS", category: "frontend", proficiency: 87, icon: "SiTailwindcss", order: 9 },
          { name: "MongoDB", category: "backend", proficiency: 80, icon: "SiMongodb", order: 10 },
        ])
        .onConflictDoNothing();
      console.log("✅ Skills seeded");

      await db
        .insert(timelineEvents)
        .values([
          {
            year: 2024,
            title: "Senior Full-Stack Developer",
            description: "Leading development of enterprise applications at TechCorp",
            category: "career",
            icon: "Briefcase",
            order: 1,
          },
          {
            year: 2023,
            title: "Open Source Contributor",
            description: "Contributed to major open-source projects including React and Node.js",
            category: "open_source",
            icon: "Github",
            order: 1,
          },
          {
            year: 2022,
            title: "Full-Stack Developer",
            description: "Built scalable web applications using modern technologies",
            category: "career",
            icon: "Code",
            order: 1,
          },
        ])
        .onConflictDoNothing();
      console.log("✅ Timeline events seeded");

      await db
        .insert(testimonials)
        .values([
          {
            name: "Sarah Johnson",
            role: "Product Manager",
            company: "TechCorp",
            content: "Delowar is an exceptional developer who consistently delivers high-quality work. His attention to detail and problem-solving skills are outstanding.",
            rating: 5,
            featured: true,
          },
          {
            name: "Michael Chen",
            role: "CTO",
            company: "StartupXYZ",
            content: "Working with Delowar was a pleasure. He transformed our vision into reality with clean, maintainable code.",
            rating: 5,
            featured: true,
          },
        ])
        .onConflictDoNothing();
      console.log("✅ Testimonials seeded");

      console.log("🎉 Database seeding completed successfully!");
    } catch (error) {
      console.error("❌ Error seeding database:", error);
      throw error;
    }
  }
}

export const storage = new DbStorage();
