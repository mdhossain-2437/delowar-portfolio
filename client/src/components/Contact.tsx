import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useUISounds } from "@/hooks/useUISounds";
import { useTranslation } from "@/hooks/useTranslation";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { playSuccess, playHover, playClick } = useUISounds();
  const t = useTranslation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          reason: "general",
        }),
      });

      if (!response.ok) {
        const raw = await response.text();
        let parsedMessage = "Failed to send message";
        try {
          const data = raw ? JSON.parse(raw) : null;
          if (data?.message) parsedMessage = data.message;
        } catch {
          if (raw) parsedMessage = raw;
        }
        throw new Error(parsedMessage);
      }

      toast({
        title: "Message sent successfully!",
        description: "I'll get back to you soon.",
        duration: 5000,
      });
      playSuccess();

      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactDetails = [
    {
      icon: "fas fa-envelope",
      label: "Email",
      value: "mdhossain2437@gmail.com",
      color: "primary"
    },
    {
      icon: "fas fa-phone",
      label: "Phone",
      value: "+8801315123134",
      color: "accent"
    },
    {
      icon: "fas fa-map-marker-alt",
      label: "Location",
      value: "Panchbibi, Joypurhat, Bangladesh",
      color: "primary"
    }
  ];

  const socialLinks = [
    {
      icon: "fab fa-github",
      href: "https://github.com/mdhossain-2437",
      color: "primary"
    },
    {
      icon: "fab fa-linkedin",
      href: "https://linkedin.com/in/mdhossain2437",
      color: "accent"
    },
    {
      icon: "fab fa-twitter",
      href: "#",
      color: "primary"
    }
  ];

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-background to-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("contact.title")}
            </span>
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div>
                <h3 className="text-2xl font-semibold mb-6">{t("contact.title")}</h3>
                <p className="text-lg text-muted-foreground mb-8">{t("contact.subtitle")}</p>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                {contactDetails.map((detail, index) => (
                  <motion.div
                    key={detail.label}
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    data-testid={`contact-${detail.label.toLowerCase()}`}
                  >
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#020817] text-primary">
                      <i className={detail.icon}></i>
                    </div>
                    <div>
                      <p className="font-semibold">{detail.label}</p>
                      <p className="text-muted-foreground">{detail.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <p className="font-semibold mb-4">Connect with me:</p>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.href}
                      href={social.href}
                      className={`w-12 h-12 bg-muted rounded-lg flex items-center justify-center hover:bg-${social.color} hover:text-${social.color}-foreground transition-all duration-300 transform hover:scale-110`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      data-testid={`social-link-${index}`}
                    >
                      <i className={social.icon}></i>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <motion.div
                className="glass-card p-6 rounded-lg border border-accent/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                viewport={{ once: true }}
                data-testid="availability-status"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-accent">{t("contact.title")}</span>
                </div>
                <p className="text-sm text-muted-foreground">{t("contact.subtitle")}</p>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              className="glass-card p-8 rounded-lg"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="What's your name?"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-white text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 dark:bg-[#0b1120]"
                    data-testid="input-name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Where can I reach you?"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-white text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 dark:bg-[#0b1120]"
                    data-testid="input-email"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Project or topic"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-white text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 dark:bg-[#0b1120]"
                    data-testid="input-subject"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell me about your idea, challenge, or dream build..."
                    className="w-full px-4 py-3 border border-border rounded-lg bg-white text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none dark:bg-[#0b1120]"
                    data-testid="input-message"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  data-testid="submit-button"
                  onMouseEnter={playHover}
                  onClick={playClick}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Sending...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
