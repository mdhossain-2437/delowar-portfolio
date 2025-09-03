import { motion } from "framer-motion";

export default function Footer() {
  const socialLinks = [
    { icon: "fab fa-github", href: "https://github.com/mdhossain-2437", label: "GitHub" },
    { icon: "fab fa-linkedin", href: "https://linkedin.com/in/mdhossain2437", label: "LinkedIn" },
    { icon: "fab fa-twitter", href: "#", label: "Twitter" }
  ];

  return (
    <footer className="py-12 bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="mb-6">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Delowar Hossain
            </span>
          </div>

          <p className="text-muted-foreground mb-6">
            Building the future, one line of code at a time.
          </p>

          <div className="flex justify-center space-x-6 mb-6">
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                data-testid={`footer-social-${link.label.toLowerCase()}`}
                aria-label={link.label}
              >
                <i className={`${link.icon} text-xl`}></i>
              </motion.a>
            ))}
          </div>

          <motion.p
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Made with ❤️ and ☕ by Delowar Hossain &copy; 2025
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
}
