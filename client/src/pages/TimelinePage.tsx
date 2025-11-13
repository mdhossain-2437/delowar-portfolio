import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Award, Briefcase, Code, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const timelineEvents = [
  {
    year: 2025,
    title: "Full Stack Portfolio Launch",
    description: "Built comprehensive portfolio with workspace and business management features",
    category: "career",
    icon: "💼",
  },
  {
    year: 2024,
    title: "Advanced React & TypeScript Mastery",
    description: "Deep dive into modern React patterns, TypeScript best practices, and performance optimization",
    category: "career",
    icon: "⚛️",
  },
  {
    year: 2023,
    title: "First Freelance Client Success",
    description: "Successfully delivered a complex web application for international client",
    category: "career",
    icon: "🚀",
  },
  {
    year: 2022,
    title: "Open Source Contribution",
    description: "Started contributing to popular open source projects, gained 100+ GitHub stars",
    category: "open_source",
    icon: "⭐",
  },
  {
    year: 2021,
    title: "First Web Application Launched",
    description: "Built and deployed first full-stack application using MERN stack",
    category: "career",
    icon: "🌐",
  },
  {
    year: 2020,
    title: "Started Learning Web Development",
    description: "Began journey with HTML, CSS, and JavaScript fundamentals",
    category: "career",
    icon: "📚",
  },
];

const categories = [
  { id: "all", label: "All Events", icon: Calendar },
  { id: "career", label: "Career", icon: Briefcase },
  { id: "open_source", label: "Open Source", icon: Code },
  { id: "awards", label: "Awards", icon: Award },
  { id: "life_events", label: "Life", icon: Heart },
];

export default function TimelinePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredEvents = selectedCategory === "all" 
    ? timelineEvents 
    : timelineEvents.filter(e => e.category === selectedCategory);

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Journey</h1>
          <p className="text-lg text-muted-foreground">
            A chronological view of my career milestones, achievements, and life events
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 justify-center mb-12"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="gap-2"
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </Button>
            );
          })}
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

          {/* Events */}
          <div className="space-y-8">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={`${event.year}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-20"
              >
                {/* Year Badge */}
                <div className="absolute left-0 top-0 flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold shadow-lg">
                  {event.year}
                </div>

                {/* Event Card */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{event.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        <p className="text-muted-foreground mb-3">{event.description}</p>
                        <Badge variant="secondary">{event.category.replace('_', ' ')}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {new Date().getFullYear() - 2020}+
              </div>
              <div className="text-sm text-muted-foreground">Years Coding</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-1">50+</div>
              <div className="text-sm text-muted-foreground">Projects Built</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-1">1000+</div>
              <div className="text-sm text-muted-foreground">GitHub Commits</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-1">10+</div>
              <div className="text-sm text-muted-foreground">Happy Clients</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
