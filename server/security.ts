import type { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";

type SecurityProfile = {
  mode: "production" | "development";
  csp: typeof PROD_CSP | typeof DEV_CSP;
  hstsEnabled: boolean;
};

const PROD_CSP = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
    imgSrc: ["'self'", "data:", "https://*"],
    connectSrc: ["'self'", "https://api.delowarhossain.dev", "https://*.ingest.sentry.io"],
    frameSrc: ["'self'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
};

const DEV_CSP = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'", "http://localhost:5000"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    fontSrc: ["'self'", "data:"],
    imgSrc: ["'self'", "data:", "blob:"],
    connectSrc: ["'self'", "ws://localhost:5000", "http://localhost:5000"],
    frameSrc: ["'self'"],
    objectSrc: ["'none'"],
  },
};

let profile: SecurityProfile | undefined;

export function applySecurity(app: Express) {
  const isProduction = app.get("env") === "production";

  app.disable("x-powered-by");

  const csp = isProduction ? PROD_CSP : DEV_CSP;
  profile = {
    mode: isProduction ? "production" : "development",
    csp,
    hstsEnabled: Boolean(isProduction),
  };

  app.use(
    helmet({
      contentSecurityPolicy: csp,
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
      crossOriginResourcePolicy: { policy: "same-origin" },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      dnsPrefetchControl: { allow: false },
      frameguard: { action: "deny" },
      hsts: isProduction
        ? {
            maxAge: 60 * 60 * 24 * 365,
            includeSubDomains: true,
            preload: true,
          }
        : false,
      permittedCrossDomainPolicies: { permittedPolicies: "none" },
    }),
  );

  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-DNS-Prefetch-Control", "off");
    next();
  });
}

export function getSecurityProfile() {
  return profile;
}
