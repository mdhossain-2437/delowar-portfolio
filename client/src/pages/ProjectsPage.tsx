import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ExternalLink, Github, FileText } from "lucide-react";
import { projects, generateSlug } from "@/lib/projectsData";
import { Helmet } from "react-helmet-async";

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filters = [
    { id: "all", label: "All Projects" },
    { id: "web", label: "Web Apps" },
    { id: "ai", label: "AI/ML" },
    { id: "design", label: "Design" }
  ];

  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Projects | Delowar Hossain</title>
        <meta
          name="description"
          content="A curated list of full-stack web, AI, and design projects with detailed case studies."
        />
      </Helmet>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              My Portfolio
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore my projects showcasing full-stack development, AI/ML experimentation, 
              and design work. Each project includes detailed case studies.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center mb-12">
            <div className="flex flex-wrap gap-2 bg-muted/50 rounded-lg p-2 glass-card">
              {filters.map((filter) => (
                <motion.button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-6 py-2.5 rounded-md font-medium transition-all ${
                    activeFilter === filter.id
                      ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg'
                      : 'hover:bg-secondary/80'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  data-testid={`filter-${filter.id}`}
                >
                  {filter.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="glass-card rounded-lg overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                layout
                whileHover={{ y: -10 }}
                data-testid={`project-card-${generateSlug(project.title)}`}
              >
                {/* Project Image */}
                <div className="h-48 relative overflow-hidden bg-background/50">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Status Badge Overlay */}
                  <div className="absolute top-3 right-3">
                    {project.featured && (
                      <span className="text-xs bg-primary/90 text-primary-foreground px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                        ⭐ Featured
                      </span>
                    )}
                    {project.status === 'wip' && (
                      <span className="text-xs bg-accent/90 text-accent-foreground px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                        🚧 WIP
                      </span>
                    )}
                    {project.status === 'live' && !project.featured && (
                      <span className="text-xs bg-green-500/90 text-white px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                        ✓ Live
                      </span>
                    )}
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {project.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tag}
                        className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                          tagIndex % 2 === 0 
                            ? 'bg-primary/20 text-primary' 
                            : 'bg-accent/20 text-accent'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    {project.links.demo ? (
                      <a
                        href={project.links.demo}
                        className="flex items-center justify-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary py-2 px-3 rounded-md text-sm font-medium transition-colors"
                        data-testid={`demo-${generateSlug(project.title)}`}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {project.status === 'wip' ? 'Soon' : 'Demo'}
                      </a>
                    ) : (
                      <button
                        className="flex items-center justify-center gap-1.5 bg-muted text-muted-foreground py-2 px-3 rounded-md text-sm font-medium cursor-not-allowed"
                        disabled
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Soon
                      </button>
                    )}
                    
                    <a
                      href={project.links.github}
                      className="flex items-center justify-center gap-1.5 bg-secondary/50 hover:bg-secondary text-foreground py-2 px-3 rounded-md text-sm font-medium transition-colors"
                      data-testid={`github-${generateSlug(project.title)}`}
                    >
                      <Github className="h-3.5 w-3.5" />
                      Code
                    </a>
                    
                    <Link
                      to={`/projects/${generateSlug(project.title)}`}
                      className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground py-2 px-3 rounded-md text-sm font-medium transition-opacity w-full"
                      data-testid={`case-study-${generateSlug(project.title)}`}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Study
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-xl text-muted-foreground">
                No projects found in this category.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
