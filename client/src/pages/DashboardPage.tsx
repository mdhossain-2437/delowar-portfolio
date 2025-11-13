import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Dashboard
          </h1>
          
          <Card className="glass-card">
            <CardContent className="p-8">
              <p className="text-xl text-muted-foreground text-center">
                Coming soon...
              </p>
              <p className="text-sm text-muted-foreground text-center mt-4">
                Analytics and content management dashboard coming soon.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
