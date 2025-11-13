import { useState } from "react";
import { motion } from "framer-motion";
import webDevWarriorImg from "@assets/generated_images/WebDevWarrior_learning_platform_mockup_71691340.png";
import messengerImg from "@assets/generated_images/Kothopokothon_Messenger_chat_interface_1d2bf312.png";
import recipeBookImg from "@assets/generated_images/Recipe_Book_App_interface_81a207ad.png";
import eventExplorerImg from "@assets/generated_images/Event_Explorer_platform_interface_526a19c7.png";
import ticTacToeImg from "@assets/generated_images/Tic_Tac_Toe_game_interface_10607dc2.png";
import vsCodeThemeImg from "@assets/generated_images/VS_Code_theme_mockup_94c58955.png";
import aiAgentImg from "@assets/generated_images/AI_Coding_Agent_visualization_292c3380.png";

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
      image: webDevWarriorImg,
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
      image: messengerImg,
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
      image: recipeBookImg,
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
      image: eventExplorerImg,
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
      image: ticTacToeImg,
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
      image: vsCodeThemeImg,
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
      image: aiAgentImg,
      links: {
        demo: null,
        github: "#"
      }
    }
  ];

  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

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
                {/* Project Image */}
                <div className="h-64 relative overflow-hidden bg-background/50">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
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
