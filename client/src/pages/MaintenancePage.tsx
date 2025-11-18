import { motion } from "framer-motion";
import { Wrench, Home, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background">
      <Helmet>
        <title>Maintenance Mode | Delowar Hossain</title>
        <meta name="description" content="The site is undergoing scheduled maintenance. Please check back soon." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card max-w-xl w-full p-10 text-center rounded-3xl border border-border/60"
      >
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mx-auto mb-6">
          <Wrench className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold mb-3">We’re tuning up!</h1>
        <p className="text-muted-foreground mb-8">
          I’m deploying a fresh round of updates to keep the experience fast, secure, and inspiring.
          Please refresh in a little while or follow the status dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button className="bg-primary text-primary-foreground flex items-center gap-2 w-full">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <a
            href="mailto:mdhossain2437@gmail.com"
            className="flex-1"
          >
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Notify Me
            </Button>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
