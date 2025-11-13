import { motion } from "framer-motion";
import { Monitor, Smartphone, Code, Terminal, Palette, Package, Cloud, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const devices = [
  {
    category: "Development Machine",
    icon: Monitor,
    items: [
      { name: "MacBook Pro M2", description: "Primary development machine" },
      { name: "32GB RAM", description: "For running multiple apps and VMs" },
      { name: "1TB SSD", description: "Fast storage for projects" },
    ],
  },
  {
    category: "Peripherals",
    icon: Smartphone,
    items: [
      { name: "Mechanical Keyboard", description: "For comfortable typing" },
      { name: "Wireless Mouse", description: "Logitech MX Master 3" },
      { name: "27\" Monitor", description: "Extended display for productivity" },
    ],
  },
];

const tools = [
  {
    category: "Code Editor",
    icon: Code,
    items: [
      { name: "VS Code", description: "Primary code editor with custom themes", favorite: true },
      { name: "Extensions", description: "ESLint, Prettier, GitLens, etc." },
      { name: "Cursor", description: "AI-powered coding assistant" },
    ],
  },
  {
    category: "Terminal & CLI",
    icon: Terminal,
    items: [
      { name: "iTerm2", description: "Enhanced terminal for macOS" },
      { name: "Oh My Zsh", description: "Terminal theme and plugins" },
      { name: "GitHub CLI", description: "Manage repos from terminal" },
    ],
  },
  {
    category: "Design Tools",
    icon: Palette,
    items: [
      { name: "Figma", description: "UI/UX design and prototyping" },
      { name: "Excalidraw", description: "Diagrams and sketches" },
      { name: "ColorHunt", description: "Color palette inspiration" },
    ],
  },
];

const stack = [
  {
    category: "Frontend",
    icon: Code,
    tech: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion", "Zustand"],
  },
  {
    category: "Backend",
    icon: Package,
    tech: ["Node.js", "Express", "PostgreSQL", "Drizzle ORM", "Redis", "WebSocket"],
  },
  {
    category: "DevOps & Cloud",
    icon: Cloud,
    tech: ["Docker", "GitHub Actions", "Vercel", "Railway", "AWS", "Nginx"],
  },
  {
    category: "Tools & Others",
    icon: Shield,
    tech: ["Git", "Postman", "Jira", "Notion", "Slack", "Linear"],
  },
];

const workflow = [
  {
    phase: "Planning",
    steps: [
      "Understand requirements and create user stories",
      "Design database schema and API structure",
      "Create wireframes and mockups in Figma",
    ],
  },
  {
    phase: "Development",
    steps: [
      "Set up project with modern tooling",
      "Build features incrementally with TDD approach",
      "Regular commits with conventional commit messages",
    ],
  },
  {
    phase: "Testing & Deployment",
    steps: [
      "Write unit and integration tests",
      "Set up CI/CD pipeline with GitHub Actions",
      "Deploy to production with monitoring",
    ],
  },
  {
    phase: "Maintenance",
    steps: [
      "Monitor performance and error logs",
      "Gather user feedback and iterate",
      "Regular dependency updates and security patches",
    ],
  },
];

export default function StackPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Stack & Setup</h1>
          <p className="text-lg text-muted-foreground">
            Tools, technologies, and workflow that power my development process
          </p>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="stack" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="stack">Tech Stack</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
          </TabsList>

          {/* Tech Stack Tab */}
          <TabsContent value="stack" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {stack.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Icon className="w-5 h-5" />
                          {category.category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {category.tech.map((tech, i) => (
                            <Badge key={i} variant="secondary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Why This Stack?</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  I've chosen this tech stack for its perfect balance of developer experience,
                  performance, and scalability. React with TypeScript provides type safety and
                  excellent tooling, while Tailwind CSS enables rapid UI development.
                </p>
                <p className="mt-4">
                  On the backend, Node.js and Express offer flexibility and a vast ecosystem.
                  PostgreSQL provides robust data integrity, and Drizzle ORM brings type-safe
                  database queries to TypeScript.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Devices Tab */}
          <TabsContent value="devices" className="space-y-6">
            {devices.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className="w-5 h-5" />
                        {category.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {category.items.map((item, i) => (
                          <div key={i} className="border-l-2 border-primary pl-4">
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Icon className="w-5 h-5" />
                          {category.category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {category.items.map((item, i) => (
                            <div key={i}>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-sm">{item.name}</h4>
                                {item.favorite && <Badge variant="default" className="text-xs">★</Badge>}
                              </div>
                              <p className="text-xs text-muted-foreground">{item.description}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Workflow Tab */}
          <TabsContent value="workflow" className="space-y-6">
            <div className="space-y-8">
              {workflow.map((phase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                          {index + 1}
                        </div>
                        {phase.phase}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {phase.steps.map((step, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
