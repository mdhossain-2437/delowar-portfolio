import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function BlogPostPage() {
  const { slug = "unknown" } = useParams();

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Helmet>
          <title>{slug} | Delowar Blog</title>
          <meta name="description" content={`Blog post placeholder for ${slug}`} />
        </Helmet>
        <Link to="/blog">
          <Button variant="ghost" className="mb-6" data-testid="back-to-blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Blog Post: {slug}
          </h1>
          
          <Card className="glass-card">
            <CardContent className="p-8">
              <p className="text-xl text-muted-foreground text-center">
                Coming soon...
              </p>
              <p className="text-sm text-muted-foreground text-center mt-4">
                This blog post will be available soon.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
