import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Helmet } from "react-helmet-async";
import { Github, LogOut, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

type GuestbookEntry = {
  id: string;
  githubLogin: string;
  githubName: string;
  githubAvatar?: string | null;
  githubProfile?: string | null;
  message: string;
  createdAt: string;
};

type GuestbookSession = {
  user: {
    id: string;
    login: string;
    name: string;
    avatarUrl?: string;
    profileUrl?: string;
  } | null;
};

const fetchJSON = async <T,>(url: string, options?: RequestInit) => {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return (await res.json()) as T;
};

export default function GuestbookPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [message, setMessage] = useState("");

  const { data: sessionData } = useQuery<GuestbookSession>({
    queryKey: ["guestbook-session"],
    queryFn: () => fetchJSON<GuestbookSession>("/api/guestbook/session"),
  });

  const { data: entries, isLoading } = useQuery<GuestbookEntry[]>({
    queryKey: ["guestbook"],
    queryFn: () => fetchJSON<GuestbookEntry[]>("/api/guestbook"),
  });

  const { mutateAsync: submitEntry, isPending: isSubmitting } = useMutation({
    mutationFn: async (payload: { message: string }) => {
      return fetchJSON<GuestbookEntry>("/api/guestbook", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["guestbook"] });
      toast({
        title: "Entry added!",
        description: "Thanks for leaving a note in the guestbook.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Unable to post entry",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const sessionUser = sessionData?.user;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!sessionUser) {
      window.location.href = "/api/auth/github";
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Write something inspiring for future visitors!",
      });
      return;
    }

    await submitEntry({ message: message.trim() });
  };

  const handleSignOut = async () => {
    await fetchJSON("/api/auth/github/logout", { method: "POST" });
    queryClient.invalidateQueries({ queryKey: ["guestbook-session"] });
    toast({
      title: "Signed out",
      description: "GitHub session cleared.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16">
      <Helmet>
        <title>Guestbook | Delowar Hossain</title>
        <meta
          name="description"
          content="Leave a note in Delowar Hossain's guestbook. Share how the work inspired you and sign in with GitHub to join the story."
        />
      </Helmet>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-12"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
            Guestbook
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Drop a note, fuel the legend
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sign in with GitHub and leave a short message. Your avatar, handle, and timestamp become
            part of the public changelog for this portfolio.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
          <motion.div
            className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {sessionUser ? (
                  <Avatar className="h-12 w-12 border border-white/20">
                    <AvatarImage src={sessionUser.avatarUrl} alt={sessionUser.name} />
                    <AvatarFallback>
                      {sessionUser.name
                        .split(" ")
                        .map((chunk) => chunk[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Github className="h-6 w-6 text-white" />
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Signed in as</p>
                  <p className="text-white font-semibold">
                    {sessionUser ? sessionUser.name : "Anonymous explorer"}
                  </p>
                </div>
              </div>
              {sessionUser ? (
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-white"
                  type="button"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
              ) : (
                <Button
                  onClick={() => (window.location.href = "/api/auth/github")}
                  className="bg-white text-slate-900 hover:bg-slate-100"
                  type="button"
                >
                  <Github className="h-4 w-4 mr-2" />
                  Sign in with GitHub
                </Button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="text-sm font-semibold text-white flex items-center gap-2">
                <PenSquare className="h-4 w-4" />
                Message
              </label>
              <Textarea
                value={message}
                onChange={(event) => setMessage(event.target.value.slice(0, 360))}
                rows={4}
                maxLength={360}
                placeholder={
                  sessionUser
                    ? "Share how the site helped or pitch your next collab..."
                    : "Sign in with GitHub to unlock the guestbook."
                }
                className="bg-black/40 border-white/10 text-white resize-none"
                disabled={!sessionUser || isSubmitting}
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{message.length}/360 characters</span>
                <span>Markdown-free &bull; keep it respectful</span>
              </div>
              <Button
                type="submit"
                disabled={!sessionUser || isSubmitting}
                className="w-full bg-gradient-to-r from-primary via-accent to-primary"
              >
                {isSubmitting ? "Sending..." : "Post to guestbook"}
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-6"
          >
            {isLoading && <p className="text-muted-foreground">Loading entries…</p>}
            {!isLoading && entries && entries.length === 0 && (
              <p className="text-muted-foreground">
                The guestbook is empty. Be the first to leave a trail!
              </p>
            )}
            {!isLoading &&
              entries?.map((entry, index) => (
                <motion.article
                  key={entry.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10 border border-white/10">
                      <AvatarImage src={entry.githubAvatar || undefined} alt={entry.githubName} />
                      <AvatarFallback>
                        {entry.githubName
                          .split(" ")
                          .map((chunk) => chunk[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <a
                        href={entry.githubProfile || `https://github.com/${entry.githubLogin}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white font-semibold hover:text-accent transition-colors"
                      >
                        {entry.githubName}
                      </a>
                      <p className="text-xs text-muted-foreground">
                        @{entry.githubLogin} •{" "}
                        {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-100 whitespace-pre-wrap">{entry.message}</p>
                </motion.article>
              ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
