import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

export default function Services() {
  const services = [
    {
      title: "Web Development",
      description:
        "Building responsive, modern web applications using React, Next.js, and other cutting-edge technologies.",
      features: [
        "Custom Web Applications",
        "E-commerce Solutions",
        "Progressive Web Apps",
        "Performance Optimization",
      ],
      icon: "🌐", // Replace with your actual icon component
    },
    {
      title: "AI Integration",
      description:
        "Implementing AI solutions to enhance applications and automate processes for better efficiency.",
      features: [
        "ChatGPT Integration",
        "Custom AI Models",
        "Natural Language Processing",
        "Machine Learning Solutions",
      ],
      icon: "🤖", // Replace with your actual icon component
    },
    {
      title: "UI/UX Design",
      description:
        "Creating beautiful, intuitive interfaces that provide exceptional user experiences.",
      features: [
        "User Interface Design",
        "User Experience Design",
        "Design Systems",
        "Interactive Prototypes",
      ],
      icon: "🎨", // Replace with your actual icon component
    },
    {
      title: "Technical Consultation",
      description:
        "Providing expert advice on technology stack selection and architecture design.",
      features: [
        "Architecture Planning",
        "Tech Stack Selection",
        "Code Review",
        "Performance Audits",
      ],
      icon: "💡", // Replace with your actual icon component
    },
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Services I Offer
            </span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center mb-4">
                    <span className="text-4xl mr-4 group-hover:scale-110 transition-transform">
                      {service.icon}
                    </span>
                    <h3 className="text-2xl font-semibold text-foreground">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="mr-2 text-primary">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Button
                      variant="outline"
                      className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      Learn More
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
