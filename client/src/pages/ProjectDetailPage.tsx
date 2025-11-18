import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Users,
  Target, 
  Code, 
  Lightbulb, 
  TrendingUp,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { getProjectBySlug, getRelatedProjects, generateSlug } from "@/lib/projectsData";
import { Helmet } from "react-helmet-async";

export default function ProjectDetailPage() {
  const { slug = "" } = useParams();
  const project = getProjectBySlug(slug);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const relatedProjects = getRelatedProjects(project.id, 3);
  const caseStudy = project.caseStudy;

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Helmet>
          <title>{project.title} | Delowar Hossain</title>
          <meta name="description" content={project.description} />
        </Helmet>

        <Link to="/projects">
          <Button variant="ghost" className="mb-8 group" data-testid="back-to-projects">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Button>
        </Link>

        {/* Hero Section */}
        <motion.div {...fadeInUp}>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="text-sm">
              {project.category.toUpperCase()}
            </Badge>
            {project.status === 'live' ? (
              <Badge className="bg-green-500 hover:bg-green-600">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Live
              </Badge>
            ) : (
              <Badge variant="secondary">
                <AlertCircle className="h-3 w-3 mr-1" />
                Work in Progress
              </Badge>
            )}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            {project.title}
          </h1>

          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {caseStudy.overview.fullDescription}
          </p>

          {/* Action Links */}
          <div className="flex flex-wrap gap-3 mb-12">
            {project.links.demo && (
              <Button asChild size="lg" className="group">
                <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Live Demo
                </a>
              </Button>
            )}
            <Button asChild variant="outline" size="lg" className="group">
              <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                View Code
              </a>
            </Button>
          </div>

          {/* Hero Image */}
          <div className="rounded-xl overflow-hidden shadow-2xl mb-16 glass-card">
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-auto"
            />
          </div>
        </motion.div>

        {/* Overview Section */}
        <motion.section 
          {...fadeInUp}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-16"
        >
          <Card className="glass-card">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <Target className="h-8 w-8 text-primary" />
                Project Overview
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                    Target Users
                  </h3>
                  <ul className="space-y-2">
                    {caseStudy.overview.targetUsers.map((user, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                        <span>{user}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                    Timeline
                  </h3>
                  <p className="text-lg">{caseStudy.overview.timeline}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Problem Statement */}
        <motion.section 
          {...fadeInUp}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-6">Problem Statement</h2>
          
          <Card className="glass-card mb-6">
            <CardContent className="p-8">
              <p className="text-lg mb-6 leading-relaxed font-medium">
                {caseStudy.problem.statement}
              </p>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Context</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {caseStudy.problem.context}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">User Needs</h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {caseStudy.problem.userNeeds.map((need, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{need}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Role & Tech Stack */}
        <motion.section 
          {...fadeInUp}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Code className="h-8 w-8 text-accent" />
            Role & Technology
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Role */}
            <Card className="glass-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">{caseStudy.role.position}</h3>
                <ul className="space-y-2">
                  {caseStudy.role.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">•</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Tech Stack */}
            <Card className="glass-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Tech Stack</h3>
                <div className="space-y-3">
                  {caseStudy.techStack.map((tech, idx) => (
                    <div key={idx} className="border-l-2 border-primary/30 pl-3">
                      <h4 className="font-semibold text-sm">{tech.name}</h4>
                      <p className="text-xs text-muted-foreground">{tech.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Architecture */}
          <Card className="glass-card mt-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-3">Architecture</h3>
              <p className="text-muted-foreground leading-relaxed">
                {caseStudy.architecture}
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* Features */}
        <motion.section 
          {...fadeInUp}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-6">Key Features</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {caseStudy.features.map((feature, idx) => (
              <Card key={idx} className="glass-card hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Challenges & Solutions */}
        <motion.section 
          {...fadeInUp}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Lightbulb className="h-8 w-8 text-accent" />
            Challenges & Solutions
          </h2>
          
          <div className="space-y-6">
            {caseStudy.challenges.map((item, idx) => (
              <Card key={idx} className="glass-card">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <Badge variant="outline" className="mb-2">Challenge #{idx + 1}</Badge>
                    <h3 className="text-xl font-bold">{item.challenge}</h3>
                  </div>
                  
                  <div className="mb-4 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                    <h4 className="font-semibold mb-2 text-primary">Solution</h4>
                    <p className="text-sm leading-relaxed">{item.solution}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Key Learnings</h4>
                    <ul className="space-y-1">
                      {item.learnings.map((learning, lIdx) => (
                        <li key={lIdx} className="flex items-start gap-2 text-sm">
                          <span className="text-accent mt-1">→</span>
                          <span>{learning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Results & Impact */}
        <motion.section 
          {...fadeInUp}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            Results & Impact
          </h2>
          
          <Card className="glass-card">
            <CardContent className="p-8">
              {/* Metrics */}
              {caseStudy.results.metrics && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {caseStudy.results.metrics.map((metric, idx) => (
                      <div key={idx} className="text-center p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                        <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                          {metric.value}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Impact */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">Impact</h3>
                <ul className="space-y-2">
                  {caseStudy.results.impact.map((impact, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{impact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Feedback */}
              {caseStudy.results.feedback && (
                <div className="p-4 bg-accent/10 rounded-lg border-l-4 border-accent italic">
                  "{caseStudy.results.feedback}"
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>

        {/* Future Improvements */}
        <motion.section 
          {...fadeInUp}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-6">Future Improvements</h2>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              <ul className="grid md:grid-cols-2 gap-3">
                {caseStudy.futureImprovements.map((improvement, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-accent mt-1">▸</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.section>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <motion.section 
            {...fadeInUp}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-6">Related Projects</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProjects.map((relatedProject) => (
                <Link key={relatedProject.id} to={`/projects/${generateSlug(relatedProject.title)}`}>
                  <Card className="glass-card hover:shadow-lg transition-all cursor-pointer group h-full">
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={relatedProject.image} 
                        alt={relatedProject.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">
                        {relatedProject.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {relatedProject.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/projects">
                <Button variant="outline" size="lg">
                  View All Projects
                </Button>
              </Link>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
