import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import webDevWarriorImg from "@assets/generated_images/WebDevWarrior_learning_platform_mockup_71691340.png";
import messengerImg from "@assets/generated_images/Kothopokothon_Messenger_chat_interface_1d2bf312.png";
import recipeBookImg from "@assets/generated_images/Recipe_Book_App_interface_81a207ad.png";
import eventExplorerImg from "@assets/generated_images/Event_Explorer_platform_interface_526a19c7.png";
import ticTacToeImg from "@assets/generated_images/Tic_Tac_Toe_game_interface_10607dc2.png";
import vsCodeThemeImg from "@assets/generated_images/VS_Code_theme_mockup_94c58955.png";
import aiAgentImg from "@assets/generated_images/AI_Coding_Agent_visualization_292c3380.png";

type Project = {
  id: number;
  title: string;
  description: string;
  outcome?: string;
  category: "web" | "ai" | "design";
  tags: string[];
  featured: boolean;
  status: "live" | "wip";
  image: string;
  links: {
    demo: string | null;
    github: string;
  };
  metrics?: {
    label: string;
    value: string;
  }[];
};

const allProjects: Project[] = [
  {
    id: 1,
    title: "WebDevWarrior",
    description:
      "Full-stack learning OS with cohort onboarding, serverless lessons, AI recap notes, and multi-tenant analytics for mentors.",
    outcome: "Launched 3 paid cohorts and reduced onboarding time by 45%.",
    category: "web",
    tags: ["Next.js 14", "tRPC", "Postgres", "Stripe", "R2"],
    featured: true,
    status: "live",
    image: webDevWarriorImg,
    links: {
      demo: "https://webdevwarrior.delowar.dev",
      github: "https://github.com/mdhossain-2437/webdevwarrior",
    },
    metrics: [
      { label: "Active learners", value: "2.4K" },
      { label: "Completes / wk", value: "480" },
      { label: "NPS", value: "4.9/5" },
    ],
  },
  {
    id: 2,
    title: "Kothopokothon Messenger",
    description:
      "Realtime messenger with shadcn UI, WebRTC calls, AI auto-replies, and mod tools built for community managers.",
    outcome: "Keeps 12+ communities active with sub-80ms latency.",
    category: "web",
    tags: ["React", "Firebase", "WebRTC", "Cloud Functions"],
    featured: true,
    status: "live",
    image: messengerImg,
    links: {
      demo: "https://messenger.delowar.dev",
      github: "https://github.com/mdhossain-2437/kothopokothon",
    },
    metrics: [
      { label: "Monthly messages", value: "1.2M" },
      { label: "Latency", value: "<80ms" },
      { label: "Call success", value: "99.1%" },
    ],
  },
  {
    id: 3,
    title: "Recipe Book App",
    description:
      "Supabase + Next.js recipe command center with AI meal planning, macro tracking, and offline-first pantry sync.",
    outcome: "4x retention compared to the earlier Firebase build.",
    category: "web",
    tags: ["Next.js", "Supabase", "Tailwind", "OpenAI"],
    featured: false,
    status: "live",
    image: recipeBookImg,
    links: {
      demo: "https://recipes.delowar.dev",
      github: "https://github.com/mdhossain-2437/recipe-book",
    },
  },
  {
    id: 4,
    title: "Event Explorer",
    description:
      "Micro-SaaS for indie events featuring Clerk auth, mapbox overlays, waitlist automation, and Notion syncing.",
    outcome: "Processes 8k+ RSVPs with automated waitlist nudges.",
    category: "web",
    tags: ["Remix", "Clerk", "Prisma", "Mapbox"],
    featured: false,
    status: "live",
    image: eventExplorerImg,
    links: {
      demo: "https://events.delowar.dev",
      github: "https://github.com/mdhossain-2437/event-explorer",
    },
  },
  {
    id: 5,
    title: "Tic Tac Toe Pro",
    description:
      "Playable micro-experience exploring WebGPU shaders, haptic feedback, and multiplayer via Liveblocks.",
    outcome: "Used in 3 workshops to teach state machines faster.",
    category: "web",
    tags: ["React", "Liveblocks", "WebGPU", "Framer Motion"],
    featured: false,
    status: "live",
    image: ticTacToeImg,
    links: {
      demo: "https://play.delowar.dev/tictactoe",
      github: "https://github.com/mdhossain-2437/tictactoe-pro",
    },
  },
  {
    id: 6,
    title: "The Compiled Thought Theme",
    description:
      "Custom VS Code + Raycast theme pack with JetBrains Mono ligatures, 3D cover art, and tone-mapped color ramps.",
    outcome: "5k+ downloads, highlighted in the VS Code marketplace.",
    category: "design",
    tags: ["VS Code", "Figma Tokens", "Raycast", "Design Systems"],
    featured: false,
    status: "live",
    image: vsCodeThemeImg,
    links: {
      demo: "https://marketplace.visualstudio.com/items?itemName=delowar.compiled-thought",
      github: "https://github.com/mdhossain-2437/vscode-compiled-thought",
    },
  },
  {
    id: 7,
    title: "AI Coding Agent",
    description:
      "LangChain + Next API routes powering a developer copilot that schedules focus blocks, triages bugs, and drafts PRs.",
    outcome: "Early testers report a 30% faster code review loop.",
    category: "ai",
    tags: ["Next.js", "LangChain", "Pinecone", "OpenAI"],
    featured: false,
    status: "wip",
    image: aiAgentImg,
    links: {
      demo: null,
      github: "https://github.com/mdhossain-2437/ai-coding-agent",
    },
  },
];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "All Projects" },
    { id: "web", label: "Web Apps" },
    { id: "ai", label: "AI/ML" },
    { id: "design", label: "Design" },
  ];

  const featuredProjects = useMemo(
    () => allProjects.filter((project) => project.featured),
    [],
  );
  const catalogProjects = useMemo(
    () => allProjects.filter((project) => !project.featured),
    [],
  );
  const filteredProjects =
    activeFilter === "all"
      ? catalogProjects
      : catalogProjects.filter((project) => project.category === activeFilter);

  return (
    <section id="projects" className="py-24 bg-gradient-to-b from-card to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground mb-4">
            Featured Projects
          </p>
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4">
            Showcasing launches that solved real problems
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Every build here is a fusion of product thinking, system design, and animation craft.
            These launches power classrooms, communities, and indie businesses.
          </p>
        </motion.div>

        {featuredProjects.length > 0 && (
          <div className="space-y-16 mb-20">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="grid md:grid-cols-2 border border-border/60 rounded-3xl overflow-hidden bg-card shadow-2xl shadow-primary/10">
                  <div
                    className={`relative overflow-hidden ${
                      index % 2 === 0 ? "order-1" : "order-2"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 z-10" />
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div
                    className={`p-8 md:p-10 flex flex-col gap-6 ${
                      index % 2 === 0 ? "order-2" : "order-1"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      <span className="px-3 py-1 rounded-full border border-white/20 bg-white/5 text-primary">
                        Featured
                      </span>
                      <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5">
                        {project.category}
                      </span>
                      <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5">
                        {project.status === "wip" ? "In Progress" : "Shipped"}
                      </span>
                    </div>

                <div>
                  <h3 className="text-3xl font-bold mb-3">{project.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                  {project.outcome && (
                    <p className="text-sm text-primary/90 font-semibold mt-3">
                      Outcome: {project.outcome}
                    </p>
                  )}
                </div>

                    {project.metrics && (
                      <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/10">
                        {project.metrics.map((metric) => (
                          <div key={metric.label} className="text-center">
                            <p className="text-2xl font-semibold text-foreground">
                              {metric.value}
                            </p>
                            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                              {metric.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {project.links.demo && (
                        <Button
                          className="bg-gradient-to-r from-primary via-accent to-primary"
                          asChild
                        >
                          <a href={project.links.demo} target="_blank" rel="noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Live Demo
                          </a>
                        </Button>
                      )}
                      <Button variant="outline" asChild>
                        <a href={project.links.github} target="_blank" rel="noreferrer">
                          <Github className="w-4 h-4 mr-2" />
                          Source
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {catalogProjects.length > 0 && (
            <div className="flex justify-center mb-12">
              <div className="flex flex-wrap gap-2 bg-muted rounded-lg p-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      activeFilter === filter.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary"
                    }`}
                    data-testid={`project-filter-${filter.id}`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className={`project-card glass-card rounded-lg overflow-hidden ${
                  project.status === "wip" ? "border-dashed border-2 border-primary/50" : ""
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                data-testid={`project-card-${project.title.toLowerCase().replace(/[^a-z]/g, "")}`}
              >
                <div className="h-64 relative overflow-hidden bg-background/50">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    {project.status === "wip" ? (
                      <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                        🚧 WIP
                      </span>
                    ) : (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                        Live
                      </span>
                    )}
                  </div>

                  <p className="text-muted-foreground text-sm">{project.description}</p>
                  {project.outcome && (
                    <p className="text-xs text-primary/90 font-semibold">
                      {project.outcome}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded bg-primary/15 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    {project.links.demo ? (
                      <a
                        href={project.links.demo}
                        className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded text-center hover:opacity-90 transition-opacity"
                        data-testid={`project-demo-${project.title.toLowerCase().replace(/[^a-z]/g, "")}`}
                      >
                        {project.status === "wip" ? "Coming Soon" : "Live Demo"}
                      </a>
                    ) : (
                      <button
                        className="flex-1 bg-muted text-muted-foreground py-2 px-4 rounded text-center cursor-not-allowed"
                        disabled
                      >
                        Coming Soon
                      </button>
                    )}
                    <a
                      href={project.links.github}
                      className="flex-1 border border-border py-2 px-4 rounded text-center hover:bg-muted transition-colors"
                      data-testid={`project-github-${project.title.toLowerCase().replace(/[^a-z]/g, "")}`}
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
