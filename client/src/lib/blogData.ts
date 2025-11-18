export interface BlogSection {
  title: string;
  body: string;
  bullets?: string[];
  media?: {
    type: "image" | "diagram";
    src: string;
    alt: string;
  };
  highlight?: string;
}

export interface BlogMetric {
  label: string;
  value: string;
  context: string;
}

export interface BlogGalleryItem {
  image: string;
  caption: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: "Product" | "Engineering" | "AI" | "Workflow";
  tags: string[];
  publishedAt: string;
  readTime: number;
  views: number;
  coverImage: string;
  content: BlogSection[];
  metrics: BlogMetric[];
  gallery: BlogGalleryItem[];
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Designing a Portfolio that Feels Alive",
    slug: "designing-portfolio-that-feels-alive",
    excerpt:
      "A deep dive into the motion systems and storytelling cues I use to make projects feel cinematic without sacrificing load time.",
    category: "Product",
    tags: ["UX", "Motion", "Storytelling"],
    publishedAt: "2025-01-12",
    readTime: 7,
    views: 2200,
    coverImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    content: [
      {
        title: "Rethinking the hero",
        body:
          "I treat the hero as a living product brief. The animations hint at the systems I ship—responsive, purposeful, and data-aware. Using Framer Motion, I stage micro-stories tied to user intent.",
        media: {
          type: "image",
          src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
          alt: "Storyboarding hero motion states",
        },
        highlight:
          "Every sweep of motion mirrors an async workflow from my client work, which makes the hero feel contextual—not ornamental.",
      },
      {
        title: "Keeping it performant",
        body:
          "IntersectionObservers gate every heavy asset. This keeps motion snappy on mid-tier hardware while preserving the cinematic tone I’m known for.",
        bullets: [
          "Skips WebGL payloads until the hero is visible",
          "Shrinks bundle size by 35% using code-split canvases",
          "Provides graceful fallbacks for prefers-reduced-motion",
        ],
      },
    ],
    metrics: [
      {
        label: "Frame budget",
        value: "14 ms",
        context: "Average animation frame time after progressive loading",
      },
      {
        label: "Interaction depth",
        value: "+36%",
        context: "Increase in hero interactions recorded during user tests",
      },
    ],
    gallery: [
      {
        image:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        caption: "Motion storyboard exported from After Effects.",
      },
      {
        image:
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
        caption: "Figma component map showing the hero’s state machine.",
      },
    ],
  },
  {
    id: 2,
    title: "What I Learned Shipping WebDevWarrior Cohorts",
    slug: "webdevwarrior-cohort-lessons",
    excerpt:
      "From onboarding automation to cohort analytics, here’s how I turned a solo MERN build into a repeatable learning OS.",
    category: "Engineering",
    tags: ["Next.js", "Analytics", "Education"],
    publishedAt: "2024-12-03",
    readTime: 8,
    views: 1890,
    coverImage:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    content: [
      {
        title: "Instrumentation first",
        body:
          "Cohort events stream into a Postgres fact table so we can react to drop-offs weekly. We iterate on copy and pricing with signals, not guesswork.",
        media: {
          type: "diagram",
          src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
          alt: "Analytics pipeline sketch",
        },
      },
      {
        title: "Edge-friendly architecture",
        body:
          "Next.js API routes power personalization while Drizzle jobs reconcile payments, Discord invites, and the private workspace dashboards.",
        bullets: [
          "Edge functions gate content by membership tier",
          "Discord bot sync keeps cohorts aligned automatically",
          "CRM hooks push weekly sentiment summaries to founders",
        ],
      },
    ],
    metrics: [
      {
        label: "Completion rate",
        value: "82%",
        context: "Stable across three cohorts after automation rollout",
      },
      {
        label: "Manual ops",
        value: "-68%",
        context: "Time saved per week by automating onboarding + billing",
      },
    ],
    gallery: [
      {
        image:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
        caption: "Cohort dashboard view with progress indicators.",
      },
      {
        image:
          "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
        caption: "Sample automation handoff map in FigJam.",
      },
    ],
  },
  {
    id: 3,
    title: "My Workflow Stack for Remote Product Sprints",
    slug: "workflow-stack-remote-sprints",
    excerpt:
      "The exact tooling, automations, and rituals I rely on when leading design/dev sprints from Dhaka for teams across 6+ time zones.",
    category: "Workflow",
    tags: ["Remote", "Tooling", "Product"],
    publishedAt: "2024-11-18",
    readTime: 6,
    views: 1650,
    coverImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    content: [
      {
        title: "Async by default",
        body:
          "Status hubs, Loom walkthroughs, and Miro canvases are the first-class citizens. They reduce meetings and let stakeholders review in their own mornings.",
      },
      {
        title: "Automation glue",
        body:
          "Cloudflare Workers and Zapier keep Linear, Notion, and Slack in sync. When a brief lands, dashboards update and clients see the new milestone immediately.",
        highlight:
          "Automation ensures I spend more time on decisions and less time babysitting notifications.",
      },
    ],
    metrics: [
      {
        label: "Meeting reduction",
        value: "40%",
        context: "Live calls replaced by async status hubs and Loom updates",
      },
      {
        label: "Response SLA",
        value: "< 12h",
        context: "Internal SLA kept across 6 time zones using automation",
      },
    ],
    gallery: [
      {
        image:
          "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
        caption: "Async dashboard sample in Notion with stakeholder view.",
      },
    ],
  },
  {
    id: 4,
    title: "Building Kothopokothon: Lessons in WebRTC at Scale",
    slug: "kothopokothon-webrtc-lessons",
    excerpt:
      "How I implemented reliable messaging, voice, and video for communities with fluctuating bandwidth.",
    category: "Engineering",
    tags: ["WebRTC", "Firebase", "Optimization"],
    publishedAt: "2024-10-09",
    readTime: 9,
    views: 2105,
    coverImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    content: [
      {
        title: "Resilience over perfection",
        body:
          "Reconnect heuristics, offline persistence, and honest UI states keep trust high even when signals drop. Users forgive resolution if the app recovers gracefully.",
      },
      {
        title: "Bandwidth-aware design",
        body:
          "Dynamic fallbacks switch to audio-only before the UI glitches. That single pattern increased call completion rate by 18%.",
      },
    ],
    metrics: [
      {
        label: "Call recovery",
        value: "2.4s",
        context: "Average time to re-establish streams after disruptions",
      },
      {
        label: "Completion rate",
        value: "+18%",
        context: "Improvement after audio-first fallback shipped",
      },
    ],
    gallery: [
      {
        image:
          "https://images.unsplash.com/photo-1527430253228-e93688616381?auto=format&fit=crop&w=1200&q=80",
        caption: "WebRTC reconnection diagram from the architecture doc.",
      },
    ],
  },
  {
    id: 5,
    title: "Using AI to Automate Client Status Boards",
    slug: "ai-automated-client-status",
    excerpt:
      "How GPT-4 copilots summarize a week’s worth of experiments, blockers, and decisions for stakeholders automatically.",
    category: "AI",
    tags: ["AI", "Clients", "Automation"],
    publishedAt: "2024-09-22",
    readTime: 7,
    views: 1420,
    coverImage:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1600&q=80",
    content: [
      {
        title: "Copilots that narrate",
        body:
          "Prompts ingest GitHub PR titles, Notion changelog entries, and Slack standups. The AI rewrites them as a stakeholder-friendly flight log.",
        media: {
          type: "image",
          src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
          alt: "AI workflow map",
        },
      },
      {
        title: "Guardrails and reviews",
        body:
          "A human-in-the-loop review is built in. The system highlights low-confidence summaries and surfaces raw links for context.",
      },
    ],
    metrics: [
      {
        label: "Prep time",
        value: "-3 hrs",
        context: "Weekly time saved creating board updates manually",
      },
      {
        label: "Stakeholder CSAT",
        value: "4.7 / 5",
        context: "Average rating from quarterly stakeholder surveys",
      },
    ],
    gallery: [
      {
        image:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        caption: "Status hub with AI-summarized insights and CTA buttons.",
      },
    ],
  },
  {
    id: 6,
    title: "Designing the Creator OS Dashboard",
    slug: "designing-creator-os-dashboard",
    excerpt:
      "A look at the modular dashboard that keeps my private workspace, lab experiments, and proposals under one roof.",
    category: "Product",
    tags: ["Dashboard", "Systems", "Clients"],
    publishedAt: "2024-08-10",
    readTime: 9,
    views: 1330,
    coverImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
    content: [
      {
        title: "System of systems",
        body:
          "Each widget mirrors a real workflow: billing, research spikes, talent network, and lab experiments. Stakeholders can peek into relevant zones via secure links.",
      },
      {
        title: "Narrative dashboards",
        body:
          "Instead of static charts, each block leads with an insight sentence, optional chart, and two CTA buttons (approve, ask, pause).",
        bullets: [
          "Notion for knowledge + project rituals",
          "Linear for engineering signals",
          "Supabase for storing raw telemetry",
        ],
      },
    ],
    metrics: [
      {
        label: "Decision latency",
        value: "-48%",
        context: "Stakeholder approvals sped up thanks to insight-first cards",
      },
      {
        label: "Widget reuse",
        value: "12",
        context: "Reusable modules powering the Creator OS experience",
      },
    ],
    gallery: [
      {
        image:
          "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
        caption: "Creator OS overview board with modular widgets.",
      },
    ],
  },
  {
    id: 7,
    title: "Code Splitting Canvas Scenes in the Hero",
    slug: "code-splitting-canvas-scenes",
    excerpt:
      "Canvas hero scenes shouldn’t block FCP. Here’s how I lazy-load WebGL content responsibly.",
    category: "Engineering",
    tags: ["Performance", "React", "Three.js"],
    publishedAt: "2024-05-15",
    readTime: 6,
    views: 1180,
    coverImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
    content: [
      {
        title: "IntersectionObserver FTW",
        body:
          "I defer loading the Three.js bundle until the hero is visible. This single change cut initial JS by 35% and improved LCP significantly.",
      },
      {
        title: "Graceful degradation",
        body:
          "If WebGL isn’t available, the hero falls back to a gradient and animated copy so the brand still shines on low-power hardware.",
      },
    ],
    metrics: [
      {
        label: "JS bundle",
        value: "-35%",
        context: "Reduction in initial JS transferred before interaction",
      },
      {
        label: "LCP",
        value: "-420 ms",
        context: "LCP improvement on mid-tier Android devices",
      },
    ],
    gallery: [
      {
        image:
          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
        caption: "Lazy loading timeline showing when the canvas hydrates.",
      },
    ],
  },
  {
    id: 8,
    title: "Storytelling with Data in Workspace Dashboards",
    slug: "storytelling-with-data-dashboards",
    excerpt:
      "Instead of drowning clients in charts, I build dashboards that read like a narrative with clear calls to action.",
    category: "Product",
    tags: ["Dashboard", "Data Viz", "Clients"],
    publishedAt: "2024-03-28",
    readTime: 7,
    views: 990,
    coverImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
    content: [
      {
        title: "Context first",
        body:
          "Each section opens with a one-sentence insight. Only then do we show the supporting charts. Clients engage with the story, not just the data.",
      },
      {
        title: "Actionable cards",
        body:
          "Every insight ends with an action (“approve invoice”, “review sprint”). Dashboards become control rooms rather than vanity metrics.",
      },
    ],
    metrics: [
      {
        label: "Action clicks",
        value: "+52%",
        context: "Increase in CTA usage after insight-first redesign",
      },
      {
        label: "Deck length",
        value: "-6 slides",
        context: "Changelog decks replaced by in-dashboard storytelling",
      },
    ],
    gallery: [
      {
        image:
          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
        caption: "Action-oriented dashboard tiles for finance workflows.",
      },
    ],
  },
  {
    id: 9,
    title: "Shipping Accessible Animations",
    slug: "shipping-accessible-animations",
    excerpt:
      "Motion can delight without overwhelming. Here are the accessibility checks I run before going live.",
    category: "Product",
    tags: ["Accessibility", "Motion", "Design"],
    publishedAt: "2024-02-10",
    readTime: 5,
    views: 870,
    coverImage:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80",
    content: [
      {
        title: "Prefer-reduced-motion",
        body:
          "All entrance animations respect prefers-reduced-motion. When it’s enabled, the UI swaps in subtle fades or static states to avoid discomfort.",
      },
      {
        title: "Focus management",
        body:
          "Interactive components retain focus outlines and keyboard ordering. Motion never hides context or steals focus from assistive technologies.",
      },
    ],
    metrics: [
      {
        label: "Accessibility issues",
        value: "-75%",
        context: "Reduction in QA-reported motion issues across releases",
      },
      {
        label: "User comfort",
        value: "4.9 / 5",
        context: "Average rating from beta testers sensitive to motion",
      },
    ],
    gallery: [
      {
        image:
          "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80",
        caption: "Accessibility checklist used during motion QA runs.",
      },
    ],
  },
  {
    id: 10,
    title: "How I Structure Case Studies for Trust",
    slug: "structuring-case-studies",
    excerpt:
      "A repeatable outline I follow so every project page feels like a conversation, not a sales deck.",
    category: "Product",
    tags: ["Case Study", "Content", "Clients"],
    publishedAt: "2024-01-05",
    readTime: 4,
    views: 940,
    coverImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
    content: [
      {
        title: "Lead with the problem",
        body:
          "Each case study opens with the client’s pain point in their own words. New prospects immediately see themselves in the narrative.",
      },
      {
        title: "Show the systems",
        body:
          "Architecture diagrams, workflow screenshots, and before/after metrics highlight the systems thinking behind each outcome.",
      },
    ],
    metrics: [
      {
        label: "Time-to-trust",
        value: "2 mins",
        context: "Average time for prospects to request a call after landing",
      },
      {
        label: "Quote reuse",
        value: "14",
        context: "Client quotes recycled across case studies for credibility",
      },
    ],
    gallery: [
      {
        image:
          "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
        caption: "Case study layout showing narrative + metric pairings.",
      },
    ],
  },
];

export default blogPosts;

export const getAllBlogPosts = () => blogPosts;

export const getBlogPostBySlug = (slug: string) =>
  blogPosts.find((post) => post.slug === slug);

export const getRelatedBlogPosts = (slug: string, limit = 3) => {
  const current = getBlogPostBySlug(slug);
  if (!current) return [];
  return blogPosts
    .filter((post) => post.slug !== slug && post.category === current.category)
    .slice(0, limit);
};

export const getBlogCategories = () => {
  const categories = new Set(blogPosts.map((post) => post.category));
  return ["All", ...Array.from(categories)];
};

export const getAllTags = () => {
  const tags = new Set(blogPosts.flatMap((post) => post.tags));
  return Array.from(tags).sort();
};
