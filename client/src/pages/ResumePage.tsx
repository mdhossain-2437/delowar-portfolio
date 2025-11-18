import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Eye,
  Printer,
  Copy,
  Check,
  Globe,
  ExternalLink
} from "lucide-react";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";

export default function ResumePage() {
  const [viewMode, setViewMode] = useState<"online" | "print">("online");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { toast } = useToast();

  const contactInfo = {
    name: "MD DELOWAR HOSSAIN",
    title: "Full Stack Developer & AI Learner",
    email: "mdhossain2437@gmail.com",
    phone: "+880 1315 123134",
    location: "Dhaka, Bangladesh",
    github: "github.com/mdhossain-2437",
    linkedin: "linkedin.com/in/mdhossain2437",
    website: "delowar.dev"
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({
      title: "Copied!",
      description: `${field} copied to clipboard`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const generatePDF = () => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPos = 20;

    pdf.setFontSize(24);
    pdf.setTextColor(147, 51, 234);
    pdf.text(contactInfo.name, pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 8;
    pdf.setFontSize(14);
    pdf.setTextColor(100, 100, 100);
    pdf.text(contactInfo.title, pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 10;
    pdf.setFontSize(9);
    pdf.setTextColor(80, 80, 80);
    const contactLine = `${contactInfo.email} | ${contactInfo.phone} | ${contactInfo.location}`;
    pdf.text(contactLine, pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 4;
    const linksLine = `${contactInfo.github} | ${contactInfo.linkedin}`;
    pdf.text(linksLine, pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 5;
    pdf.setDrawColor(147, 51, 234);
    pdf.line(20, yPos, pageWidth - 20, yPos);
    
    yPos += 10;
    pdf.setFontSize(14);
    pdf.setTextColor(147, 51, 234);
    pdf.text('PROFESSIONAL SUMMARY', 20, yPos);
    
    yPos += 7;
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    const summaryText = 'Passionate self-taught Full Stack Developer with 4+ years of hands-on experience building modern web applications. Proficient in MERN stack with expertise in React, Node.js, and MongoDB. Currently exploring AI/ML technologies to create intelligent developer tools. Strong problem-solver with a track record of delivering 10+ successful projects from concept to deployment.';
    const summaryLines = pdf.splitTextToSize(summaryText, pageWidth - 40);
    pdf.text(summaryLines, 20, yPos);
    
    yPos += summaryLines.length * 5 + 10;
    pdf.setFontSize(14);
    pdf.setTextColor(147, 51, 234);
    pdf.text('TECHNICAL SKILLS', 20, yPos);
    
    yPos += 7;
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Frontend:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text('React, Next.js, TypeScript, JavaScript (ES6+), Tailwind CSS, Bootstrap', 42, yPos);
    
    yPos += 5;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Backend:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Node.js, Express.js, MongoDB, PostgreSQL, Firebase, REST APIs', 42, yPos);
    
    yPos += 5;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Tools & Others:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Git/GitHub, VS Code, Figma, Framer Motion, WebRTC, AI/ML (Learning)', 42, yPos);
    
    yPos += 10;
    pdf.setFontSize(14);
    pdf.setTextColor(147, 51, 234);
    pdf.text('WORK EXPERIENCE', 20, yPos);
    
    yPos += 7;
    pdf.setFontSize(11);
    pdf.setTextColor(40, 40, 40);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Freelance Full Stack Developer', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text('2023 - Present', pageWidth - 45, yPos);
    
    yPos += 5;
    pdf.setFontSize(9);
    pdf.setTextColor(60, 60, 60);
    const exp1 = [
      '• Built 10+ responsive web applications for clients using MERN stack',
      '• Implemented secure authentication systems and payment integrations',
      '• Developed real-time features using WebSockets and Firebase',
      '• Delivered projects with 95%+ client satisfaction rate'
    ];
    exp1.forEach(item => {
      pdf.text(item, 24, yPos);
      yPos += 4.5;
    });
    
    yPos += 3;
    pdf.setFontSize(11);
    pdf.setTextColor(40, 40, 40);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Web Developer (Self-Employed)', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text('2022 - 2023', pageWidth - 45, yPos);
    
    yPos += 5;
    pdf.setFontSize(9);
    pdf.setTextColor(60, 60, 60);
    const exp2 = [
      '• Developed e-commerce platforms with product management systems',
      '• Created RESTful APIs and database schemas for web applications',
      '• Designed responsive UI/UX with modern design principles'
    ];
    exp2.forEach(item => {
      pdf.text(item, 24, yPos);
      yPos += 4.5;
    });
    
    if (yPos > pageHeight - 60) {
      pdf.addPage();
      yPos = 20;
    }
    
    yPos += 5;
    pdf.setFontSize(14);
    pdf.setTextColor(147, 51, 234);
    pdf.text('FEATURED PROJECTS', 20, yPos);
    
    const projects = [
      {
        name: 'WebDevWarrior',
        desc: 'MERN stack learning platform with user authentication, course enrollments, and admin dashboard',
        tech: 'React, Node.js, MongoDB, Tailwind CSS'
      },
      {
        name: 'Kothopokothon Messenger',
        desc: 'Real-time chat application with E2E encryption, voice/video calling, and media sharing',
        tech: 'React, Firebase, WebRTC, shadcn/ui'
      },
      {
        name: 'Recipe Book App',
        desc: 'Full-stack recipe management with authentication, CRUD operations, and filtering',
        tech: 'React, Firebase, MongoDB, Node.js'
      },
      {
        name: 'AI Coding Agent',
        desc: 'Intelligent developer assistant exploring LangChain and LLM integration (WIP)',
        tech: 'Python, LangChain, AI/ML'
      }
    ];
    
    projects.forEach((project) => {
      yPos += 7;
      pdf.setFontSize(10);
      pdf.setTextColor(40, 40, 40);
      pdf.setFont('helvetica', 'bold');
      pdf.text(project.name, 20, yPos);
      
      yPos += 5;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(60, 60, 60);
      const descLines = pdf.splitTextToSize(project.desc, pageWidth - 44);
      pdf.text(descLines, 24, yPos);
      yPos += descLines.length * 4;
      
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'italic');
      pdf.text(`Tech: ${project.tech}`, 24, yPos);
    });
    
    yPos += 10;
    pdf.setFontSize(14);
    pdf.setTextColor(147, 51, 234);
    pdf.setFont('helvetica', 'bold');
    pdf.text('EDUCATION & LEARNING', 20, yPos);
    
    yPos += 7;
    pdf.setFontSize(10);
    pdf.setTextColor(40, 40, 40);
    pdf.text('Self-Taught Developer', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text('2019 - Present', pageWidth - 45, yPos);
    
    yPos += 5;
    pdf.setFontSize(9);
    pdf.setTextColor(60, 60, 60);
    const education = [
      '• Completed courses on React, Node.js, MongoDB, and modern web development',
      '• Active learner exploring AI/ML, LangChain, and intelligent systems',
      '• Built 15+ projects while learning and experimenting with new technologies'
    ];
    education.forEach(item => {
      pdf.text(item, 24, yPos);
      yPos += 4.5;
    });
    
    yPos += 5;
    pdf.setFontSize(10);
    pdf.setTextColor(40, 40, 40);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Languages: ', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);
    pdf.text('English (Fluent), Bengali (Native)', 42, yPos);
    
    pdf.setFontSize(8);
    pdf.setTextColor(120, 120, 120);
    pdf.text('Generated from delowar.dev', pageWidth / 2, pageHeight - 10, { align: 'center' });

    pdf.save('MD-Delowar-Hossain-Resume.pdf');
    
    toast({
      title: "Success!",
      description: "Resume PDF downloaded successfully",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${viewMode === 'print' ? 'print-view' : ''}`}>
      <Helmet>
        <title>Resume | Delowar Hossain</title>
        <meta name="description" content="Download the ATS-friendly resume for MD Delowar Hossain." />
      </Helmet>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-3 justify-between items-center mb-8 no-print"
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Resume
          </h1>
          
          <div className="flex gap-3">
            <Button
              variant={viewMode === "online" ? "default" : "outline"}
              onClick={() => setViewMode("online")}
              className="gap-2"
              data-testid="button-view-online"
            >
              <Eye className="w-4 h-4" />
              Online View
            </Button>
            <Button
              variant={viewMode === "print" ? "default" : "outline"}
              onClick={() => setViewMode("print")}
              className="gap-2"
              data-testid="button-view-print"
            >
              <Printer className="w-4 h-4" />
              Print View
            </Button>
            <Button
              onClick={generatePDF}
              className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
              data-testid="button-download-resume-pdf"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="resume-container"
        >
          <Card className={`${viewMode === 'online' ? 'glass-card' : 'bg-white dark:bg-white text-black'} shadow-lg`}>
            <CardContent className="p-8 md:p-12">
              <motion.div variants={itemVariants} className="text-center mb-8 border-b pb-6">
                <h1 className="text-4xl md:text-5xl font-bold mb-2 text-primary">
                  {contactInfo.name}
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-4">
                  {contactInfo.title}
                </p>
                
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <button
                    onClick={() => copyToClipboard(contactInfo.email, 'Email')}
                    className="flex items-center gap-1 hover:text-primary transition-colors group"
                    data-testid="contact-email"
                  >
                    <Mail className="w-4 h-4" />
                    {contactInfo.email}
                    {copiedField === 'Email' ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => copyToClipboard(contactInfo.phone, 'Phone')}
                    className="flex items-center gap-1 hover:text-primary transition-colors group"
                    data-testid="contact-phone"
                  >
                    <Phone className="w-4 h-4" />
                    {contactInfo.phone}
                    {copiedField === 'Phone' ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                    )}
                  </button>
                  
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {contactInfo.location}
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-center gap-4 text-sm mt-3">
                  <a
                    href={`https://${contactInfo.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                    data-testid="contact-github"
                  >
                    <Github className="w-4 h-4" />
                    {contactInfo.github}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  
                  <a
                    href={`https://${contactInfo.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                    data-testid="contact-linkedin"
                  >
                    <Linkedin className="w-4 h-4" />
                    {contactInfo.linkedin}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {contactInfo.website}
                  </div>
                </div>
              </motion.div>

              <motion.section variants={itemVariants} className="mb-8" data-testid="section-summary">
                <h2 className="text-2xl font-bold mb-4 text-primary flex items-center gap-2">
                  Professional Summary
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Passionate self-taught Full Stack Developer with 4+ years of hands-on experience building modern web applications. 
                  Proficient in MERN stack with expertise in React, Node.js, and MongoDB. Currently exploring AI/ML technologies to 
                  create intelligent developer tools. Strong problem-solver with a track record of delivering 10+ successful projects 
                  from concept to deployment.
                </p>
              </motion.section>

              <motion.section variants={itemVariants} className="mb-8" data-testid="section-skills">
                <h2 className="text-2xl font-bold mb-4 text-primary">Technical Skills</h2>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="glass-card p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 text-accent">Frontend</h3>
                    <div className="flex flex-wrap gap-1">
                      {['React', 'Next.js', 'TypeScript', 'JavaScript (ES6+)', 'Tailwind CSS', 'Bootstrap', 'Framer Motion'].map(skill => (
                        <span key={skill} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="glass-card p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 text-accent">Backend</h3>
                    <div className="flex flex-wrap gap-1">
                      {['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'Firebase', 'REST APIs', 'WebSockets'].map(skill => (
                        <span key={skill} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="glass-card p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 text-accent">Tools & Others</h3>
                    <div className="flex flex-wrap gap-1">
                      {['Git/GitHub', 'VS Code', 'Figma', 'WebRTC', 'AI/ML', 'LangChain', 'Python'].map(skill => (
                        <span key={skill} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.section>

              <motion.section variants={itemVariants} className="mb-8" data-testid="section-experience">
                <h2 className="text-2xl font-bold mb-4 text-primary">Work Experience</h2>
                
                <div className="space-y-6">
                  <div className="border-l-2 border-primary pl-4">
                    <div className="flex flex-wrap justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">Freelance Full Stack Developer</h3>
                        <p className="text-sm text-muted-foreground">Self-Employed</p>
                      </div>
                      <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded">
                        2023 - Present
                      </span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Built 10+ responsive web applications for clients using MERN stack</li>
                      <li>Implemented secure authentication systems and payment integrations</li>
                      <li>Developed real-time features using WebSockets and Firebase</li>
                      <li>Delivered projects with 95%+ client satisfaction rate</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-2 border-accent pl-4">
                    <div className="flex flex-wrap justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">Web Developer</h3>
                        <p className="text-sm text-muted-foreground">Self-Employed</p>
                      </div>
                      <span className="text-sm bg-accent/20 text-accent px-3 py-1 rounded">
                        2022 - 2023
                      </span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Developed e-commerce platforms with product management systems</li>
                      <li>Created RESTful APIs and database schemas for web applications</li>
                      <li>Designed responsive UI/UX with modern design principles</li>
                    </ul>
                  </div>
                </div>
              </motion.section>

              <motion.section variants={itemVariants} className="mb-8" data-testid="section-projects">
                <h2 className="text-2xl font-bold mb-4 text-primary">Featured Projects</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="glass-card p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      WebDevWarrior
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Featured</span>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      MERN stack learning platform with user authentication, course enrollments, and admin dashboard
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {['React', 'Node.js', 'MongoDB', 'Tailwind'].map(tech => (
                        <span key={tech} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="glass-card p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Kothopokothon Messenger</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Real-time chat application with E2E encryption, voice/video calling, and media sharing
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {['React', 'Firebase', 'WebRTC', 'shadcn/ui'].map(tech => (
                        <span key={tech} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="glass-card p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Recipe Book App</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Full-stack recipe management with authentication, CRUD operations, and filtering
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {['React', 'Firebase', 'MongoDB', 'Node.js'].map(tech => (
                        <span key={tech} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="glass-card p-4 rounded-lg border-dashed border-2 border-primary/30">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      AI Coding Agent
                      <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">WIP</span>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Intelligent developer assistant exploring LangChain and LLM integration
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {['Python', 'LangChain', 'AI/ML'].map(tech => (
                        <span key={tech} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.section>

              <motion.section variants={itemVariants} className="mb-8" data-testid="section-education">
                <h2 className="text-2xl font-bold mb-4 text-primary">Education & Learning</h2>
                
                <div className="border-l-2 border-primary pl-4">
                  <div className="flex flex-wrap justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">Self-Taught Developer</h3>
                      <p className="text-sm text-muted-foreground">Independent Learning & Practice</p>
                    </div>
                    <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded">
                      2019 - Present
                    </span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Completed courses on React, Node.js, MongoDB, and modern web development</li>
                    <li>Active learner exploring AI/ML, LangChain, and intelligent systems</li>
                    <li>Built 15+ projects while learning and experimenting with new technologies</li>
                  </ul>
                </div>
              </motion.section>

              <motion.section variants={itemVariants} data-testid="section-additional">
                <h2 className="text-2xl font-bold mb-4 text-primary">Additional Information</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-accent">Languages</h3>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• English - Fluent (Professional working proficiency)</li>
                      <li>• Bengali - Native</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2 text-accent">Interests</h3>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• AI/ML and intelligent systems</li>
                      <li>• Open-source contributions</li>
                      <li>• Developer tools and automation</li>
                      <li>• UI/UX design and accessibility</li>
                    </ul>
                  </div>
                </div>
              </motion.section>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-sm text-muted-foreground no-print"
        >
          <p>💡 Tip: Use "Print View" mode before printing or click "Download PDF" for a formatted resume</p>
        </motion.div>
      </div>

      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          
          .no-print {
            display: none !important;
          }
          
          .resume-container {
            box-shadow: none !important;
          }
          
          .glass-card {
            background: white !important;
            border: 1px solid #e5e7eb !important;
          }
          
          .print-view .glass-card {
            background: white !important;
            color: black !important;
          }
          
          .print-view * {
            color: black !important;
          }
          
          .print-view h1, .print-view h2, .print-view h3 {
            color: #9333ea !important;
          }
          
          .print-view .text-primary {
            color: #9333ea !important;
          }
          
          .print-view .text-accent {
            color: #22d3ee !important;
          }
          
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
}
