import "dotenv/config";
import express, { type Request, Response } from "express";
import { createServer } from "http";
import { registerRoutes } from "../server/routes";
import { applySecurity } from "../server/security";

const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: false, limit: "2mb" }));

applySecurity(app);

// Initialize routes once
let initialized = false;
let server: ReturnType<typeof createServer>;

const initializeApp = async () => {
  if (!initialized) {
    server = await registerRoutes(app);
    initialized = true;
  }
};

// Initialize on cold start
initializeApp();

// Vercel serverless function handler
export default async (req: Request, res: Response) => {
  await initializeApp();
  app(req, res);
};
