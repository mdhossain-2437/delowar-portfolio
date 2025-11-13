import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Code2, 
  TestTube, 
  Zap, 
  MessageSquare, 
  BookOpen, 
  Briefcase,
  GraduationCap,
  Coffee,
  Music,
  Gamepad,
  Book,
  Rocket
} from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: <Code2 className="w-8 h-8" />,
      title: "Clean Code",
      description: "Writing maintainable, readable code that follows best practices and industry standards.",
      color: "from-purple-500 to-purple-700"
    },
    {
      icon: <TestTube className="w-8 h-8" />,
      title: "Testing",
      description: "Ensuring reliability through comprehensive testing and quality assurance.",
      color: "from-blue-500 to-blue-700"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Performance",
      description: "Optimizing applications for speed, efficiency, and exceptional user experience.",
      color: "from-cyan-500 to-cyan-700"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Communication",
      description: "Clear documentation and effective collaboration with teams and stakeholders.",
      color: "from-teal-500 to-teal-700"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Continuous Learning",
      description: "Staying current with emerging technologies and constantly improving my skills.",
      color: "from-purple-500 to-blue-700"
    }
  ];

  const experiences = [
    {
      year: "2023 - Present",
      role: "Full Stack Developer",
      company: "Freelance",
      achievements: [
        "Built and deployed 10+ full-stack web applications using React, Node.js, and MongoDB",
        "Specialized in creating responsive, accessible interfaces with modern design patterns",
        "Implemented AI/ML features including chatbots and intelligent recommendation systems"
      ]
    },
    {
      year: "2022 - 2023",
      role: "Junior Developer",
      company: "Self-Employed Projects",
      achievements: [
        "Developed portfolio of personal projects showcasing full-stack capabilities",
        "Collaborated with clients to deliver custom web solutions and MVPs",
        "Mastered modern web technologies through hands-on project experience"
      ]
    },
    {
      year: "2019",
      role: "Started Coding Journey",
      company: "Self-Taught Developer",
      achievements: [
        "Began learning web development outside traditional CS education",
        "Completed online courses in HTML, CSS, JavaScript, and React fundamentals",
        "Built first websites and web applications to practice new skills"
      ]
    }
  ];

  const education = [
    {
      title: "Self-Taught Web Development",
      period: "2019 - Present",
      description: "Comprehensive self-directed learning through online courses, documentation, and hands-on projects"
    },
    {
      title: "Full Stack Web Development",
      period: "2020",
      description: "Completed intensive courses covering MERN stack, REST APIs, and modern JavaScript"
    },
    {
      title: "AI & Machine Learning Fundamentals",
      period: "2023",
      description: "Studied ML concepts, neural networks, and practical AI implementation in web applications"
    }
  ];

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-24">
        
        {/* Hero/Intro Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
          data-testid="about-hero-section"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            About Me
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            A passionate self-taught developer crafting modern web experiences and exploring the frontiers of AI
          </p>
          
          {/* Profile Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex justify-center mt-12"
          >
            <div className="relative w-64 h-64">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-blue-500/30 to-cyan-500/30 rounded-3xl blur-2xl"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden border-2 border-primary/50">
                <img
                  src="/delowar-photo.png"
                  alt="Delowar Hossain"
                  className="w-full h-full object-cover"
                  data-testid="profile-photo"
                />
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Story Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
          data-testid="story-section"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              My Journey
            </span>
          </h2>
          
          <Card className="glass-card">
            <CardContent className="p-8 md:p-12 space-y-6">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                I started learning code outside the traditional CSE path, driven by curiosity and passion for technology. 
                What began as a fascination with how websites work evolved into a deep commitment to mastering the art 
                of web development.
              </p>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                My self-taught journey has been challenging yet incredibly rewarding. I've learned to embrace obstacles 
                as opportunities for growth, teaching myself not just to code, but to think like a developer—solving 
                problems creatively and efficiently.
              </p>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Today, I specialize in <span className="text-primary font-semibold">full-stack web development</span>, 
                building responsive and scalable applications with modern technologies. I'm particularly excited about 
                <span className="text-accent font-semibold"> backend architecture</span> and the integration of 
                <span className="text-primary font-semibold"> AI/ML</span> into web applications, exploring how 
                intelligent systems can enhance user experiences.
              </p>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                My mission is to create reliable, scalable, and beautiful technology that helps people. I believe in 
                writing clean code, continuous learning, and building solutions that make a real difference.
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* Values Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
          data-testid="values-section"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Core Values
            </span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                data-testid={`value-card-${value.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Card className="glass-card h-full hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                  <CardContent className="p-6 space-y-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center text-white`}>
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-primary">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Experience Timeline */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
          data-testid="experience-section"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Experience
            </span>
          </h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary" />
            
            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="relative pl-20"
                  data-testid={`experience-${index}`}
                >
                  {/* Timeline dot */}
                  <motion.div
                    className="absolute left-6 top-6 w-5 h-5 rounded-full bg-primary ring-4 ring-background"
                    whileHover={{ scale: 1.3 }}
                  />
                  
                  <Card className="glass-card hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <h3 className="text-2xl font-bold text-primary">
                            {exp.role}
                          </h3>
                          <p className="text-lg text-accent flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            {exp.company}
                          </p>
                        </div>
                        <span className="text-muted-foreground font-mono text-sm bg-primary/10 px-3 py-1 rounded-full w-fit">
                          {exp.year}
                        </span>
                      </div>
                      
                      <ul className="space-y-2 ml-4">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="text-muted-foreground flex gap-2">
                            <span className="text-accent mt-1.5">•</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Education & Certifications */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
          data-testid="education-section"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Education & Learning
            </span>
          </h2>
          
          <Card className="glass-card">
            <CardContent className="p-8 md:p-12 space-y-8">
              <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                <GraduationCap className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">Self-Taught Developer Journey</h3>
                  <p className="text-muted-foreground">
                    I'm proud to be a self-taught developer who has built expertise through dedication, curiosity, 
                    and countless hours of hands-on practice. My non-traditional path has taught me resilience, 
                    resourcefulness, and the importance of continuous learning.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <motion.div
                    key={edu.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex gap-4 p-4 rounded-lg hover:bg-primary/5 transition-colors"
                    data-testid={`education-${index}`}
                  >
                    <div className="w-2 bg-gradient-to-b from-primary to-accent rounded-full flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-foreground">
                          {edu.title}
                        </h3>
                        <span className="text-sm text-muted-foreground font-mono">
                          {edu.period}
                        </span>
                      </div>
                      <p className="text-muted-foreground">
                        {edu.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Personal/"Now" Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
          data-testid="personal-section"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Beyond the Code
            </span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Hobbies & Interests */}
            <Card className="glass-card">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-2xl font-semibold text-primary flex items-center gap-2">
                  <Music className="w-6 h-6" />
                  Hobbies & Interests
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Book className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Reading Tech Blogs</h4>
                      <p className="text-sm text-muted-foreground">
                        Staying updated with the latest in web dev, AI, and software engineering
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Gamepad className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Gaming</h4>
                      <p className="text-sm text-muted-foreground">
                        Exploring game design and interactive experiences
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Code2 className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Open Source</h4>
                      <p className="text-sm text-muted-foreground">
                        Contributing to projects and learning from the community
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Focus */}
            <Card className="glass-card">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-2xl font-semibold text-primary flex items-center gap-2">
                  <Rocket className="w-6 h-6" />
                  Right Now
                </h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <h4 className="font-semibold text-foreground mb-2">📚 Currently Learning</h4>
                    <p className="text-sm text-muted-foreground">
                      Diving deep into advanced React patterns, TypeScript best practices, 
                      and exploring the latest in AI integration for web applications
                    </p>
                  </div>
                  
                  <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                    <h4 className="font-semibold text-foreground mb-2">🚀 Working On</h4>
                    <p className="text-sm text-muted-foreground">
                      Building AI-powered web tools, creating modern portfolio projects, 
                      and contributing to open-source initiatives
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
                    <h4 className="font-semibold text-foreground mb-2">🎯 Next Goals</h4>
                    <p className="text-sm text-muted-foreground">
                      Master full-stack architecture patterns, deploy production-grade 
                      AI applications, and build a thriving developer community
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fun Facts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="glass-card border-l-4 border-primary">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <Coffee className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-2">Fun Facts</h3>
                    <p className="text-lg text-muted-foreground">
                      I can't live without dark mode and I believe coffee is a developer's best friend ☕
                    </p>
                    <p className="text-muted-foreground mt-2">
                      I also think that the best code is code that doesn't need comments because it's self-explanatory, 
                      but I still write them anyway for my future self! 😄
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

      </div>
    </div>
  );
}
