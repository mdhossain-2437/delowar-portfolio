import { useEffect, useMemo, useState } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        setToken(idToken);
      } else {
        setToken("");
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!token) {
      setMessages([]);
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/contact/messages", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data = await res.json();
        setMessages(data);
      } catch (error: any) {
        toast({
          title: "Unable to load messages",
          description: error.message,
          variant: "destructive",
        });
      }
    })();
  }, [token, toast]);

  const selectedMessage = useMemo(
    () => messages.find((message) => message.id === selectedId) ?? null,
    [messages, selectedId],
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      toast({ title: "Signed in" });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!token || !selectedMessage || reply.trim().length < 5) {
      return;
    }
    setIsReplying(true);
    try {
      const res = await fetch(
        `/api/contact/messages/${selectedMessage.id}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: reply }),
        },
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to send reply");
      }
      toast({ title: "Reply sent" });
      setReply("");
      const updated = await res.json();
      setMessages((prev) =>
        prev.map((msg) => (msg.id === selectedMessage.id ? updated.message : msg)),
      );
    } catch (error: any) {
      toast({
        title: "Failed to send reply",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsReplying(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md space-y-4 border border-border rounded-2xl p-6 bg-card"
        >
          <h1 className="text-2xl font-bold text-center">Admin Login</h1>
          <Input
            type="email"
            placeholder="admin@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Signed in as {user.email}
            </p>
          </div>
          <Button variant="outline" onClick={() => signOut(firebaseAuth)}>
            Sign out
          </Button>
        </div>

        <div className="grid lg:grid-cols-[2fr,1fr] gap-6">
          <div className="border border-border rounded-2xl p-4">
            <h2 className="text-xl font-semibold mb-4">Messages</h2>
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2">
              {messages.map((message) => (
                <button
                  key={message.id}
                  className={`w-full text-left border border-border rounded-xl p-4 hover:border-primary transition-colors ${
                    selectedId === message.id ? "border-primary" : ""
                  }`}
                  onClick={() => setSelectedId(message.id)}
                >
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{message.email}</span>
                    <span>{new Date(message.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="font-semibold text-foreground mt-2">
                    {message.name}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {message.message}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="border border-border rounded-2xl p-4 space-y-4">
            {selectedMessage ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {selectedMessage.email}
                  </p>
                  <h3 className="text-lg font-semibold">{selectedMessage.name}</h3>
                  <p className="text-sm mt-2">{selectedMessage.message}</p>
                </div>
                <Textarea
                  placeholder="Write your reply..."
                  className="min-h-[160px]"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <Button
                  onClick={handleReply}
                  disabled={isReplying || reply.trim().length < 5}
                  className="w-full"
                >
                  {isReplying ? "Sending..." : "Send reply"}
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select a message to view details and reply.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
