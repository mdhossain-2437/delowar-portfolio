import "dotenv/config";
import express, { type Request, Response } from "express";
import { registerRoutes } from "../server/routes";
import { applySecurity } from "../server/security";

const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: false, limit: "2mb" }));

applySecurity(app);

// Initialize routes
let routesInitialized = false;

const initializeApp = async () => {
  if (!routesInitialized) {
    await registerRoutes(app);
    routesInitialized = true;
  }
  return app;
};

// Vercel serverless function handler
export default async (req: Request, res: Response) => {
  const app = await initializeApp();
  return app(req, res);
};
