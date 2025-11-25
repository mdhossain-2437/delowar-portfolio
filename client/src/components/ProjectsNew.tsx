import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Star, TrendingUp, Zap } from "lucide-react";

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

// Sample projects data
const allProjects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description:
      "Full-stack e-commerce solution with real-time inventory, payment processing, and admin dashboard.",
    outcome: "Increased sales by 150% in first quarter",
    category: "web",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    featured: true,
    status: "live",
    image:
      "https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800&h=600&fit=crop",
    links: {
      demo: "#",
      github: "#",
    },
    metrics: [
      { label: "Users", value: "10K+" },
      { label: "Revenue", value: "$500K" },
      { label: "Performance", value: "98" },
    ],
  },
  {
    id: 2,
    title: "AI Chat Application",
    description:
      "Modern chat app with AI-powered responses, real-time messaging, and smart notifications.",
    category: "ai",
    tags: ["Next.js", "OpenAI", "WebSocket", "Redis"],
    featured: true,
    status: "live",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    links: {
      demo: "#",
      github: "#",
    },
    metrics: [
      { label: "Messages", value: "1M+" },
      { label: "Response Time", value: "50ms" },
      { label: "Accuracy", value: "95%" },
    ],
  },
  {
    id: 3,
    title: "Portfolio CMS",
    description:
      "Headless CMS for portfolio websites with drag-and-drop builder and SEO optimization.",
    category: "web",
    tags: ["TypeScript", "GraphQL", "PostgreSQL", "Next.js"],
    featured: false,
    status: "live",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    links: {
      demo: "#",
      github: "#",
    },
  },
  {
    id: 4,
    title: "Design System",
    description:
      "Comprehensive design system with 100+ components, documentation, and Figma integration.",
    category: "design",
    tags: ["React", "Storybook", "Tailwind", "Figma"],
    featured: false,
    status: "live",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    links: {
      demo: "#",
      github: "#",
    },
  },
  {
    id: 5,
    title: "Task Management App",
    description:
      "Collaborative task manager with Kanban boards, time tracking, and team analytics.",
    category: "web",
    tags: ["React", "Firebase", "Material-UI", "Charts"],
    featured: false,
    status: "wip",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
    links: {
      demo: null,
      github: "#",
    },
  },
  {
    id: 6,
    title: "Weather Dashboard",
    description:
      "Real-time weather tracking with beautiful visualizations and location-based alerts.",
    category: "web",
    tags: ["Vue.js", "D3.js", "Weather API", "Tailwind"],
    featured: false,
    status: "live",
    image:
      "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=600&fit=crop",
    links: {
      demo: "#",
      github: "#",
    },
  },
];

const categories = [
  { id: "all", label: "All Projects" },
  { id: "web", label: "Web Apps" },
  { id: "ai", label: "AI Solutions" },
  { id: "design", label: "Design" },
];

export default function ProjectsNew() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const filteredProjects =
    activeCategory === "all"
      ? allProjects
      : allProjects.filter((p) => p.category === activeCategory);

  const featuredProjects = filteredProjects.filter((p) => p.featured);
  const otherProjects = filteredProjects.filter((p) => !p.featured);

  return (
    <section id="projects" className="relative py-24 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-purple-950/10 to-slate-950" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 container-wide gutter">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20"
          >
            <Star className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">
              Featured Work
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              Selected Projects
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            A collection of projects showcasing my expertise in web development,
            AI integration, and design.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center gap-2 p-2 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "text-white"
                    : "text-slate-400 hover:text-white"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {activeCategory === cat.id && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Featured Projects - Bento Grid */}
            {featuredProjects.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    onHoverStart={() => setHoveredProject(project.id)}
                    onHoverEnd={() => setHoveredProject(null)}
                    className={`group relative rounded-3xl overflow-hidden border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm transition-all duration-500 hover:border-purple-500/50 ${
                      index === 0 ? "lg:col-span-2" : ""
                    }`}
                  >
                    {/* Background glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative p-8 md:p-10">
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Content */}
                        <div className="space-y-6">
                          {/* Header */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 uppercase text-xs">
                                {project.status === "live"
                                  ? "Live"
                                  : "In Progress"}
                              </Badge>
                              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 uppercase text-xs">
                                Featured
                              </Badge>
                            </div>
                            <h3 className="text-3xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
                              {project.title}
                            </h3>
                            <p className="text-slate-400 leading-relaxed">
                              {project.description}
                            </p>
                            {project.outcome && (
                              <div className="flex items-start gap-2 p-3 rounded-xl bg-purple-500/5 border border-purple-500/20">
                                <TrendingUp className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-purple-300">
                                  {project.outcome}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-slate-800/50 text-slate-300 border-slate-700 hover:border-purple-500 hover:text-purple-300 transition-colors"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {/* Metrics */}
                          {project.metrics && (
                            <div className="grid grid-cols-3 gap-4">
                              {project.metrics.map((metric) => (
                                <div
                                  key={metric.label}
                                  className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/50"
                                >
                                  <p className="text-2xl font-bold text-purple-400">
                                    {metric.value}
                                  </p>
                                  <p className="text-xs text-slate-500 uppercase tracking-wide">
                                    {metric.label}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-3">
                            {project.links.demo && (
                              <motion.a
                                href={project.links.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
                              >
                                <ExternalLink className="w-4 h-4" />
                                View Live
                              </motion.a>
                            )}
                            <motion.a
                              href={project.links.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-700 text-slate-300 font-semibold hover:border-purple-500 hover:text-purple-300 transition-all"
                            >
                              <Github className="w-4 h-4" />
                              Code
                            </motion.a>
                          </div>
                        </div>

                        {/* Image */}
                        <div className="relative">
                          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          </div>
                          {/* Decorative elements */}
                          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all duration-500" />
                          <div className="absolute -top-4 -left-4 w-24 h-24 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-500/30 transition-all duration-500" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Other Projects - Grid */}
            {otherProjects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                {otherProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-500"
                  >
                    {/* Image */}
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                      <Badge className="absolute top-4 right-4 bg-green-500/20 text-green-300 border-green-500/30 uppercase text-xs">
                        {project.status === "live" ? "Live" : "WIP"}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
                        {project.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs bg-slate-800/50 text-slate-300 border-slate-700"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        {project.links.demo && (
                          <motion.a
                            href={project.links.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm font-semibold"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Demo
                          </motion.a>
                        )}
                        <motion.a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm font-semibold hover:border-purple-500 hover:text-purple-300 transition-all"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.a
            href="/projects"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-slate-800/50 border-2 border-slate-700 text-white font-semibold hover:border-purple-500 hover:text-purple-300 transition-all backdrop-blur-sm"
          >
            View All Projects
            <Zap className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
