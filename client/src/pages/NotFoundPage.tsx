import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>404 | Delowar Hossain</title>
        <meta name="description" content="The page you are looking for does not exist." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.h1
          className="text-9xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          404
        </motion.h1>
        
        <h2 className="text-3xl font-semibold text-foreground mt-4 mb-2">
          Page Not Found
        </h2>
        
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        
        <Link to="/">
          <Button size="lg" data-testid="button-home">
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
