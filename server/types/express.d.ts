import type { User as DbUser } from "@shared/schema";

declare global {
  namespace Express {
    // merge Passport user with our DB schema
    interface User extends DbUser {}
    interface Request {
      user: User;
    }
  }
}

export {};
