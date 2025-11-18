import {
  type User, type InsertUser,
  type Project, type InsertProject,
  type BlogPost, type InsertBlogPost,
  type BlogTag,
  type Skill, type InsertSkill,
  type Testimonial, type InsertTestimonial,
  type TimelineEvent, type InsertTimelineEvent,
  type Achievement, type InsertAchievement,
  type ContactMessage, type InsertContactMessage,
  type GuestbookEntry, type InsertGuestbookEntry,
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
import { randomUUID } from "crypto";

export class MockStorage {
  private users: Map<string, User> = new Map();
  private projects: Map<string, Project> = new Map();
  private blogPosts: Map<string, BlogPost> = new Map();
  private blogTags: Map<string, BlogTag> = new Map();
  private skills: Map<string, Skill> = new Map();
  private testimonials: Map<string, Testimonial> = new Map();
  private timelineEvents: Map<string, TimelineEvent> = new Map();
  private achievements: Map<string, Achievement> = new Map();
  private contactMessages: Map<string, ContactMessage> = new Map();
  private guestbookEntries: Map<string, GuestbookEntry> = new Map();
  private playgroundEntries: Map<string, PlaygroundEntry> = new Map();
  private resumeSections: Map<string, ResumeSection> = new Map();
  private tasks: Map<string, Task> = new Map();
  private notes: Map<string, Note> = new Map();
  private codeSnippets: Map<string, CodeSnippet> = new Map();
  private learningItems: Map<string, LearningItem> = new Map();
  private timeEntries: Map<string, TimeEntry> = new Map();
  private habits: Map<string, Habit> = new Map();
  private habitLogs: Map<string, HabitLog> = new Map();
  private calendarEvents: Map<string, CalendarEvent> = new Map();
  private clients: Map<string, Client> = new Map();
  private proposals: Map<string, Proposal> = new Map();
  private invoices: Map<string, Invoice> = new Map();
  private expenses: Map<string, Expense> = new Map();
  private incomeEntries: Map<string, IncomeEntry> = new Map();

  constructor() {
    this.seedMockData();
  }

  private seedMockData() {
    // Seed initial mock data here for demonstration
  }

  // ==================== USER METHODS ====================
  async getUserById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async insertUser(data: InsertUser): Promise<User> {
    const user: User = { ...data, id: randomUUID(), role: data.role || "user" };
    this.users.set(user.id, user);
    return user;
  }

  // ==================== PROJECT METHODS ====================
  async getProjects(filters?: { category?: string; featured?: boolean; status?: string }): Promise<Project[]> {
    let projects = Array.from(this.projects.values());
    if (filters?.category) projects = projects.filter(p => p.category === filters.category);
    if (filters?.featured !== undefined) projects = projects.filter(p => p.featured === filters.featured);
    if (filters?.status) projects = projects.filter(p => p.status === filters.status);
    return projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    return Array.from(this.projects.values()).find(p => p.slug === slug);
  }

  async insertProject(data: InsertProject): Promise<Project> {
    const project: Project = { 
      ...data, 
      id: randomUUID(), 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.projects.set(project.id, project);
    return project;
  }

  async updateProject(id: string, data: Partial<InsertProject>): Promise<Project> {
    const existing = this.projects.get(id);
    if (!existing) throw new Error("Project not found");
    const updated: Project = { ...existing, ...data, updatedAt: new Date() };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<void> {
    this.projects.delete(id);
  }

  // ==================== BLOG METHODS ====================
  async getBlogPosts(filters?: { tag?: string; search?: string; featured?: boolean }): Promise<BlogPost[]> {
    let posts = Array.from(this.blogPosts.values());
    if (filters?.tag) posts = posts.filter(p => p.tags.includes(filters.tag!));
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(search) || 
        p.excerpt.toLowerCase().includes(search)
      );
    }
    if (filters?.featured !== undefined) posts = posts.filter(p => p.featured === filters.featured);
    return posts.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(p => p.slug === slug);
  }

  async insertBlogPost(data: InsertBlogPost): Promise<BlogPost> {
    const post: BlogPost = { 
      ...data, 
      id: randomUUID(), 
      updatedAt: new Date() 
    };
    this.blogPosts.set(post.id, post);
    return post;
  }

  async updateBlogPost(id: string, data: Partial<InsertBlogPost>): Promise<BlogPost> {
    const existing = this.blogPosts.get(id);
    if (!existing) throw new Error("Blog post not found");
    const updated: BlogPost = { ...existing, ...data, updatedAt: new Date() };
    this.blogPosts.set(id, updated);
    return updated;
  }

  async deleteBlogPost(id: string): Promise<void> {
    this.blogPosts.delete(id);
  }

  async getBlogTags(): Promise<BlogTag[]> {
    return Array.from(this.blogTags.values());
  }

  // ==================== SKILL METHODS ====================
  async getSkills(): Promise<Skill[]> {
    return Array.from(this.skills.values()).sort((a, b) => a.order - b.order);
  }

  async insertSkill(data: InsertSkill): Promise<Skill> {
    const skill: Skill = { ...data, id: randomUUID() };
    this.skills.set(skill.id, skill);
    return skill;
  }

  async updateSkill(id: string, data: Partial<InsertSkill>): Promise<Skill> {
    const existing = this.skills.get(id);
    if (!existing) throw new Error("Skill not found");
    const updated: Skill = { ...existing, ...data };
    this.skills.set(id, updated);
    return updated;
  }

  async deleteSkill(id: string): Promise<void> {
    this.skills.delete(id);
  }

  // ==================== TESTIMONIAL METHODS ====================
  async getTestimonials(filters?: { featured?: boolean }): Promise<Testimonial[]> {
    let testimonials = Array.from(this.testimonials.values());
    if (filters?.featured !== undefined) {
      testimonials = testimonials.filter(t => t.featured === filters.featured);
    }
    return testimonials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async insertTestimonial(data: InsertTestimonial): Promise<Testimonial> {
    const testimonial: Testimonial = { 
      ...data, 
      id: randomUUID(), 
      createdAt: new Date() 
    };
    this.testimonials.set(testimonial.id, testimonial);
    return testimonial;
  }

  async updateTestimonial(id: string, data: Partial<InsertTestimonial>): Promise<Testimonial> {
    const existing = this.testimonials.get(id);
    if (!existing) throw new Error("Testimonial not found");
    const updated: Testimonial = { ...existing, ...data };
    this.testimonials.set(id, updated);
    return updated;
  }

  async deleteTestimonial(id: string): Promise<void> {
    this.testimonials.delete(id);
  }

  // ==================== TIMELINE METHODS ====================
  async getTimelineEvents(filters?: { category?: string }): Promise<TimelineEvent[]> {
    let events = Array.from(this.timelineEvents.values());
    if (filters?.category) events = events.filter(e => e.category === filters.category);
    return events.sort((a, b) => b.year - a.year || a.order - b.order);
  }

  async insertTimelineEvent(data: InsertTimelineEvent): Promise<TimelineEvent> {
    const event: TimelineEvent = { 
      ...data, 
      id: randomUUID(), 
      createdAt: new Date() 
    };
    this.timelineEvents.set(event.id, event);
    return event;
  }

  async updateTimelineEvent(id: string, data: Partial<InsertTimelineEvent>): Promise<TimelineEvent> {
    const existing = this.timelineEvents.get(id);
    if (!existing) throw new Error("Timeline event not found");
    const updated: TimelineEvent = { ...existing, ...data };
    this.timelineEvents.set(id, updated);
    return updated;
  }

  async deleteTimelineEvent(id: string): Promise<void> {
    this.timelineEvents.delete(id);
  }

  // ==================== ACHIEVEMENT METHODS ====================
  async getAchievements(filters?: { category?: string }): Promise<Achievement[]> {
    let achievements = Array.from(this.achievements.values());
    if (filters?.category) achievements = achievements.filter(a => a.category === filters.category);
    return achievements.sort((a, b) => new Date(b.achievedAt).getTime() - new Date(a.achievedAt).getTime());
  }

  async insertAchievement(data: InsertAchievement): Promise<Achievement> {
    const achievement: Achievement = { 
      ...data, 
      id: randomUUID(), 
      createdAt: new Date() 
    };
    this.achievements.set(achievement.id, achievement);
    return achievement;
  }

  // ==================== CONTACT METHODS ====================
  async insertContactMessage(data: InsertContactMessage): Promise<ContactMessage> {
    const message: ContactMessage = { 
      ...data, 
      id: randomUUID(), 
      createdAt: new Date() 
    };
    this.contactMessages.set(message.id, message);
    return message;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // ==================== GUESTBOOK METHODS ====================
  async insertGuestbookEntry(data: InsertGuestbookEntry): Promise<GuestbookEntry> {
    const entry: GuestbookEntry = {
      ...data,
      id: randomUUID(),
      createdAt: new Date(),
    };
    this.guestbookEntries.set(entry.id, entry);
    return entry;
  }

  async getGuestbookEntries(limit = 40): Promise<GuestbookEntry[]> {
    return Array.from(this.guestbookEntries.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  // ==================== WORKSPACE: TASK METHODS ====================
  async getTasks(userId: string, filters?: { status?: string; priority?: string }): Promise<Task[]> {
    let tasks = Array.from(this.tasks.values()).filter(t => t.userId === userId);
    if (filters?.status) tasks = tasks.filter(t => t.status === filters.status);
    if (filters?.priority) tasks = tasks.filter(t => t.priority === filters.priority);
    return tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async insertTask(data: InsertTask): Promise<Task> {
    const task: Task = { 
      ...data, 
      id: randomUUID(), 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.tasks.set(task.id, task);
    return task;
  }

  async updateTask(id: string, userId: string, data: Partial<InsertTask>): Promise<Task> {
    const existing = this.tasks.get(id);
    if (!existing || existing.userId !== userId) throw new Error("Task not found");
    const updated: Task = { ...existing, ...data, updatedAt: new Date() };
    this.tasks.set(id, updated);
    return updated;
  }

  async deleteTask(id: string, userId: string): Promise<void> {
    const existing = this.tasks.get(id);
    if (!existing || existing.userId !== userId) throw new Error("Task not found");
    this.tasks.delete(id);
  }

  // ==================== WORKSPACE: NOTE METHODS ====================
  async getNotes(userId: string): Promise<Note[]> {
    return Array.from(this.notes.values())
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async insertNote(data: InsertNote): Promise<Note> {
    const note: Note = { 
      ...data, 
      id: randomUUID(), 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.notes.set(note.id, note);
    return note;
  }

  async updateNote(id: string, userId: string, data: Partial<InsertNote>): Promise<Note> {
    const existing = this.notes.get(id);
    if (!existing || existing.userId !== userId) throw new Error("Note not found");
    const updated: Note = { ...existing, ...data, updatedAt: new Date() };
    this.notes.set(id, updated);
    return updated;
  }

  async deleteNote(id: string, userId: string): Promise<void> {
    const existing = this.notes.get(id);
    if (!existing || existing.userId !== userId) throw new Error("Note not found");
    this.notes.delete(id);
  }

  // ==================== WORKSPACE: CODE SNIPPET METHODS ====================
  async getCodeSnippets(userId: string): Promise<CodeSnippet[]> {
    return Array.from(this.codeSnippets.values())
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async insertCodeSnippet(data: InsertCodeSnippet): Promise<CodeSnippet> {
    const snippet: CodeSnippet = { 
      ...data, 
      id: randomUUID(), 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.codeSnippets.set(snippet.id, snippet);
    return snippet;
  }

  // ==================== WORKSPACE: LEARNING METHODS ====================
  async getLearningItems(userId: string): Promise<LearningItem[]> {
    return Array.from(this.learningItems.values())
      .filter(l => l.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async insertLearningItem(data: InsertLearningItem): Promise<LearningItem> {
    const item: LearningItem = { 
      ...data, 
      id: randomUUID(), 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.learningItems.set(item.id, item);
    return item;
  }

  // ==================== WORKSPACE: TIME TRACKING METHODS ====================
  async getTimeEntries(userId: string): Promise<TimeEntry[]> {
    return Array.from(this.timeEntries.values())
      .filter(e => e.userId === userId)
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  }

  async startTimeEntry(data: InsertTimeEntry): Promise<TimeEntry> {
    const entry: TimeEntry = { 
      ...data, 
      id: randomUUID(), 
      startTime: new Date(), 
      isRunning: true, 
      createdAt: new Date() 
    };
    this.timeEntries.set(entry.id, entry);
    return entry;
  }

  async stopTimeEntry(id: string, userId: string): Promise<TimeEntry> {
    const existing = this.timeEntries.get(id);
    if (!existing || existing.userId !== userId) throw new Error("Time entry not found");
    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - new Date(existing.startTime).getTime()) / 1000);
    const updated: TimeEntry = { ...existing, endTime, duration, isRunning: false };
    this.timeEntries.set(id, updated);
    return updated;
  }

  // ==================== WORKSPACE: HABIT METHODS ====================
  async getHabits(userId: string): Promise<Habit[]> {
    return Array.from(this.habits.values())
      .filter(h => h.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async insertHabit(data: InsertHabit): Promise<Habit> {
    const habit: Habit = { 
      ...data, 
      id: randomUUID(), 
      createdAt: new Date() 
    };
    this.habits.set(habit.id, habit);
    return habit;
  }

  async logHabit(data: InsertHabitLog): Promise<HabitLog> {
    const log: HabitLog = { 
      ...data, 
      id: randomUUID(), 
      createdAt: new Date() 
    };
    this.habitLogs.set(log.id, log);
    return log;
  }

  // ==================== WORKSPACE: CALENDAR METHODS ====================
  async getCalendarEvents(userId: string): Promise<CalendarEvent[]> {
    return Array.from(this.calendarEvents.values())
      .filter(e => e.userId === userId)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  async insertCalendarEvent(data: InsertCalendarEvent): Promise<CalendarEvent> {
    const event: CalendarEvent = { 
      ...data, 
      id: randomUUID(), 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.calendarEvents.set(event.id, event);
    return event;
  }

  // ==================== BUSINESS: CLIENT METHODS ====================
  async getClients(userId: string): Promise<Client[]> {
    return Array.from(this.clients.values())
      .filter(c => c.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async insertClient(data: InsertClient): Promise<Client> {
    const client: Client = { 
      ...data, 
      id: randomUUID(), 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.clients.set(client.id, client);
    return client;
  }

  // ==================== BUSINESS: PROPOSAL METHODS ====================
  async getProposals(userId: string): Promise<Proposal[]> {
    return Array.from(this.proposals.values())
      .filter(p => p.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async insertProposal(data: InsertProposal): Promise<Proposal> {
    const proposal: Proposal = { 
      ...data, 
      id: randomUUID(), 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.proposals.set(proposal.id, proposal);
    return proposal;
  }

  // ==================== BUSINESS: INVOICE METHODS ====================
  async getInvoices(userId: string): Promise<Invoice[]> {
    return Array.from(this.invoices.values())
      .filter(i => i.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async insertInvoice(data: InsertInvoice): Promise<Invoice> {
    const invoice: Invoice = { 
      ...data, 
      id: randomUUID(), 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.invoices.set(invoice.id, invoice);
    return invoice;
  }

  // ==================== BUSINESS: FINANCE METHODS ====================
  async getFinanceOverview(userId: string): Promise<any> {
    const invoices = Array.from(this.invoices.values()).filter(i => i.userId === userId);
    const expenses = Array.from(this.expenses.values()).filter(e => e.userId === userId);
    const income = Array.from(this.incomeEntries.values()).filter(i => i.userId === userId);

    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const profit = totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      profit,
      paidInvoices: invoices.filter(i => i.status === 'paid').length,
      pendingInvoices: invoices.filter(i => i.status === 'sent').length,
    };
  }

  async getExpenses(userId: string): Promise<Expense[]> {
    return Array.from(this.expenses.values())
      .filter(e => e.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async insertExpense(data: InsertExpense): Promise<Expense> {
    const expense: Expense = { 
      ...data, 
      id: randomUUID(), 
      createdAt: new Date() 
    };
    this.expenses.set(expense.id, expense);
    return expense;
  }

  async getIncomeEntries(userId: string): Promise<IncomeEntry[]> {
    return Array.from(this.incomeEntries.values())
      .filter(i => i.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async insertIncomeEntry(data: InsertIncomeEntry): Promise<IncomeEntry> {
    const entry: IncomeEntry = { 
      ...data, 
      id: randomUUID(), 
      createdAt: new Date() 
    };
    this.incomeEntries.set(entry.id, entry);
    return entry;
  }

  // ==================== RESUME METHODS ====================
  async getResumeSections(): Promise<ResumeSection[]> {
    return Array.from(this.resumeSections.values())
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }

  async insertResumeSection(data: InsertResumeSection): Promise<ResumeSection> {
    const section: ResumeSection = { ...data, id: randomUUID() };
    this.resumeSections.set(section.id, section);
    return section;
  }

  // ==================== PLAYGROUND METHODS ====================
  async getPlaygroundEntries(): Promise<PlaygroundEntry[]> {
    return Array.from(this.playgroundEntries.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async insertPlaygroundEntry(data: InsertPlaygroundEntry): Promise<PlaygroundEntry> {
    const entry: PlaygroundEntry = { 
      ...data, 
      id: randomUUID(), 
      createdAt: new Date() 
    };
    this.playgroundEntries.set(entry.id, entry);
    return entry;
  }

  async seedDatabase(): Promise<void> {
    this.users.clear();
    this.projects.clear();
    this.blogPosts.clear();
    this.blogTags.clear();
    this.skills.clear();
    this.testimonials.clear();
    this.timelineEvents.clear();
    this.achievements.clear();
    this.contactMessages.clear();
    this.playgroundEntries.clear();
    this.resumeSections.clear();
    this.tasks.clear();
    this.notes.clear();
    this.codeSnippets.clear();
    this.learningItems.clear();
    this.timeEntries.clear();
    this.habits.clear();
    this.habitLogs.clear();
    this.calendarEvents.clear();
    this.clients.clear();
    this.proposals.clear();
    this.invoices.clear();
    this.expenses.clear();
    this.incomeEntries.clear();
    this.seedMockData();
  }
}

export const storage = new MockStorage();
