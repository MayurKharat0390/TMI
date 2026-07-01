"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, LogIn, LogOut, CheckCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Post {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
}

const categories = ["All", "Workshops", "Technical Sessions", "Collaborative Events", "Outreach Programs"];

export default function ForumSections() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // New post form fields
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Workshops");
  const [newDescription, setNewDescription] = useState("");

  // 1. Fetch posts and auth status on load
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

  // 2. Handle Login
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
        setIsLoginOpen(false);
        setPassword("");
        toast.success("Logged in as Admin successfully!");
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (err) {
      toast.error("Network error during login");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Handle Logout
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

  // 4. Handle Add Post
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
        toast.success("Post added successfully!");
        setNewTitle("");
        setNewDescription("");
        fetchPosts();
      } else {
        toast.error(data.error || "Failed to add post");
      }
    } catch (err) {
      toast.error("Error creating post");
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Handle Delete Post
  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      const res = await fetch(`/api/forum/posts?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        toast.success("Announcement deleted");
        fetchPosts();
      } else {
        const data = await res.json();
        toast.error(data.error || "Delete failed");
      }
    } catch (err) {
      toast.error("Error deleting post");
    }
  };

  // Filter posts based on selected category tab
  const filteredPosts = posts.filter(
    (post) => selectedCategory === "All" || post.category === selectedCategory
  );

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      
      {/* Admin Action Bar */}
      <div className="flex justify-between items-center bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", isAdmin ? "bg-green-500" : "bg-gray-300")} />
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            {isAdmin ? "Admin Console Session Active" : "Guest Mode view"}
          </span>
        </div>

        {isAdmin ? (
          <Button variant="outline" size="sm" onClick={handleLogout} className="text-destructive hover:bg-destructive/10 gap-1.5">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </Button>
        ) : (
          <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 border-[#DFBA73] text-[#DFBA73] hover:bg-[#DFBA73]/10">
                <LogIn className="w-3.5 h-3.5" /> Admin Login
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-white border border-[#DFBA73]/30">
              <DialogHeader>
                <DialogTitle className="text-[#DFBA73] tracking-wider uppercase font-semibold">Admin Authentication</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleLogin} className="space-y-4 pt-4">
                <div className="space-y-1.5">
                  <label htmlFor="auth-pwd" className="text-xs uppercase font-medium text-muted-foreground tracking-wider">
                    Console Password
                  </label>
                  <Input
                    type="password"
                    id="auth-pwd"
                    placeholder="Enter console password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-border focus:border-[#DFBA73]"
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full bg-[#DFBA73] hover:bg-[#c9a45e] text-white">
                  {isLoading ? "Authenticating..." : "Login"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Admin Post Creation Panel */}
      {isAdmin && (
        <div className="bg-white border border-[#DFBA73]/20 p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Plus className="w-5 h-5 text-[#DFBA73]" />
            <h3 className="font-semibold text-lg text-foreground tracking-wide">
              Create New Forum Announcement
            </h3>
          </div>

          <form onSubmit={handleAddPost} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="p-title" className="text-xs uppercase font-medium text-muted-foreground">Title</label>
                <Input
                  id="p-title"
                  placeholder="e.g. Aerodynamics Design Bootcamp"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="border-border focus:border-[#DFBA73]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="p-cat" className="text-xs uppercase font-medium text-muted-foreground">Category</label>
                <select
                  id="p-cat"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-border bg-white text-sm focus:outline-none focus:border-[#DFBA73]"
                >
                  {categories.slice(1).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-1.5 flex-grow flex flex-col">
                <label htmlFor="p-desc" className="text-xs uppercase font-medium text-muted-foreground">Description</label>
                <textarea
                  id="p-desc"
                  placeholder="Enter session or outreach event details..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-3 flex-grow rounded-md border border-border bg-white text-sm focus:outline-none focus:border-[#DFBA73] min-h-[100px]"
                  required
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full bg-[#DFBA73] hover:bg-[#c9a45e] text-white">
                {isLoading ? "Posting..." : "Publish Announcement"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 justify-center border-b border-border pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all",
              selectedCategory === cat
                ? "bg-[#DFBA73] text-white shadow-sm"
                : "border border-border text-muted-foreground hover:border-[#DFBA73] hover:text-[#DFBA73]"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Announcements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="group rounded-2xl border border-border bg-white p-6 sm:p-8 transition-all hover:shadow-md hover:border-[#DFBA73]/30 flex flex-col justify-between h-full relative"
            >
              {/* Category tag */}
              <div className="flex justify-between items-start mb-4">
                <span className="bg-[#DFBA73]/10 text-[#DFBA73] rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-widest">
                  {post.category}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  {post.date}
                </span>
              </div>

              <div className="space-y-3 flex-grow">
                <h4 className="text-xl font-bold uppercase tracking-wider text-foreground group-hover:text-[#DFBA73] transition-colors">
                  {post.title}
                </h4>
                <p className="text-muted-foreground text-xs leading-relaxed text-justify">
                  {post.description}
                </p>
              </div>

              {/* Admin delete option */}
              {isAdmin && (
                <div className="border-t border-border mt-5 pt-4 flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeletePost(post.id)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-16 text-center space-y-3">
            <ShieldAlert className="w-10 h-10 text-[#DFBA73]/60 mx-auto" />
            <h4 className="text-lg font-bold text-foreground uppercase tracking-widest">
              No Current Announcements
            </h4>
            <p className="text-muted-foreground text-xs max-w-sm mx-auto leading-relaxed">
              We will update this section soon with upcoming {selectedCategory !== "All" ? selectedCategory.toLowerCase() : "activities"}. Stay tuned!
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
