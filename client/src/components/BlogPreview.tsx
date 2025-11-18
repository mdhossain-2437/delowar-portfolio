import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Clock, BookOpen } from "lucide-react";
import { getAllBlogPosts } from "@/lib/blogData";

export default function BlogPreview() {
  const posts = [...getAllBlogPosts()]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 3);

  return (
    <section
      id="blog"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30"
      data-testid="blog-preview"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <p className="text-sm font-medium text-primary uppercase tracking-[0.2em] flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              From the blog
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Narratives from recent builds
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              I document the systems thinking behind every product sprint—here
              are a few fresh notes. Dive deeper for pagination, filters, and
              full case-style write-ups.
            </p>
          </div>

          <div className="flex md:flex-col lg:flex-row gap-3">
            <Link
              to="/blog"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-background transition-colors"
            >
              Browse all posts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group rounded-3xl border border-border/60 bg-card/80 backdrop-blur px-6 pt-6 pb-8 flex flex-col h-full"
            >
              <div
                className="h-40 rounded-2xl mb-6 overflow-hidden"
                style={{
                  backgroundImage: `url(${post.coverImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-background/80 to-background/10 flex items-end">
                  <div className="p-4">
                    <span className="inline-flex items-center rounded-full bg-background/80 px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
                      {post.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 flex-1">
                <h3 className="text-xl font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {post.excerpt}
                </p>
                {post.metrics?.[0] && (
                  <div className="rounded-2xl border border-border/50 bg-background/60 px-4 py-3 text-sm">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      {post.metrics[0].label}
                    </p>
                    <p className="text-xl font-semibold text-foreground">
                      {post.metrics[0].value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {post.metrics[0].context}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {new Date(post.publishedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {post.readTime} min read
                </span>
              </div>

              <Link
                to={`/blog/${post.slug}`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors"
                aria-label={`Read ${post.title}`}
              >
                Keep reading
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
