import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";

export default function ContactPage() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Contact | Delowar Hossain</title>
        <meta name="description" content="Reach out for collaborations, consulting, or product discussions." />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Get In Touch
          </h1>
          
          <Card className="glass-card">
            <CardContent className="p-8">
              <p className="text-xl text-muted-foreground text-center">
                Coming soon...
              </p>
              <p className="text-sm text-muted-foreground text-center mt-4">
                A contact form and various ways to reach me will be available here soon.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
