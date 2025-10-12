import { motion } from "framer-motion";
import { Card } from "./ui/card";

export default function Education() {
  const educationData = [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "University Of The People",
      year: "2025 - Present",
      description:
        "Focused on software engineering, web development, and artificial intelligence.",
    },
    // Add more education entries as needed
  ];

  const certifications = [
    {
      name: "Full Stack Web Development",
      issuer: "Certification Provider",
      date: "2023",
      credentialId: "FSW123456",
    },
    {
      name: "AI & Machine Learning Fundamentals",
      issuer: "AI Learning Platform",
      date: "2024",
      credentialId: "AI789012",
    },
    // Add more certifications as needed
  ];

  return (
    <section id="education" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Education & Certifications
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Education Section */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-foreground">
                Education
              </h3>
              <div className="space-y-6">
                {educationData.map((edu, index) => (
                  <Card
                    key={index}
                    className="p-6 hover:shadow-lg transition-shadow"
                  >
                    <h4 className="text-xl font-semibold text-primary">
                      {edu.degree}
                    </h4>
                    <p className="text-muted-foreground mt-2">
                      {edu.institution}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {edu.year}
                    </p>
                    <p className="mt-3">{edu.description}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Certifications Section */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-foreground">
                Certifications
              </h3>
              <div className="space-y-6">
                {certifications.map((cert, index) => (
                  <Card
                    key={index}
                    className="p-6 hover:shadow-lg transition-shadow"
                  >
                    <h4 className="text-xl font-semibold text-primary">
                      {cert.name}
                    </h4>
                    <p className="text-muted-foreground mt-2">{cert.issuer}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Issued: {cert.date}
                    </p>
                    <p className="text-sm mt-2">
                      Credential ID: {cert.credentialId}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
