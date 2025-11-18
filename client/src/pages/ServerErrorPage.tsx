import { motion } from "framer-motion";
import { ShieldAlert, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";

export default function ServerErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background">
      <Helmet>
        <title>Server Error | Delowar Hossain</title>
        <meta name="description" content="Something unexpected happened. Please retry momentarily." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card max-w-lg w-full p-10 text-center rounded-3xl border border-destructive/40"
      >
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 text-destructive mx-auto mb-6">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold mb-3">500 — Server hiccup</h1>
        <p className="text-muted-foreground mb-8">
          The API burped while processing your request. I’m logging this incident and will deploy a fix soon.
          Try refreshing or head back to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => window.location.reload()}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
          <Link to="/">
            <Button variant="outline" className="flex-1">
              Go Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
