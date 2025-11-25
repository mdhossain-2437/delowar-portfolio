import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

export default function Blog() {
  const blogPosts = [
    {
      title: "Modern Web Development Best Practices",
      excerpt:
        "Explore the latest trends and best practices in modern web development, from performance optimization to user experience design.",
      date: "August 25, 2025",
      readTime: "5 min read",
      category: "Web Development",
      imageUrl: "/blog-1.jpg", // Add your image
    },
    {
      title: "Getting Started with AI Development",
      excerpt:
        "A comprehensive guide to beginning your journey in AI development, covering essential concepts and practical implementations.",
      date: "August 18, 2025",
      readTime: "8 min read",
      category: "Artificial Intelligence",
      imageUrl: "/blog-2.jpg", // Add your image
    },
    {
      title: "The Future of TypeScript Development",
      excerpt:
        "Discover how TypeScript is shaping the future of web development and why it's becoming the go-to choice for developers.",
      date: "August 10, 2025",
      readTime: "6 min read",
      category: "TypeScript",
      imageUrl: "/blog-3.jpg", // Add your image
    },
  ];

  return (
    <section
      id="blog"
      className="py-20 bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              Blog & Articles
            </span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-w-16 aspect-h-9 bg-muted">
                    {/* Replace with your actual image */}
                    <div className="w-full h-48 bg-gradient-to-br from-purple-500/20 to-cyan-500/20"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-sm text-slate-500">
                        {post.category}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-sm text-slate-500">
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white hover:text-purple-300 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-400 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        {post.date}
                      </span>
                      <Button
                        variant="ghost"
                        className="text-purple-400 hover:text-purple-300"
                      >
                        Read More →
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border-slate-700 text-slate-300 hover:border-purple-500 hover:text-purple-300 hover:bg-slate-800/50 transition-all"
            >
              View All Articles
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
