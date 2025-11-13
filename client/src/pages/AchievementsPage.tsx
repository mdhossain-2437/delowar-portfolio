import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Award, Code, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const achievements = [
  {
    title: "100+ GitHub Stars",
    description: "My open source projects have received over 100 stars from the community",
    category: "github",
    icon: "⭐",
    value: "100+",
    badge: "🏆 Gold",
    date: "2024",
  },
  {
    title: "10 Production Apps",
    description: "Successfully deployed and maintained 10 production applications",
    category: "projects",
    icon: "🚀",
    value: "10",
    badge: "🥇 Expert",
    date: "2024",
  },
  {
    title: "500+ LeetCode Problems",
    description: "Solved over 500 coding problems on LeetCode",
    category: "coding",
    icon: "💻",
    value: "500+",
    badge: "🔥 Master",
    date: "2024",
  },
  {
    title: "Full Stack Mastery",
    description: "Proficient in React, Node.js, TypeScript, and modern web technologies",
    category: "skills",
    icon: "⚡",
    value: "Expert",
    badge: "🎯 Pro",
    date: "2024",
  },
  {
    title: "First Freelance Client",
    description: "Successfully completed first freelance project with 5-star review",
    category: "business",
    icon: "💼",
    value: "5★",
    badge: "🌟 Success",
    date: "2023",
  },
  {
    title: "Open Source Contributor",
    description: "Active contributor to popular open source projects",
    category: "github",
    icon: "🤝",
    value: "Active",
    badge: "🎖️ Contributor",
    date: "2023",
  },
];

const metrics = [
  { label: "Total Commits", value: "1,247", icon: Code, color: "text-blue-500" },
  { label: "Repositories", value: "45", icon: Star, color: "text-yellow-500" },
  { label: "Contributions", value: "365+ days", icon: TrendingUp, color: "text-green-500" },
  { label: "Followers", value: "234", icon: Users, color: "text-purple-500" },
];

const skills = [
  { name: "React & TypeScript", level: 95 },
  { name: "Node.js & Express", level: 90 },
  { name: "Database Design", level: 85 },
  { name: "UI/UX Design", level: 80 },
  { name: "DevOps & CI/CD", level: 75 },
  { name: "System Design", level: 70 },
];

export default function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredAchievements = selectedCategory === "all"
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Achievements & Stats</h1>
          <p className="text-lg text-muted-foreground">
            A showcase of my coding journey, milestones, and growth metrics
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${metric.color}`} />
                  <div className="text-2xl font-bold mb-1">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="achievements" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="skills">Skills Progress</TabsTrigger>
          </TabsList>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {["all", "github", "projects", "coding", "skills", "business"].map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
                </Badge>
              ))}
            </div>

            {/* Achievements Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-4xl">{achievement.icon}</div>
                        <Badge variant="secondary">{achievement.badge}</Badge>
                      </div>
                      <CardTitle className="text-xl">{achievement.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4">
                        {achievement.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-primary">
                          {achievement.value}
                        </div>
                        <Badge variant="outline">{achievement.date}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Skills Progress Tab */}
          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Technical Skills Proficiency</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-muted-foreground">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Learning Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
                  <div className="text-2xl font-bold mb-1">15</div>
                  <div className="text-sm text-muted-foreground">Courses Completed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="w-12 h-12 mx-auto mb-3 text-blue-500" />
                  <div className="text-2xl font-bold mb-1">8</div>
                  <div className="text-sm text-muted-foreground">Certifications</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Star className="w-12 h-12 mx-auto mb-3 text-purple-500" />
                  <div className="text-2xl font-bold mb-1">1000+</div>
                  <div className="text-sm text-muted-foreground">Hours Learning</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
