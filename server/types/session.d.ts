import "express-session";

declare module "express-session" {
  interface SessionData {
    githubOAuthState?: string;
    githubUser?: {
      id: string;
      login: string;
      name: string;
      avatarUrl: string;
      profileUrl: string;
    };
  }
}
