import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Eye } from "lucide-react";
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getRelatedBlogPosts,
} from "@/lib/blogData";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";

export default function BlogPostPage() {
  const { slug = "" } = useParams();
  const post = getBlogPostBySlug(slug);
  const fallbackPosts = useMemo(() => getAllBlogPosts(), []);
  const related = slug ? getRelatedBlogPosts(slug, 3) : [];

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center py-24">
        <div className="text-center space-y-4">
          <p className="text-2xl font-semibold">Post not found</p>
          <Link to="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>{post.title} | Blog</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>
      <div className="max-w-4xl mx-auto space-y-10">
        <Link to="/blog">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <span>{post.category}</span>
            <span>•</span>
            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{post.readTime} min read</span>
            <span>•</span>
            <span>{post.views.toLocaleString()} views</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">{post.title}</h1>
          <p className="text-lg text-muted-foreground">{post.excerpt}</p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-64 object-cover rounded-2xl"
        />

        <article className="space-y-10 text-muted-foreground leading-relaxed">
          {post.content.map((section) => {
            const hasMedia = Boolean(section.media);
            return (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className={
                hasMedia
                  ? "grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center"
                  : "space-y-3"
              }
            >
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">
                  {section.title}
                </h2>
                <p>{section.body}</p>
                {section.bullets && (
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground/90">
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {section.highlight && (
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
                    {section.highlight}
                  </div>
                )}
              </div>

              {hasMedia && section.media && (
                <figure className="rounded-2xl overflow-hidden border border-border/60 bg-card shadow-lg">
                  <img
                    src={section.media.src}
                    alt={section.media.alt}
                    className="w-full h-60 object-cover"
                  />
                  <figcaption className="text-xs text-muted-foreground px-4 py-3">
                    {section.media.alt}
                  </figcaption>
                </figure>
              )}
            </motion.section>
            );
          })}
        </article>

        {post.metrics?.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-semibold text-foreground">
              Outcome snapshots
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {post.metrics.map((metric) => (
                <Card
                  key={metric.label}
                  className="bg-gradient-to-br from-card to-card/60 border-border/70"
                >
                  <CardContent className="p-6 space-y-3">
                    <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="text-4xl font-bold text-foreground">
                      {metric.value}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {metric.context}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        )}

        <Card className="glass-card">
          <CardContent className="p-6 flex flex-wrap gap-6 justify-between">
            <div className="flex items-center gap-3 text-muted-foreground">
              <BookOpen className="w-5 h-5" />
              <span>{post.readTime} minute read</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Eye className="w-5 h-5" />
              <span>{post.views.toLocaleString()} total views</span>
            </div>
          </CardContent>
        </Card>

        {post.gallery?.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-semibold text-foreground">
              Process gallery
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {post.gallery.map((item) => (
                <figure
                  key={item.caption}
                  className="rounded-3xl overflow-hidden border border-border/60 bg-card/80"
                >
                  <img
                    src={item.image}
                    alt={item.caption}
                    className="w-full h-64 object-cover"
                  />
                  <figcaption className="px-5 py-4 text-sm text-muted-foreground">
                    {item.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </motion.section>
        )}

        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Related posts</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {(related.length ? related : fallbackPosts.slice(1, 4)).map(
              (item) => (
                <Card key={item.id} className="glass-card">
                  <CardContent className="p-4 space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      {item.category}
                    </p>
                    <Link
                      to={`/blog/${item.slug}`}
                      className="font-semibold text-sm hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.excerpt}
                    </p>
                  </CardContent>
                </Card>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
