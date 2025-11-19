## Delowar Portfolio OS

This repository powers a narrative-heavy, engineering-forward portfolio for **Delowar Hossain**.  
Every section doubles as a proof-of-work artifact: real telemetry, edge personalization, AI estimators, gamified UX, micro-frontend demos, and PWA tooling are all wired into the live experience.

---

## Quick Start

```bash
npm install
npm run dev   # launches Express + Vite on 0.0.0.0:5000
npm run check # type-check (tsc)
npm run build # production build (Vite + esbuild server bundle)
```

Environment toggles live in `.env`. Optional tokens:

| Variable | Purpose |
|----------|---------|
| `GITHUB_ACTIONS_TOKEN` | Fetch live workflow runs for the CI/CD status panel |
| `CI_REPO` / `CI_BRANCH` | Override GitHub repo/branch shown in the CI widget |
| `SERVERLESS_METRICS_ENDPOINT` / `SERVERLESS_METRICS_TOKEN` | Point the serverless dashboard to a real provider API |
| `LIGHTHOUSE_PERFORMANCE_SCORE` | Override the Lighthouse widget score (0–1) |
| `LIGHTHOUSE_LAST_AUDIT` | ISO timestamp displayed under the score |

---

## Feature Matrix

| Category | Feature | Implementation |
|----------|---------|----------------|
| **Edge & Performance** | Edge-aware content (English vs Bengali) | `/api/personalization/profile` + `PersonalizationBanner` uses CF/ Vercel geo headers |
| | Security headers visualizer | `SecurityHeadersBadge` hits `/api/health/security` |
| | Lighthouse score widget | `LighthouseScoreWidget` displays `/api/metrics/lighthouse` |
| | Serverless metrics dashboard | `ServerlessMetricsPanel` + `/api/metrics/serverless` |
| | CI/CD status | `CICDStatusWidget` + `/api/metrics/cicd` (GitHub Actions API) |
| | Pre-caching strategy demo | `PrecacheStrategyDemo` queries SW status via `GET_SW_STATUS` |
| | Micro-frontend showcase | `MicroFrontendShowcase` mounts a Vue 3 micro-app via CDN inside React |
| **Niche UX & Immersion** | Brutalism toggle | `BrutalismToggle` flips global `brutalism-mode` class |
| | Audio reactive canvas | `AudioReactiveCanvas` + Web Audio fallback oscillator |
| | Custom cursor physics | `CustomCursor` uses Framer Motion springs |
| | Device motion sensing | `DeviceMotionScene` listens to `deviceorientation` |
| | Accessibility debugger | `AccessibilityDebugger` overlays focus/ARIA hints |
| | Browser fingerprint demo | `BrowserFingerprintDemo` prints UA, fonts, GPU |
| | Cryptic 404 puzzle | `/404` page adds binary/decimal riddle + achievement |
| **Personalization & Utility** | Welcome-back banner | `WelcomeBackBanner` stores visitor name/time |
| | Theme builder & JSON export | `ThemeBuilder` |
| | Digital bucket list | `DigitalBucketList` progress bars |
| | Knowledge graph visualization | `KnowledgeGraph` links skills to projects |
| | Automated media kit | `/media-kit` route exposes press downloads |
| | AI quick estimate | `/api/ai/estimate` + `AIQuickEstimate` |
| **Workflow Transparency** | Tech debt tracker | `TechDebtTracker` radial chart |
| | FPS/RAM overlay | `FPSRamMonitor` pinned widget |
| | Code review heatmap | `/api/engineering/code-reviews` + `CodeReviewHeatmap` |
| | Daily time capsule | `DailyTimeCapsule` |
| | Git branch visualizer | `/api/engineering/branches` + `GitBranchVisualizer` |
| **Gamification & Storytelling** | Dynamic story progression | `DynamicStoryProgression` unlocks beats + achievement |
| | Avatar customization | `AvatarCustomizer` stores accessories/background |
| | Developer battle mini-game | `DeveloperBattleGame` (+ `bug-hunter` achievement) |
| | Isometric site map | `IsometricSiteMap` skewed blocks |
| | Physics dragging gallery | `PhysicsDragGallery` with Framer Motion inertia |
| | Achievements system | `AchievementContext`, `AchievementsPanel`, & triggered hooks |

---

## Achievement System

New interactions (brutalism toggle, audio lab, AI estimator, story unlock, avatar styling, developer battle, 404 puzzle) call `unlock()` in `AchievementContext`. Progress persists via `localStorage` and surfaces in `AchievementsPanel`.

Achievements:

1. **Design Maverick** – enable brutalism mode  
2. **Sonic Vibes** – start the audio reactive canvas  
3. **AI Consultant** – request an estimate  
4. **Story Explorer** – fully unlock the dynamic story  
5. **Avatar Stylist** – customize the hero  
6. **Bug Hunter** – defeat the developer battle bug  
7. **Puzzle Master** – solve the 404 puzzle

---

## Observability APIs

| Endpoint | Description |
|----------|-------------|
| `GET /api/health/security` | Helmet CSP/HSTS profile |
| `GET /api/metrics/lighthouse` | Performance score & timestamp |
| `GET /api/metrics/cicd` | Latest workflow runs (live or fallback) |
| `GET /api/metrics/serverless` | 24h serverless invocation stats |
| `GET /api/personalization/profile` | Edge geo profile |
| `POST /api/ai/estimate` | Heuristic timeline/budget estimate |
| `GET /api/engineering/code-reviews` | Rolling 4-week heatmap data |
| `GET /api/engineering/branches` | Branch graph snapshot |

All endpoints degrade gracefully when optional credentials are missing.

---

## PWA & Service Worker

`client/public/sw.js` precaches the core shell (`sw-2025-11-19`). `PrecacheStrategyDemo` + `ServiceWorkerStatus` surface the current version, cached assets, offline fallbacks, and allow for manual inspection without DevTools. Service worker also responds to `GET_SW_STATUS` messages to power the UI toggles.

---

## Personalization Hooks

- Geo + IP detection (Bangladesh vs USA) swaps hero language hints and region text.
- Welcome-back module remembers visitor name + last visit timestamp.
- Avatar customization persists to `localStorage`, so returning users see the same look + unlock the “Avatar Stylist” badge.

---

## Pages & Navigation

| Route | Purpose |
|-------|---------|
| `/` | Experiential home page with all immersive sections |
| `/media-kit` | Automated press kit with downloadable assets |
| `/contact`, `/resume`, `/playground`, `/uses`, etc. | Legacy sections remain reachable via header/footer |
| `/404` | Puzzle gate that unlocks “Puzzle Master” before redirecting home |

The header & footer were expanded to link the new Media Kit route.

---

## Notes on Extending Data

- **CI/CD Panel** – Provide a `GITHUB_ACTIONS_TOKEN` to swap out the mocked runs.  
- **Serverless Dashboard** – Point `SERVERLESS_METRICS_ENDPOINT` to Vercel/Netlify/Cloudflare metrics to replace the demo payload.  
- **Media Assets** – Drop files into `public/media/*` to satisfy the Media Kit downloads.

---

## Tooling & Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Express + Vite in hybrid mode |
| `npm run build` | `vite build` + `esbuild server/index.ts` |
| `npm run check` | Strict `tsc` (ESNext module targeting ES2022) |
| `npm run test:e2e` | Playwright suite (Chromium, Firefox, WebKit) covering telemetry, puzzles, AI flows, etc. |

The Vite config dedupes React/ReactDOM and supports async plugin loading (Replit cartographer) without top-level await issues.

---

## Security Hardening

`server/security.ts` applies Helmet with CSP/HSTS, disables `x-powered-by`, adds Permissions-Policy, and exposes the security profile for observability. Service worker caches have versioning + messaging for introspection, and the 404 puzzle ensures bots don’t loop.

---

## Credits

Built with ❤️ by Delowar Hossain.  
Feel free to fork, but respect the personal branding assets. PRs & issues are welcome.
