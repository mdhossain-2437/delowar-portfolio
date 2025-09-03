import { useState } from "react";
import { motion } from "framer-motion";

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "All Projects" },
    { id: "web", label: "Web Apps" },
    { id: "ai", label: "AI/ML" },
    { id: "design", label: "Design" }
  ];

  const projects = [
    {
      id: 1,
      title: "WebDevWarrior",
      description: "A comprehensive learning platform built with MERN stack featuring user authentication, course enrollments, admin dashboard, and dynamic routing for new developers.",
      category: "web",
      tags: ["React", "Node.js", "MongoDB", "Tailwind"],
      featured: true,
      status: "live",
      links: {
        demo: "#",
        github: "#"
      }
    },
    {
      id: 2,
      title: "Kothopokothon Messenger",
      description: "A secure, real-time WhatsApp-style chat application with E2E encryption, voice/video calling, media sharing, and admin control panel.",
      category: "web",
      tags: ["React", "Firebase", "shadcn/ui", "WebRTC"],
      featured: false,
      status: "live",
      links: {
        demo: "#",
        github: "#"
      }
    },
    {
      id: 3,
      title: "Recipe Book App",
      description: "Full-stack recipe management app with Google/email authentication, recipe CRUD operations, wishlist functionality, and cuisine filtering.",
      category: "web",
      tags: ["React", "Firebase", "MongoDB", "Node.js"],
      featured: false,
      status: "live",
      links: {
        demo: "#",
        github: "#"
      }
    },
    {
      id: 4,
      title: "Event Explorer",
      description: "Sleek event discovery platform with Firebase authentication, seat reservation system, user feedback, and smooth AOS animations.",
      category: "web",
      tags: ["React", "Tailwind", "Firebase", "AOS"],
      featured: false,
      status: "live",
      links: {
        demo: "#",
        github: "#"
      }
    },
    {
      id: 5,
      title: "Tic Tac Toe Pro",
      description: "Polished, interactive game built with React and TypeScript featuring responsive design, smooth animations, and multiple game modes.",
      category: "web",
      tags: ["React", "TypeScript", "Framer Motion"],
      featured: false,
      status: "live",
      links: {
        demo: "#",
        github: "#"
      }
    },
    {
      id: 6,
      title: "The Compiled Thought Theme",
      description: "Custom VS Code theme for deep thinkers and developers who prefer elegant minimalism. Features dimmed white background with soft syntax highlights.",
      category: "design",
      tags: ["VS Code", "Theme JSON", "Design"],
      featured: false,
      status: "live",
      links: {
        demo: "#",
        github: "#"
      }
    },
    {
      id: 7,
      title: "AI Coding Agent",
      description: "Building an intelligent developer agent that assists with code generation, debugging, and learning. Exploring LangChain and custom LLM integration.",
      category: "ai",
      tags: ["Python", "LangChain", "AI/ML"],
      featured: false,
      status: "wip",
      links: {
        demo: null,
        github: "#"
      }
    }
  ];

  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  const getProjectSVG = (category: string, title: string) => {
    switch (category) {
      case "web":
        if (title.includes("Messenger")) {
          return (
            <svg viewBox="0 0 200 120" className="w-32 h-20">
              <rect x="20" y="20" width="160" height="80" rx="8" fill="none" stroke="hsl(197 71% 73%)" strokeWidth="2"/>
              <circle cx="40" cy="40" r="6" fill="hsl(197 71% 73%)"/>
              <rect x="55" y="35" width="40" height="3" fill="hsl(270 95% 75%)"/>
              <rect x="55" y="42" width="25" height="3" fill="hsl(142 72% 60%)"/>
              <circle cx="160" cy="60" r="6" fill="hsl(270 95% 75%)"/>
              <rect x="105" y="55" width="40" height="3" fill="hsl(197 71% 73%)"/>
              <rect x="125" y="62" width="25" height="3" fill="hsl(142 72% 60%)"/>
              <rect x="30" y="85" width="100" height="8" rx="4" fill="hsl(217 32% 17%)"/>
              <circle cx="155" cy="89" r="4" fill="hsl(270 95% 75%)"/>
            </svg>
          );
        } else if (title.includes("Recipe")) {
          return (
            <svg viewBox="0 0 200 120" className="w-32 h-20">
              <rect x="30" y="25" width="140" height="70" rx="8" fill="none" stroke="hsl(142 72% 60%)" strokeWidth="2"/>
              <circle cx="60" cy="50" r="15" fill="hsl(142 72% 60%)" opacity="0.3"/>
              <rect x="85" y="40" width="60" height="4" fill="hsl(270 95% 75%)"/>
              <rect x="85" y="50" width="40" height="3" fill="hsl(197 71% 73%)"/>
              <rect x="85" y="60" width="50" height="3" fill="hsl(142 72% 60%)"/>
              <rect x="40" y="75" width="20" height="3" fill="hsl(270 95% 75%)" opacity="0.7"/>
              <rect x="70" y="75" width="25" height="3" fill="hsl(197 71% 73%)" opacity="0.7"/>
              <rect x="105" y="75" width="30" height="3" fill="hsl(142 72% 60%)" opacity="0.7"/>
            </svg>
          );
        } else if (title.includes("Event")) {
          return (
            <svg viewBox="0 0 200 120" className="w-32 h-20">
              <rect x="25" y="30" width="150" height="60" rx="8" fill="none" stroke="hsl(197 71% 73%)" strokeWidth="2"/>
              <rect x="35" y="20" width="130" height="20" rx="4" fill="hsl(197 71% 73%)" opacity="0.3"/>
              <rect x="35" y="45" width="60" height="8" fill="hsl(270 95% 75%)" opacity="0.6"/>
              <rect x="35" y="58" width="40" height="4" fill="hsl(142 72% 60%)" opacity="0.6"/>
              <rect x="35" y="68" width="80" height="4" fill="hsl(197 71% 73%)" opacity="0.6"/>
              <circle cx="140" cy="65" r="12" fill="hsl(270 95% 75%)" opacity="0.4"/>
              <text x="134" y="70" fontFamily="monospace" fontSize="8" fill="hsl(270 95% 75%)">📅</text>
            </svg>
          );
        } else if (title.includes("Tic Tac Toe")) {
          return (
            <svg viewBox="0 0 120 120" className="w-24 h-24">
              <g stroke="hsl(270 95% 75%)" strokeWidth="3" fill="none">
                <line x1="40" y1="20" x2="40" y2="100"/>
                <line x1="80" y1="20" x2="80" y2="100"/>
                <line x1="20" y1="40" x2="100" y2="40"/>
                <line x1="20" y1="80" x2="100" y2="80"/>
              </g>
              <circle cx="30" cy="30" r="8" stroke="hsl(197 71% 73%)" strokeWidth="3" fill="none"/>
              <g stroke="hsl(142 72% 60%)" strokeWidth="3">
                <line x1="65" y1="45" x2="95" y2="75"/>
                <line x1="95" y1="45" x2="65" y2="75"/>
              </g>
              <circle cx="30" cy="90" r="8" stroke="hsl(197 71% 73%)" strokeWidth="3" fill="none"/>
            </svg>
          );
        } else {
          return (
            <svg viewBox="0 0 200 120" className="w-32 h-20">
              <rect x="20" y="20" width="160" height="80" rx="8" fill="none" stroke="hsl(270 95% 75%)" strokeWidth="2"/>
              <circle cx="40" cy="40" r="8" fill="hsl(270 95% 75%)"/>
              <rect x="60" y="35" width="60" height="4" fill="hsl(197 71% 73%)"/>
              <rect x="60" y="45" width="40" height="4" fill="hsl(142 72% 60%)"/>
              <rect x="30" y="65" width="120" height="2" fill="hsl(270 95% 75%)" opacity="0.5"/>
              <rect x="30" y="75" width="80" height="2" fill="hsl(197 71% 73%)" opacity="0.5"/>
              <rect x="30" y="85" width="100" height="2" fill="hsl(142 72% 60%)" opacity="0.5"/>
            </svg>
          );
        }
      case "design":
        return (
          <svg viewBox="0 0 200 120" className="w-32 h-20">
            <rect x="20" y="20" width="160" height="80" rx="4" fill="hsl(222 84% 8%)" stroke="hsl(217 32% 17%)" strokeWidth="1"/>
            <rect x="20" y="20" width="160" height="15" fill="hsl(217 32% 15%)"/>
            <rect x="25" y="40" width="4" height="50" fill="hsl(197 71% 73%)" opacity="0.8"/>
            <rect x="35" y="45" width="30" height="3" fill="hsl(270 95% 75%)"/>
            <rect x="35" y="55" width="40" height="3" fill="hsl(142 72% 60%)"/>
            <rect x="35" y="65" width="25" height="3" fill="hsl(197 71% 73%)"/>
            <rect x="35" y="75" width="50" height="3" fill="hsl(270 95% 75%)"/>
            <rect x="35" y="85" width="35" height="3" fill="hsl(142 72% 60%)"/>
          </svg>
        );
      case "ai":
        return (
          <svg viewBox="0 0 200 120" className="w-32 h-20">
            <circle cx="100" cy="60" r="30" fill="none" stroke="hsl(270 95% 75%)" strokeWidth="2" strokeDasharray="5,5" opacity="0.8"/>
            <circle cx="85" cy="50" r="3" fill="hsl(197 71% 73%)"/>
            <circle cx="115" cy="50" r="3" fill="hsl(197 71% 73%)"/>
            <path d="M 85 70 Q 100 80 115 70" stroke="hsl(142 72% 60%)" strokeWidth="2" fill="none"/>
            <rect x="70" y="25" width="60" height="3" fill="hsl(270 95% 75%)" opacity="0.6"/>
            <rect x="75" y="95" width="50" height="3" fill="hsl(197 71% 73%)" opacity="0.6"/>
            <circle cx="60" cy="40" r="2" fill="hsl(142 72% 60%)" opacity="0.5"/>
            <circle cx="140" cy="80" r="2" fill="hsl(270 95% 75%)" opacity="0.5"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section id="projects" className="py-24 bg-gradient-to-b from-card to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>

          {/* Project Filters */}
          <div className="flex justify-center mb-12">
            <div className="flex flex-wrap gap-2 bg-muted rounded-lg p-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary'
                  }`}
                  data-testid={`project-filter-${filter.id}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className={`project-card glass-card rounded-lg overflow-hidden ${
                  project.status === 'wip' ? 'border-dashed border-2 border-primary/50' : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                data-testid={`project-card-${project.title.toLowerCase().replace(/[^a-z]/g, '')}`}
              >
                {/* Project Image/SVG */}
                <div className={`h-48 bg-gradient-to-br ${
                  project.category === 'ai' ? 'from-primary/10 to-accent/10' :
                  project.category === 'design' ? 'from-accent/20 to-primary/20' :
                  'from-primary/20 to-accent/20'
                } relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {getProjectSVG(project.category, project.title)}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    {project.featured && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">🔥 Featured</span>
                    )}
                    {project.status === 'wip' && (
                      <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">🚧 WIP</span>
                    )}
                  </div>

                  <p className="text-muted-foreground mb-4">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tag}
                        className={`px-2 py-1 text-xs rounded ${
                          tagIndex % 2 === 0 ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
                        }`}
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
                        data-testid={`project-demo-${project.title.toLowerCase().replace(/[^a-z]/g, '')}`}
                      >
                        {project.status === 'wip' ? 'Coming Soon' : 'Live Demo'}
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
                      data-testid={`project-github-${project.title.toLowerCase().replace(/[^a-z]/g, '')}`}
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
