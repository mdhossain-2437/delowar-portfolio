import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Code2, Sparkles } from "lucide-react";

interface PlaygroundProject {
  id: number;
  title: string;
  description: string;
  tags: string[];
  demoUrl: string;
  codeUrl: string;
  gradient: string;
}

const playgroundProjects: PlaygroundProject[] = [
  {
    id: 1,
    title: "CSS Animation Showcase",
    description: "Collection of smooth CSS animations and transitions showcasing modern web animation techniques",
    tags: ["CSS", "Animation", "Frontend"],
    demoUrl: "#",
    codeUrl: "#",
    gradient: "linear-gradient(135deg, hsl(270, 95%, 75%) 0%, hsl(197, 71%, 73%) 100%)",
  },
  {
    id: 2,
    title: "Canvas Drawing App",
    description: "Interactive drawing tool using HTML5 Canvas API with multiple brushes and color options",
    tags: ["Canvas", "JavaScript", "Interactive"],
    demoUrl: "#",
    codeUrl: "#",
    gradient: "linear-gradient(135deg, hsl(197, 71%, 73%) 0%, hsl(142, 72%, 60%) 100%)",
  },
  {
    id: 3,
    title: "Code Syntax Highlighter",
    description: "Custom syntax highlighter component with support for multiple programming languages",
    tags: ["React", "UI Component"],
    demoUrl: "#",
    codeUrl: "#",
    gradient: "linear-gradient(135deg, hsl(142, 72%, 60%) 0%, hsl(270, 95%, 75%) 100%)",
  },
  {
    id: 4,
    title: "Responsive Card Components",
    description: "Reusable card component library with various styles and customization options",
    tags: ["React", "Components", "UI"],
    demoUrl: "#",
    codeUrl: "#",
    gradient: "linear-gradient(135deg, hsl(270, 95%, 75%) 0%, hsl(240, 87%, 65%) 100%)",
  },
  {
    id: 5,
    title: "Mini Game - Tic Tac Toe",
    description: "Classic Tic Tac Toe game built with React featuring AI opponent and score tracking",
    tags: ["React", "Game", "Fun"],
    demoUrl: "#",
    codeUrl: "#",
    gradient: "linear-gradient(135deg, hsl(197, 71%, 73%) 0%, hsl(270, 95%, 75%) 100%)",
  },
  {
    id: 6,
    title: "Weather Dashboard",
    description: "Real-time weather app with beautiful UI and location-based forecasts",
    tags: ["API", "React", "Data"],
    demoUrl: "#",
    codeUrl: "#",
    gradient: "linear-gradient(135deg, hsl(240, 87%, 65%) 0%, hsl(197, 71%, 73%) 100%)",
  },
];

const allTags = ["All", ...Array.from(new Set(playgroundProjects.flatMap(p => p.tags)))];

export default function PlaygroundPage() {
  const [selectedTag, setSelectedTag] = useState("All");

  const filteredProjects = selectedTag === "All"
    ? playgroundProjects
    : playgroundProjects.filter(project => project.tags.includes(selectedTag));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Labs & Experiments
            </h1>
            <Sparkles className="w-8 h-8 text-accent" />
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Small projects, experiments, and code demos I've built for fun and learning. 
            Each one is a playground for exploring new technologies and creative ideas.
          </p>
        </motion.div>

        {/* Filter Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(tag)}
              className={`transition-all duration-300 ${
                selectedTag === tag 
                  ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg scale-105" 
                  : "hover:border-primary/50"
              }`}
              data-testid={`filter-${tag.toLowerCase()}`}
            >
              {tag}
            </Button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ duration: 0.3 }}
              data-testid={`project-card-${project.id}`}
            >
              <Card className="glass-card overflow-hidden h-full group hover:border-primary/50 transition-all duration-300">
                {/* Gradient Thumbnail */}
                <div 
                  className="h-48 w-full relative overflow-hidden"
                  style={{ background: project.gradient }}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Code2 className="w-16 h-16 text-white/80 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  {/* Floating sparkles effect */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Sparkles className="w-6 h-6 text-white animate-pulse" />
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300" data-testid={`project-title-${project.id}`}>
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2" data-testid={`project-description-${project.id}`}>
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary"
                        className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-300"
                        data-testid={`project-tag-${tag.toLowerCase()}`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
                      data-testid={`button-demo-${project.id}`}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Demo
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
                      data-testid={`button-code-${project.id}`}
                    >
                      <Github className="w-4 h-4 mr-2" />
                      View Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Open Source Contributions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="glass-card border-primary/20">
            <CardContent className="p-8 text-center">
              <Github className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Open Source Contributions
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                I love contributing to open source projects and sharing knowledge with the developer community. 
                Check out my GitHub profile to see more of my work and contributions.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
                data-testid="button-github-profile"
              >
                <Github className="w-5 h-5 mr-2" />
                Visit My GitHub
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
