import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import { getAllBlogPosts } from "@/lib/blogData";
import {
  ArrowUpRight,
  Link as LinkIcon,
  BookOpen,
  LayoutDashboard,
  Sparkles,
  Search,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const blogPosts = useMemo(() => getAllBlogPosts().slice(0, 5), []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(!open);
      }
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!mounted) return null;

  const handleNavigate = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  const externalActions = [
    {
      label: "Newsletter — Product Sprints",
      href: "https://mdhossain2437.substack.com",
      icon: <ArrowUpRight className="h-4 w-4" />,
    },
    {
      label: "Github profile",
      href: "https://github.com/mdhossain-2437",
      icon: <ArrowUpRight className="h-4 w-4" />,
    },
  ];

  return createPortal(
    <div
      className={`fixed inset-0 z-[2000] ${open ? "visible opacity-100" : "invisible opacity-0"} transition-opacity duration-150 bg-black/40 backdrop-blur-sm`}
      onClick={() => onOpenChange(false)}
    >
      <div
        className="mx-auto mt-24 w-full max-w-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <Command
          className="bg-background text-foreground rounded-2xl border border-border shadow-2xl overflow-hidden"
          data-state={open ? "open" : "closed"}
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Command.Input placeholder="Jump to a page, project, or post…" className="flex-1 bg-transparent outline-none" />
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded leading-none">
              ⌘K
            </span>
          </div>
          <Command.List className="max-h-[420px] overflow-y-auto px-2 py-3 space-y-2">
            <Command.Empty className="px-4 py-6 text-center text-sm text-muted-foreground">
              No matches. Try another keyword.
            </Command.Empty>

            <Command.Group heading="Navigate">
              <Command.Item
                onSelect={() => handleNavigate("/projects")}
                className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer aria-selected:bg-accent/20"
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">Projects</p>
                    <p className="text-xs text-muted-foreground">Case studies, featured builds</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Command.Item>
              <Command.Item
                onSelect={() => handleNavigate("/blog")}
                className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer aria-selected:bg-accent/20"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4 text-accent" />
                  <div>
                    <p className="text-sm font-semibold">Blog</p>
                    <p className="text-xs text-muted-foreground">Stories, experiments, dev notes</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Command.Item>
              <Command.Item
                onSelect={() => handleNavigate("/workspace/tasks")}
                className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer aria-selected:bg-accent/20"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <div>
                    <p className="text-sm font-semibold">Creator OS</p>
                    <p className="text-xs text-muted-foreground">Operational hub + automations</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Command.Item>
            </Command.Group>

            <Command.Separator />

            <Command.Group heading="Latest posts">
              {blogPosts.map((post) => (
                <Command.Item
                  key={post.slug}
                  onSelect={() => handleNavigate(`/blog/${post.slug}`)}
                  className="flex items-start justify-between px-4 py-3 rounded-xl cursor-pointer aria-selected:bg-accent/20"
                >
                  <div>
                    <p className="text-sm font-semibold">{post.title}</p>
                    <p className="text-xs text-muted-foreground">{post.excerpt}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground mt-1" />
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Separator />

            <Command.Group heading="External surfaces">
              {externalActions.map((action) => (
                <Command.Item
                  key={action.label}
                  onSelect={() => {
                    window.open(action.href, "_blank", "noopener,noreferrer");
                    onOpenChange(false);
                  }}
                  className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer aria-selected:bg-accent/20"
                >
                  <div className="flex items-center gap-3">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-semibold">{action.label}</p>
                  </div>
                  {action.icon}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>,
    document.body,
  );
}
