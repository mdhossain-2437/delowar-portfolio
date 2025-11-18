import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  SlidersHorizontal,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Globe2,
  ExternalLink,
} from "lucide-react";
import {
  getAllBlogPosts,
  getBlogCategories,
  getAllTags,
} from "@/lib/blogData";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useCommunityArticles } from "@/hooks/useCommunityArticles";
import type { ExternalBlogArticle } from "@/lib/externalBlogService";

const postsPerPage = 4;

export default function BlogPage() {
  const posts = useMemo(() => getAllBlogPosts(), []);
  const categories = useMemo(() => getBlogCategories(), []);
  const tags = useMemo(() => getAllTags(), []);
  const {
    data: communityArticles = [],
    isLoading: communityLoading,
    error: communityError,
  } = useCommunityArticles("productivity");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, category, selectedTag, sortBy]);

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (category !== "All") {
      result = result.filter((post) => post.category === category);
    }

    if (selectedTag !== "All") {
      result = result.filter((post) => post.tags.includes(selectedTag));
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          post.excerpt.toLowerCase().includes(term) ||
          post.tags.some((tag) => tag.toLowerCase().includes(term)),
      );
    }

    switch (sortBy) {
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.publishedAt).getTime() -
            new Date(b.publishedAt).getTime(),
        );
        break;
      case "popular":
        result.sort((a, b) => b.views - a.views);
        break;
      case "readTime":
        result.sort((a, b) => a.readTime - b.readTime);
        break;
      default:
        result.sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime(),
        );
    }

    return result;
  }, [posts, search, category, selectedTag, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / postsPerPage));
  const paginatedPosts = filteredPosts.slice(
    (page - 1) * postsPerPage,
    page * postsPerPage,
  );

  const featuredPost = filteredPosts[0];
  const secondaryPosts = filteredPosts.slice(1, 3);
  const highlightCommunity = communityArticles.slice(0, 4);
  const communityBlocks: (ExternalBlogArticle | null)[] = communityLoading
    ? Array.from({ length: 4 }).map(() => null)
    : highlightCommunity;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <Helmet>
        <title>Blog | Delowar Hossain</title>
        <meta
          name="description"
          content="Insights on product engineering, AI experiments, and workflow design."
        />
      </Helmet>

      <div className="max-w-6xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
                Blog & Notes
              </p>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mt-2">
                Thinking out loud about products, systems, and AI.
              </h1>
              <p className="text-muted-foreground mt-4 max-w-3xl">
                Weekly notes from the lab—covering experiments with React, AI
                copilots, human-centered dashboards, and the rituals that keep
                multi-suite products healthy.
              </p>
            </div>

            <div className="grid md:grid-cols-[2fr_1fr] gap-4 items-center glass-card rounded-3xl border border-border/60 p-6">
              <div className="flex items-center gap-3">
                <Search className="text-primary w-5 h-5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search articles, tags, or topics…"
                  className="w-full bg-transparent focus:outline-none text-lg"
                />
              </div>
              <div className="flex flex-wrap gap-3 justify-end">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-background border border-border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="popular">Most read</option>
                    <option value="readTime">Shortest read</option>
                  </select>
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-background border border-border rounded-lg px-3 py-2 text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                onClick={() => setSelectedTag("All")}
                className={`cursor-pointer ${
                  selectedTag === "All"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                All tags
              </Badge>
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`cursor-pointer ${
                    selectedTag === tag
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>

        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid lg:grid-cols-[2fr_1fr] gap-6 items-start"
          >
            <Card className="overflow-hidden glass-card border border-border/70">
              <img
                src={featuredPost.coverImage}
                alt={featuredPost.title}
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  <span>{featuredPost.category}</span>
                  <span>{featuredPost.readTime} min read</span>
                </div>
                <h2 className="text-3xl font-bold">{featuredPost.title}</h2>
                <p className="text-muted-foreground">{featuredPost.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {featuredPost.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                {featuredPost.metrics?.[0] && (
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      Spotlight metric
                    </p>
                    <p className="text-2xl font-semibold text-foreground">
                      {featuredPost.metrics[0].value}
                    </p>
                    <p>{featuredPost.metrics[0].context}</p>
                  </div>
                )}
                <Link to={`/blog/${featuredPost.slug}`}>
                  <Button className="mt-4" size="lg">
                    Read article
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {secondaryPosts.map((post) => (
                <Card key={post.id} className="glass-card">
                  <CardContent className="p-4 flex flex-col gap-2">
                    <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      {post.category} • {post.readTime} min read
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-lg font-semibold hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 rounded-3xl border border-border/60 bg-card/80 p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-2">
                <Globe2 className="h-4 w-4" />
                Open API feed
              </p>
              <h3 className="text-2xl font-semibold text-foreground mt-1">
                Community pulse
              </h3>
              <p className="text-sm text-muted-foreground">
                Live posts pulled from the DEV Community API keep this blog grounded in what
                builders across the globe are publishing right now.
              </p>
            </div>
            <Badge variant="outline" className="px-4 py-1">
              Powered by dev.to
            </Badge>
          </div>

          {communityError && (
            <div className="text-sm text-destructive">
              Could not load the community feed right now. Local posts are still available.
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {communityBlocks.map((article, index) => (
              <Card key={article?.id ?? index} className="border border-border/60">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      <span>{article ? new Date(article.publishedAt).toLocaleDateString() : "..."}</span>
                      <span>•</span>
                      <span>{article ? `${article.readTime} min read` : "fetching"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {article?.author?.profileImage && (
                        <img
                          src={article.author.profileImage}
                          alt={article.author.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground">by {article?.author?.name ?? "Loading"}</p>
                        <p className="text-xs text-muted-foreground/80">@{article?.author?.username ?? "..."}</p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-foreground">
                      {article?.title ?? "Fetching community insights…"}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {article?.description ?? "Connecting to DEV Community..."}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(article?.tags ?? ["webdev", "ai"]).slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    {article ? (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
                      >
                        View on DEV
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">Loading…</span>
                    )}
                  </CardContent>
                </Card>
            ))}
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-semibold mb-4">All articles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {paginatedPosts.map((post) => (
              <Card
                key={post.id}
                className="glass-card border border-border/60 hover:border-primary/60 transition-all"
              >
                <CardContent className="p-6 space-y-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{post.readTime} min</span>
                    <span>•</span>
                    <span>{post.views.toLocaleString()} views</span>
                  </div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-xl font-semibold hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                  {post.metrics?.[0] && (
                    <div className="rounded-2xl bg-muted/50 px-4 py-3 text-sm text-foreground/80">
                      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                        Outcome
                      </p>
                      <p className="text-xl font-semibold">{post.metrics[0].value}</p>
                      <p>{post.metrics[0].context}</p>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Link to={`/blog/${post.slug}`}>
                    <Button variant="ghost" className="mt-2">
                      Continue reading
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No posts match your filters yet. Try a different keyword.
            </div>
          )}

          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </div>
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
