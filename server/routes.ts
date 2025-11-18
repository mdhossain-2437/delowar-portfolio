import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./dbStorage";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import bcrypt from "bcrypt";
import { z } from "zod";
import type { User } from "@shared/schema";

// ==================== AUTH MIDDLEWARE ====================

const parseBooleanQuery = (value: unknown) =>
  typeof value === "string" ? value === "true" : undefined;

const parseStringQuery = (value: unknown) =>
  typeof value === "string" && value.length > 0 ? value : undefined;

function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

function requireUser(req: Request): User {
  if (!req.user) {
    throw new Error("Authenticated user not found on request object");
  }
  return req.user as User;
}

function isAdmin(req: any, res: any, next: any) {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Forbidden - Admin access required" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // ==================== SESSION & PASSPORT SETUP ====================
  
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "portfolio-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Invalid credentials" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return done(null, false, { message: "Invalid credentials" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUserById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // ==================== AUTH ROUTES ====================

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password, email, name } = req.body;
      
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.insertUser({
        username,
        password: hashedPassword,
        email,
        name,
        role: "user",
      });

      res.json({ success: true, user: { id: user.id, username: user.username, name: user.name } });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
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

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", isAuthenticated, (req, res) => {
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

  // ==================== PROJECTS ROUTES ====================

  app.get("/api/projects", async (req, res) => {
    try {
      const { category, featured, status } = req.query;
      const projects = await storage.getProjects({
        category: parseStringQuery(category),
        featured: parseBooleanQuery(featured),
        status: parseStringQuery(status),
      });
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/projects/:slug", async (req, res) => {
    try {
      const project = await storage.getProjectBySlug(req.params.slug);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/projects", isAdmin, async (req, res) => {
    try {
      const project = await storage.insertProject(req.body);
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/projects/:id", isAdmin, async (req, res) => {
    try {
      const project = await storage.updateProject(req.params.id, req.body);
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/projects/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteProject(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== BLOG ROUTES ====================

  app.get("/api/blog", async (req, res) => {
    try {
      const { tag, search, featured } = req.query;
      const posts = await storage.getBlogPosts({
        tag: parseStringQuery(tag),
        search: parseStringQuery(search),
        featured: parseBooleanQuery(featured),
      });
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/blog", isAdmin, async (req, res) => {
    try {
      const post = await storage.insertBlogPost(req.body);
      res.json(post);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/blog/:id", isAdmin, async (req, res) => {
    try {
      const post = await storage.updateBlogPost(req.params.id, req.body);
      res.json(post);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/blog/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteBlogPost(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/blog/tags", async (req, res) => {
    try {
      const tags = await storage.getBlogTags();
      res.json(tags);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== SKILLS ROUTES ====================

  app.get("/api/skills", async (req, res) => {
    try {
      const skills = await storage.getSkills();
      res.json(skills);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/skills", isAdmin, async (req, res) => {
    try {
      const skill = await storage.insertSkill(req.body);
      res.json(skill);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/skills/:id", isAdmin, async (req, res) => {
    try {
      const skill = await storage.updateSkill(req.params.id, req.body);
      res.json(skill);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/skills/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteSkill(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== TESTIMONIALS ROUTES ====================

  app.get("/api/testimonials", async (req, res) => {
    try {
      const { featured } = req.query;
      const testimonials = await storage.getTestimonials({
        featured: parseBooleanQuery(featured),
      });
      res.json(testimonials);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/testimonials", isAdmin, async (req, res) => {
    try {
      const testimonial = await storage.insertTestimonial(req.body);
      res.json(testimonial);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/testimonials/:id", isAdmin, async (req, res) => {
    try {
      const testimonial = await storage.updateTestimonial(req.params.id, req.body);
      res.json(testimonial);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/testimonials/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteTestimonial(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== TIMELINE ROUTES ====================

  app.get("/api/timeline", async (req, res) => {
    try {
      const { category } = req.query;
      const events = await storage.getTimelineEvents({
        category: category as string,
      });
      res.json(events);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/timeline", isAdmin, async (req, res) => {
    try {
      const event = await storage.insertTimelineEvent(req.body);
      res.json(event);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/timeline/:id", isAdmin, async (req, res) => {
    try {
      const event = await storage.updateTimelineEvent(req.params.id, req.body);
      res.json(event);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/timeline/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteTimelineEvent(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== ACHIEVEMENTS ROUTES ====================

  app.get("/api/achievements", async (req, res) => {
    try {
      const { category } = req.query;
      const achievements = await storage.getAchievements({
        category: category as string,
      });
      res.json(achievements);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/achievements", isAdmin, async (req, res) => {
    try {
      const achievement = await storage.insertAchievement(req.body);
      res.json(achievement);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== CONTACT ROUTES ====================

  app.post("/api/contact", async (req, res) => {
    try {
      const message = await storage.insertContactMessage(req.body);
      // TODO: Send email notification using Resend integration
      res.json({ success: true, message });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/contact/messages", isAdmin, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== WORKSPACE: TASKS ROUTES ====================

  app.get("/api/workspace/tasks", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const { status, priority } = req.query;
      const tasks = await storage.getTasks(user.id, {
        status: status as string,
        priority: priority as string,
      });
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/workspace/tasks", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const task = await storage.insertTask({
        ...req.body,
        userId: user.id,
      });
      res.json(task);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/workspace/tasks/:id", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const task = await storage.updateTask(req.params.id, user.id, req.body);
      res.json(task);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/workspace/tasks/:id", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      await storage.deleteTask(req.params.id, user.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== WORKSPACE: NOTES ROUTES ====================

  app.get("/api/workspace/notes", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const notes = await storage.getNotes(user.id);
      res.json(notes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/workspace/notes", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const note = await storage.insertNote({
        ...req.body,
        userId: user.id,
      });
      res.json(note);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/workspace/notes/:id", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const note = await storage.updateNote(req.params.id, user.id, req.body);
      res.json(note);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/workspace/notes/:id", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      await storage.deleteNote(req.params.id, user.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== WORKSPACE: CODE SNIPPETS ROUTES ====================

  app.get("/api/workspace/snippets", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const snippets = await storage.getCodeSnippets(user.id);
      res.json(snippets);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/workspace/snippets", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const snippet = await storage.insertCodeSnippet({
        ...req.body,
        userId: user.id,
      });
      res.json(snippet);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== WORKSPACE: LEARNING ROUTES ====================

  app.get("/api/workspace/learning", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const items = await storage.getLearningItems(user.id);
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/workspace/learning", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const item = await storage.insertLearningItem({
        ...req.body,
        userId: user.id,
      });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== WORKSPACE: TIME TRACKING ROUTES ====================

  app.get("/api/workspace/time-entries", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const entries = await storage.getTimeEntries(user.id);
      res.json(entries);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/workspace/time-entries/start", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const entry = await storage.startTimeEntry({
        userId: user.id,
        ...req.body,
      });
      res.json(entry);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/workspace/time-entries/:id/stop", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const entry = await storage.stopTimeEntry(req.params.id, user.id);
      res.json(entry);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== WORKSPACE: HABITS ROUTES ====================

  app.get("/api/workspace/habits", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const habits = await storage.getHabits(user.id);
      res.json(habits);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/workspace/habits", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const habit = await storage.insertHabit({
        ...req.body,
        userId: user.id,
      });
      res.json(habit);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/workspace/habits/:id/log", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const log = await storage.logHabit({
        habitId: req.params.id,
        userId: user.id,
        ...req.body,
      });
      res.json(log);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== WORKSPACE: CALENDAR ROUTES ====================

  app.get("/api/workspace/calendar", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const events = await storage.getCalendarEvents(user.id);
      res.json(events);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/workspace/calendar", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const event = await storage.insertCalendarEvent({
        ...req.body,
        userId: user.id,
      });
      res.json(event);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== BUSINESS: CLIENTS ROUTES ====================

  app.get("/api/business/clients", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const clients = await storage.getClients(user.id);
      res.json(clients);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/business/clients", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const client = await storage.insertClient({
        ...req.body,
        userId: user.id,
      });
      res.json(client);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== BUSINESS: PROPOSALS ROUTES ====================

  app.get("/api/business/proposals", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const proposals = await storage.getProposals(user.id);
      res.json(proposals);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/business/proposals", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const proposal = await storage.insertProposal({
        ...req.body,
        userId: user.id,
      });
      res.json(proposal);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== BUSINESS: INVOICES ROUTES ====================

  app.get("/api/business/invoices", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const invoices = await storage.getInvoices(user.id);
      res.json(invoices);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/business/invoices", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const invoice = await storage.insertInvoice({
        ...req.body,
        userId: user.id,
      });
      res.json(invoice);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== BUSINESS: FINANCE ROUTES ====================

  app.get("/api/business/finance/overview", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const overview = await storage.getFinanceOverview(user.id);
      res.json(overview);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/business/expenses", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const expenses = await storage.getExpenses(user.id);
      res.json(expenses);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/business/expenses", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const expense = await storage.insertExpense({
        ...req.body,
        userId: user.id,
      });
      res.json(expense);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/business/income", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const income = await storage.getIncomeEntries(user.id);
      res.json(income);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/business/income", isAuthenticated, async (req, res) => {
    try {
      const user = requireUser(req);
      const incomeEntry = await storage.insertIncomeEntry({
        ...req.body,
        userId: user.id,
      });
      res.json(incomeEntry);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== RESUME ROUTES ====================

  app.get("/api/resume", async (req, res) => {
    try {
      const sections = await storage.getResumeSections();
      res.json(sections);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/resume", isAdmin, async (req, res) => {
    try {
      const section = await storage.insertResumeSection(req.body);
      res.json(section);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== PLAYGROUND ROUTES ====================

  app.get("/api/playground", async (req, res) => {
    try {
      const entries = await storage.getPlaygroundEntries();
      res.json(entries);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/playground", isAdmin, async (req, res) => {
    try {
      const entry = await storage.insertPlaygroundEntry(req.body);
      res.json(entry);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== SEED ROUTE ====================

  app.post("/api/seed", isAdmin, async (req, res) => {
    try {
      await storage.seedDatabase();
      res.json({ success: true, message: "Database seeded successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
