import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { BinaryTitle } from "@/components/ui/BinaryTitle";
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

export default function ProjectsNew() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "All Projects" },
    { id: "web", label: "Web Apps" },
    { id: "ai", label: "AI/ML" },
    { id: "design", label: "Design" },
  ];

  const featuredProjects = useMemo(
    () => allProjects.filter((project) => project.featured),
    []
  );
  const catalogProjects = useMemo(
    () => allProjects.filter((project) => !project.featured).slice(0, 3),
    []
  );
  const filteredProjects =
    activeFilter === "all"
      ? catalogProjects
      : catalogProjects.filter((project) => project.category === activeFilter);

  return (
    <section
      id="projects"
      className="py-24 bg-gradient-to-b from-slate-950 via-purple-950/10 to-slate-950 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(139,92,246,0.08),transparent_50%),radial-gradient(circle_at_85%_0%,rgba(34,211,238,0.08),transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-purple-400 mb-4">
            Featured Projects
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <BinaryTitle
              text="Showcasing launches that solved real problems"
              className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent"
            />
          </h2>
          <p className="text-slate-400 max-w-3xl mx-auto">
            Curated case studies only: the launches that moved needles for
            classrooms, communities, and indie founders. Each one pairs product
            storytelling with shipping discipline.
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
                <div className="grid md:grid-cols-2 border border-slate-700/60 rounded-3xl overflow-hidden bg-slate-900/50 backdrop-blur-sm shadow-2xl shadow-purple-500/10 hover:border-purple-500/50 transition-all duration-500">
                  <div
                    className={`relative overflow-hidden ${
                      index % 2 === 0 ? "order-1" : "order-2"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 z-10" />
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  </div>

                  <div
                    className={`p-8 md:p-10 flex flex-col gap-6 ${
                      index % 2 === 0 ? "order-2" : "order-1"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-400">
                      <span className="px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300">
                        Featured
                      </span>
                      <span className="px-3 py-1 rounded-full border border-slate-700/50 bg-slate-800/30">
                        {project.category}
                      </span>
                      <span className="px-3 py-1 rounded-full border border-slate-700/50 bg-slate-800/30">
                        {project.status === "wip" ? "In Progress" : "Shipped"}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-3xl font-bold mb-3 text-white">
                        {project.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed">
                        {project.description}
                      </p>
                      {project.outcome && (
                        <p className="text-sm text-purple-400 font-semibold mt-3">
                          Outcome: {project.outcome}
                        </p>
                      )}
                    </div>

                    {project.metrics && (
                      <div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-700/50">
                        {project.metrics.map((metric) => (
                          <div key={metric.label} className="text-center">
                            <p className="text-2xl font-semibold text-white">
                              {metric.value}
                            </p>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                              {metric.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-slate-800/50 text-slate-300 border-slate-700"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {project.links.demo && (
                        <Button
                          className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:opacity-90"
                          asChild
                        >
                          <a
                            href={project.links.demo}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Live Demo
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="border-slate-700 text-slate-300 hover:border-purple-500 hover:text-purple-300"
                        asChild
                      >
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noreferrer"
                        >
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
              <div className="flex flex-wrap gap-2 bg-slate-900/50 border border-slate-800/50 rounded-xl p-2 backdrop-blur-sm">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeFilter === filter.id
                        ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
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
                className={`project-card relative overflow-hidden rounded-2xl border bg-slate-900/50 backdrop-blur-sm shadow-2xl hover:border-purple-500/50 transition-all duration-500 ${
                  project.status === "wip"
                    ? "border-dashed border-2 border-purple-500/50"
                    : "border-slate-700/60"
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                data-testid={`project-card-${project.title
                  .toLowerCase()
                  .replace(/[^a-z]/g, "")}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                <div className="h-64 relative overflow-hidden bg-slate-950/50">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="p-6 flex flex-col gap-4 relative">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">
                      {project.title}
                    </h3>
                    {project.status === "wip" ? (
                      <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded border border-cyan-500/30">
                        🚧 WIP
                      </span>
                    ) : (
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded border border-purple-500/30">
                        Live
                      </span>
                    )}
                  </div>

                  <p className="text-slate-400 text-sm">
                    {project.description}
                  </p>
                  {project.outcome && (
                    <p className="text-xs text-purple-400 font-semibold">
                      {project.outcome}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded bg-purple-500/10 text-purple-300 border border-purple-500/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    {project.links.demo ? (
                      <a
                        href={project.links.demo}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-2 px-4 rounded text-center hover:opacity-90 transition-opacity"
                        data-testid={`project-demo-${project.title
                          .toLowerCase()
                          .replace(/[^a-z]/g, "")}`}
                      >
                        {project.status === "wip" ? "Coming Soon" : "Live Demo"}
                      </a>
                    ) : (
                      <button
                        className="flex-1 bg-slate-800/50 text-slate-500 py-2 px-4 rounded text-center cursor-not-allowed"
                        disabled
                      >
                        Coming Soon
                      </button>
                    )}
                    <a
                      href={project.links.github}
                      className="flex-1 border border-slate-700 text-slate-300 py-2 px-4 rounded text-center hover:bg-slate-800/50 hover:border-purple-500 hover:text-purple-300 transition-all"
                      data-testid={`project-github-${project.title
                        .toLowerCase()
                        .replace(/[^a-z]/g, "")}`}
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
