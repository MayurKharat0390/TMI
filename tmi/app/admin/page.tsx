"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, LogIn, LogOut, ShieldAlert, Award, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";

interface Post {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
}

const categories = ["Workshops", "Technical Sessions", "Collaborative Events", "Outreach Programs"];

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // New post form fields
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Workshops");
  const [newDescription, setNewDescription] = useState("");

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/forum/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/check");
      if (res.ok) {
        const data = await res.json();
        setIsAdmin(data.authenticated);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPosts();
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok) {
        setIsAdmin(true);
        setPassword("");
        toast.success("Authenticated as Administrator");
      } else {
        toast.error(data.error || "Authentication failed");
      }
    } catch (err) {
      toast.error("Network error during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        setIsAdmin(false);
        toast.success("Logged out successfully");
      }
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/forum/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          description: newDescription
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Announcement published successfully!");
        setNewTitle("");
        setNewDescription("");
        fetchPosts();
      } else {
        toast.error(data.error || "Failed to publish");
      }
    } catch (err) {
      toast.error("Error creating post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      const res = await fetch(`/api/forum/posts?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        toast.success("Announcement removed");
        fetchPosts();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete");
      }
    } catch (err) {
      toast.error("Error deleting post");
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-background relative flex flex-col items-center">
      
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <Image src="/images/nav_logo.png" alt="TMI Logo" fill className="object-contain" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-[0.2em] text-foreground">
            Admin Console
          </h1>
          <p className="text-muted-foreground text-xs uppercase tracking-widest mt-2">
            Team Maverick India Backend Portal
          </p>
          <div className="w-12 h-[1px] bg-[#DFBA73]/50 mx-auto mt-4" />
        </div>

        {/* ─── LOGIN SCREEN ─── */}
        {!isAdmin ? (
          <div className="w-full max-w-md mx-auto bg-white border border-[#DFBA73]/20 p-8 rounded-2xl shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <ShieldAlert className="w-8 h-8 text-[#DFBA73] mx-auto animate-pulse" />
              <h3 className="font-semibold text-lg text-foreground uppercase tracking-wider">
                System Authorization
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Access is restricted to authorized personnel only. Please input the security console key to continue.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="auth-pass" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                  Console Key
                </label>
                <Input
                  type="password"
                  id="auth-pass"
                  placeholder="Enter console password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-border focus:border-[#DFBA73] h-11"
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full h-11 bg-[#DFBA73] hover:bg-[#c9a45e] text-white gap-1.5">
                <LogIn className="w-4 h-4" /> {isLoading ? "Checking Key..." : "Authenticate"}
              </Button>
            </form>
          </div>
        ) : (
          
          /* ─── ADMIN DASHBOARD ─── */
          <div className="space-y-10">
            
            {/* Status & Logout */}
            <div className="flex justify-between items-center bg-white border border-[#DFBA73]/15 p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Authenticated: Admin Session
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-destructive hover:bg-destructive/10 gap-1.5 border-destructive/20 hover:border-destructive">
                <LogOut className="w-3.5 h-3.5" /> Logout
              </Button>
            </div>

            {/* Creation Form */}
            <div className="bg-white border border-[#DFBA73]/20 p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Plus className="w-5 h-5 text-[#DFBA73]" />
                <h3 className="font-semibold text-lg text-foreground uppercase tracking-wider">
                  Publish New Forum Announcement
                </h3>
              </div>

              <form onSubmit={handleAddPost} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="adm-title" className="text-xs uppercase font-medium text-muted-foreground">Title</label>
                    <Input
                      id="adm-title"
                      placeholder="e.g. Aerodynamics Design Bootcamp"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="border-border focus:border-[#DFBA73]"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="adm-cat" className="text-xs uppercase font-medium text-muted-foreground">Category</label>
                    <select
                      id="adm-cat"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-border bg-white text-sm focus:outline-none focus:border-[#DFBA73]"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4 flex flex-col justify-between">
                  <div className="space-y-1.5 flex-grow flex flex-col">
                    <label htmlFor="adm-desc" className="text-xs uppercase font-medium text-muted-foreground">Description</label>
                    <textarea
                      id="adm-desc"
                      placeholder="Enter session or outreach event details..."
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="w-full p-3 flex-grow rounded-md border border-border bg-white text-sm focus:outline-none focus:border-[#DFBA73] min-h-[100px]"
                      required
                    />
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full bg-[#DFBA73] hover:bg-[#c9a45e] text-white">
                    {isLoading ? "Publishing..." : "Publish Announcement"}
                  </Button>
                </div>
              </form>
            </div>

            {/* List of Existing Posts */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-foreground uppercase tracking-wider border-b border-border pb-2">
                Active Announcements ({posts.length})
              </h3>
              
              <div className="space-y-4">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <div key={post.id} className="bg-white border border-border rounded-xl p-5 flex justify-between items-start gap-4 hover:border-[#DFBA73]/20 transition-all shadow-sm">
                      <div className="space-y-1.5 flex-grow">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="bg-[#DFBA73]/10 text-[#DFBA73] rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest">
                            {post.category}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {post.date}
                          </span>
                        </div>
                        <h4 className="font-bold text-foreground tracking-wide text-base">
                          {post.title}
                        </h4>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          {post.description}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePost(post.id)}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive h-9 w-9 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground text-xs uppercase tracking-wider">
                    No Announcements published. Use form above to add one.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
