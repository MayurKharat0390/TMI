"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, LogIn, LogOut, ShieldAlert, Edit, Save, X, Layout, Users, Image as ImageIcon } from "lucide-react";
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

interface Section {
  id: string;
  title: string;
  description: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  year: string;
  image: string;
  email?: string;
  linkedin?: string;
  active: boolean;
  team: string;
}

interface TeamRoster {
  faculty: TeamMember[];
  founding: TeamMember[];
  members: TeamMember[];
}

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

const categories = ["Workshops", "Technical Sessions", "Collaborative Events", "Outreach Programs"];

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "categories" | "team" | "gallery">("posts");

  // Roster states
  const [roster, setRoster] = useState<TeamRoster>({ faculty: [], founding: [], members: [] });
  const [memberType, setMemberType] = useState<"faculty" | "founding" | "members">("members");
  const [mName, setMName] = useState("");
  const [mRole, setMRole] = useState("");
  const [mYear, setMYear] = useState("");
  const [mImage, setMImage] = useState("");
  const [mEmail, setMEmail] = useState("");
  const [mLinkedin, setMLinkedin] = useState("");
  const [mTeam, setMTeam] = useState("");
  const [mActive, setMActive] = useState(true);

  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [editingMemberType, setEditingMemberType] = useState<"faculty" | "founding" | "members">("members");

  // Gallery states
  const [gallery, setGallery] = useState<Record<string, GalleryImage[]>>({});
  const [gYear, setGYear] = useState("2026");
  const [gSrc, setGSrc] = useState("");
  const [gAlt, setGAlt] = useState("");

  // Announcements states
  const [posts, setPosts] = useState<Post[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Workshops");
  const [newDescription, setNewDescription] = useState("");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("Workshops");
  const [editDescription, setEditDescription] = useState("");

  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editSectionDesc, setEditSectionDesc] = useState("");

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/forum/posts");
      if (res.ok) setPosts(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchSections = async () => {
    try {
      const res = await fetch("/api/forum/sections");
      if (res.ok) setSections(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchRoster = async () => {
    try {
      const res = await fetch("/api/team/members");
      if (res.ok) setRoster(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) setGallery(await res.json());
    } catch (e) { console.error(e); }
  };

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/check");
      if (res.ok) {
        const data = await res.json();
        setIsAdmin(data.authenticated);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchPosts();
    fetchSections();
    fetchRoster();
    fetchGallery();
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
      if (res.ok) {
        setIsAdmin(true);
        setPassword("");
        toast.success("Authenticated successfully");
      } else {
        const data = await res.json();
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
    } catch (err) { toast.error("Logout failed"); }
  };

  /* ── ANNOUNCEMENTS CRUD ── */
  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/forum/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, category: newCategory, description: newDescription })
      });
      if (res.ok) {
        toast.success("Announcement published!");
        setNewTitle(""); setNewDescription("");
        fetchPosts();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to publish");
      }
    } catch (err) { toast.error("Error creating post"); }
    finally { setIsLoading(false); }
  };

  const startEditPost = (post: Post) => {
    setEditingPostId(post.id);
    setEditTitle(post.title);
    setEditCategory(post.category);
    setEditDescription(post.description);
  };

  const handleSavePostEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle || !editDescription || !editingPostId) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/forum/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingPostId, title: editTitle, category: editCategory, description: editDescription })
      });
      if (res.ok) {
        toast.success("Announcement updated!");
        setEditingPostId(null);
        fetchPosts();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update");
      }
    } catch (e) { toast.error("Error updating announcement"); }
    finally { setIsLoading(false); }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Delete announcement?")) return;
    try {
      const res = await fetch(`/api/forum/posts?id=${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Announcement removed"); fetchPosts(); }
    } catch (err) { toast.error("Error deleting post"); }
  };

  /* ── SECTIONS CRUD ── */
  const startEditSection = (section: Section) => {
    setEditingSectionId(section.id);
    setEditSectionDesc(section.description);
  };

  const handleSaveSectionEdit = async (id: string) => {
    if (!editSectionDesc || !id) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/forum/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, description: editSectionDesc })
      });
      if (res.ok) {
        toast.success("Description updated!");
        setEditingSectionId(null);
        fetchSections();
      }
    } catch (e) { toast.error("Error saving section description"); }
    finally { setIsLoading(false); }
  };

  /* ── TEAM ROSTER CRUD ── */
  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mName || !mRole) {
      toast.error("Name and Role are mandatory");
      return;
    }
    setIsLoading(true);
    const method = editingMemberId !== null ? "PUT" : "POST";
    const payload = {
      type: memberType,
      id: editingMemberId,
      name: mName,
      role: mRole,
      year: mYear,
      image: mImage || "/images/logo.png",
      email: mEmail,
      linkedin: mLinkedin,
      team: mTeam,
      active: mActive
    };

    try {
      const res = await fetch("/api/team/members", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success(editingMemberId !== null ? "Member details updated!" : "Member added!");
        clearMemberForm();
        fetchRoster();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save member");
      }
    } catch (e) { toast.error("Error saving team member details"); }
    finally { setIsLoading(false); }
  };

  const startEditMember = (member: TeamMember, type: "faculty" | "founding" | "members") => {
    setEditingMemberId(member.id);
    setEditingMemberType(type);
    setMemberType(type);
    setMName(member.name);
    setMRole(member.role);
    setMYear(member.year);
    setMImage(member.image);
    setMEmail(member.email || "");
    setMLinkedin(member.linkedin || "");
    setMTeam(member.team);
    setMActive(member.active);
  };

  const handleDeleteMember = async (id: number, type: "faculty" | "founding" | "members") => {
    if (!confirm("Are you sure you want to remove this member from the roster?")) return;
    try {
      const res = await fetch(`/api/team/members?type=${type}&id=${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Member removed"); fetchRoster(); }
    } catch (e) { toast.error("Error deleting member"); }
  };

  const clearMemberForm = () => {
    setEditingMemberId(null);
    setMName(""); setMRole(""); setMYear(""); setMImage(""); setMEmail(""); setMLinkedin(""); setMTeam(""); setMActive(true);
  };

  /* ── GALLERY CRUD ── */
  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gYear || !gSrc) {
      toast.error("Year and Source are mandatory");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: gYear, src: gSrc, alt: gAlt })
      });
      if (res.ok) {
        toast.success("Photo added to catalog!");
        setGSrc(""); setGAlt("");
        fetchGallery();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to add photo");
      }
    } catch (e) { toast.error("Error registering photo"); }
    finally { setIsLoading(false); }
  };

  const handleDeletePhoto = async (id: number, year: string) => {
    if (!confirm("Delete photo from catalog?")) return;
    try {
      const res = await fetch(`/api/gallery?year=${year}&id=${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Photo removed"); fetchGallery(); }
    } catch (e) { toast.error("Error removing photo"); }
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
          <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-[0.2em] text-foreground font-sans">
            Admin Console
          </h1>
          <p className="text-muted-foreground text-xs uppercase tracking-widest mt-2 font-sans">
            Team Maverick India Portal
          </p>
          <div className="w-12 h-[1px] bg-[#DFBA73]/50 mx-auto mt-4" />
        </div>

        {/* ─── LOGIN SCREEN ─── */}
        {!isAdmin ? (
          <div className="w-full max-w-md mx-auto bg-white border border-[#DFBA73]/20 p-8 rounded-2xl shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <ShieldAlert className="w-8 h-8 text-[#DFBA73] mx-auto animate-pulse" />
              <h3 className="font-semibold text-lg text-foreground uppercase tracking-wider font-sans">
                System Authorization
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed font-sans">
                Access is restricted to authorized personnel only. Please input the security console key to continue.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="auth-pass" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest font-sans">
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
                  suppressHydrationWarning
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full h-11 bg-[#DFBA73] hover:bg-[#c9a45e] text-white gap-1.5 font-sans">
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
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold font-sans">
                  Authenticated: Admin Session
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-destructive hover:bg-destructive/10 gap-1.5 border-destructive/20 hover:border-destructive font-sans">
                <LogOut className="w-3.5 h-3.5" /> Logout
              </Button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap border-b border-border gap-6">
              {[
                { id: "posts",      label: "Announcements", icon: Edit },
                { id: "categories", label: "Categories",     icon: Layout },
                { id: "team",       label: "Roster Team",    icon: Users },
                { id: "gallery",    label: "Gallery Grid",   icon: ImageIcon }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 font-sans",
                      activeTab === tab.id
                        ? "border-[#DFBA73] text-[#DFBA73]"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" /> {tab.label}
                  </button>
                );
              })}
            </div>

            {/* ──────── TAB 1: ANNOUNCEMENTS ──────── */}
            {activeTab === "posts" && (
              <div className="space-y-10">
                {editingPostId ? (
                  /* Editing Post Form */
                  <div className="bg-[#DFBA73]/5 border border-[#DFBA73]/30 p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
                    <div className="flex items-center justify-between border-b border-[#DFBA73]/20 pb-3">
                      <div className="flex items-center gap-2">
                        <Edit className="w-5 h-5 text-[#DFBA73]" />
                        <h3 className="font-semibold text-lg text-foreground uppercase tracking-wider">
                          Edit Announcement
                        </h3>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setEditingPostId(null)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <form onSubmit={handleSavePostEdit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label htmlFor="edit-title" className="text-xs uppercase font-medium text-muted-foreground">Title</label>
                          <Input
                            id="edit-title"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="border-border focus:border-[#DFBA73] bg-white"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="edit-cat" className="text-xs uppercase font-medium text-muted-foreground">Category</label>
                          <select
                            id="edit-cat"
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
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
                          <label htmlFor="edit-desc" className="text-xs uppercase font-medium text-muted-foreground">Description</label>
                          <textarea
                            id="edit-desc"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="w-full p-3 flex-grow rounded-md border border-border bg-white text-sm focus:outline-none focus:border-[#DFBA73] min-h-[100px]"
                            required
                          />
                        </div>

                        <div className="flex gap-4">
                          <Button type="button" variant="outline" onClick={() => setEditingPostId(null)} className="flex-1">
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isLoading} className="flex-grow bg-[#DFBA73] hover:bg-[#c9a45e] text-white">
                            {isLoading ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* Creation Form */
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
                )}

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
                              <span className="bg-[#DFBA73]/10 text-[#DFBA73] rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest font-sans">
                                {post.category}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {post.date}
                              </span>
                            </div>
                            <h4 className="font-bold text-foreground tracking-wide text-base">
                              {post.title}
                            </h4>
                            <p className="text-muted-foreground text-xs leading-relaxed text-justify">
                              {post.description}
                            </p>
                          </div>

                          <div className="flex flex-col gap-2 flex-shrink-0">
                            <Button variant="ghost" size="icon" onClick={() => startEditPost(post)} className="text-foreground hover:bg-[#DFBA73]/10 hover:text-[#DFBA73] h-9 w-9">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeletePost(post.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive h-9 w-9">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
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

            {/* ──────── TAB 2: CATEGORIES ──────── */}
            {activeTab === "categories" && (
              <div className="space-y-6">
                <div className="bg-white border border-[#DFBA73]/15 p-6 rounded-2xl shadow-md space-y-4">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <Layout className="w-5 h-5 text-[#DFBA73]" />
                    <h3 className="font-semibold text-lg text-foreground uppercase tracking-wider">
                      Edit Forum Category Descriptions
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Update the description text that appears under the main Workshop, Technical Sessions, Collaborative, and Outreach cards on the public page.
                  </p>
                </div>

                <div className="space-y-4">
                  {sections.map((section) => (
                    <div key={section.id} className="bg-white border border-border rounded-xl p-6 space-y-4 shadow-sm hover:border-[#DFBA73]/10 transition-all">
                      <div className="flex justify-between items-center border-b border-border/40 pb-2">
                        <h4 className="font-bold text-foreground uppercase tracking-wider text-sm text-[#DFBA73]">
                          {section.title}
                        </h4>
                        
                        {editingSectionId !== section.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditSection(section)}
                            className="gap-1.5 h-8 border-[#DFBA73]/30 text-[#DFBA73] hover:bg-[#DFBA73]/5"
                          >
                            <Edit className="w-3.5 h-3.5" /> Edit Description
                          </Button>
                        )}
                      </div>

                      {editingSectionId === section.id ? (
                        <div className="space-y-3 pt-2">
                          <textarea
                            value={editSectionDesc}
                            onChange={(e) => setEditSectionDesc(e.target.value)}
                            className="w-full p-3 rounded-md border border-border bg-white text-sm focus:outline-none focus:border-[#DFBA73] min-h-[80px]"
                            required
                          />
                          <div className="flex justify-end gap-3">
                            <Button size="sm" variant="outline" onClick={() => setEditingSectionId(null)} className="h-8">
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSaveSectionEdit(section.id)}
                              disabled={isLoading}
                              className="h-8 bg-[#DFBA73] hover:bg-[#c9a45e] text-white gap-1"
                            >
                              <Save className="w-3.5 h-3.5" /> Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          {section.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ──────── TAB 3: ROSTER TEAM ──────── */}
            {activeTab === "team" && (
              <div className="space-y-10">
                {/* Form to Add/Edit Roster Member */}
                <div className="bg-white border border-[#DFBA73]/20 p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#DFBA73]" />
                      <h3 className="font-semibold text-lg text-foreground uppercase tracking-wider">
                        {editingMemberId !== null ? "Edit Team Member" : "Add Team Member"}
                      </h3>
                    </div>
                    {editingMemberId !== null && (
                      <Button variant="ghost" size="sm" onClick={clearMemberForm} className="h-8 text-muted-foreground">
                        Cancel Edit
                      </Button>
                    )}
                  </div>

                  <form onSubmit={handleSaveMember} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label htmlFor="m-type" className="text-xs uppercase font-medium text-muted-foreground">List / Category</label>
                        <select
                          id="m-type"
                          value={memberType}
                          onChange={(e) => setMemberType(e.target.value as any)}
                          disabled={editingMemberId !== null}
                          className="w-full h-10 px-3 rounded-md border border-border bg-white text-sm focus:outline-none focus:border-[#DFBA73] disabled:opacity-50"
                        >
                          <option value="members">General Members (Alumni & Students)</option>
                          <option value="faculty">Faculty Advisor</option>
                          <option value="founding">Founding Team</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="m-name" className="text-xs uppercase font-medium text-muted-foreground">Full Name</label>
                        <Input
                          id="m-name"
                          placeholder="e.g. Dwaipayan Dhar"
                          value={mName}
                          onChange={(e) => setMName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="m-role" className="text-xs uppercase font-medium text-muted-foreground">Role / Designation</label>
                        <Input
                          id="m-role"
                          placeholder="e.g. Ex-Managing Director"
                          value={mRole}
                          onChange={(e) => setMRole(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="m-team" className="text-xs uppercase font-medium text-muted-foreground">Sub-Team / Department</label>
                        <Input
                          id="m-team"
                          placeholder="e.g. Aerodynamics Team, Ex-Management, Directors"
                          value={mTeam}
                          onChange={(e) => setMTeam(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label htmlFor="m-year" className="text-xs uppercase font-medium text-muted-foreground">Year / Batch</label>
                            <Input
                              id="m-year"
                              placeholder="e.g. 2026"
                              value={mYear}
                              onChange={(e) => setMYear(e.target.value)}
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label htmlFor="m-img" className="text-xs uppercase font-medium text-muted-foreground">Photo Path</label>
                            <Input
                              id="m-img"
                              placeholder="/images/team/name.webp"
                              value={mImage}
                              onChange={(e) => setMImage(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label htmlFor="m-email" className="text-xs uppercase font-medium text-muted-foreground">Email</label>
                            <Input
                              id="m-email"
                              placeholder="name@pccoepune.org"
                              value={mEmail}
                              onChange={(e) => setMEmail(e.target.value)}
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label htmlFor="m-link" className="text-xs uppercase font-medium text-muted-foreground">LinkedIn</label>
                            <Input
                              id="m-link"
                              placeholder="https://linkedin.com/in/..."
                              value={mLinkedin}
                              onChange={(e) => setMLinkedin(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                          <input
                            type="checkbox"
                            id="m-active"
                            checked={mActive}
                            onChange={(e) => setMActive(e.target.checked)}
                            className="rounded border-border text-[#DFBA73] focus:ring-[#DFBA73]"
                          />
                          <label htmlFor="m-active" className="text-xs uppercase font-medium text-muted-foreground">
                            Active Status (visible on page)
                          </label>
                        </div>
                      </div>

                      <Button type="submit" disabled={isLoading} className="w-full bg-[#DFBA73] hover:bg-[#c9a45e] text-white">
                        {isLoading ? "Saving Details..." : editingMemberId !== null ? "Update Team Member" : "Add to Roster"}
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Team roster lists preview */}
                <div className="space-y-6">
                  <h3 className="font-semibold text-lg text-foreground uppercase tracking-wider border-b border-border pb-2">
                    Current Team Directory
                  </h3>

                  {(["faculty", "founding", "members"] as const).map((type) => (
                    <div key={type} className="space-y-3">
                      <h4 className="font-bold text-xs uppercase text-[#DFBA73] tracking-widest pl-2">
                        {type === "faculty" ? "Faculty Advisor List" : type === "founding" ? "Founding Board List" : "Members Directory"} ({roster[type]?.length || 0})
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-1">
                        {roster[type]?.length > 0 ? (
                          roster[type].map((member) => (
                            <div key={member.id} className="bg-white border border-border rounded-xl p-4 flex justify-between items-center hover:border-[#DFBA73]/10 shadow-sm transition-all">
                              <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border/80">
                                  <Image src={member.image || "/images/logo.png"} alt={member.name} fill className="object-cover object-top" />
                                </div>
                                <div>
                                  <h5 className="font-bold text-xs text-foreground">{member.name}</h5>
                                  <p className="text-[10px] text-muted-foreground font-medium">{member.role} {member.year && `• Batch ${member.year}`}</p>
                                  <p className="text-[9px] text-[#DFBA73] uppercase tracking-wider font-semibold">{member.team}</p>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => startEditMember(member, type)} className="text-foreground hover:bg-[#DFBA73]/10 h-8 w-8">
                                  <Edit className="w-3.5 h-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteMember(member.id, type)} className="text-destructive hover:bg-destructive/10 h-8 w-8">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full py-6 text-center text-xs text-muted-foreground uppercase border border-dashed rounded-lg">
                            No member entries found under this section.
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* ──────── TAB 4: GALLERY GRID ──────── */}
            {activeTab === "gallery" && (
              <div className="space-y-10">
                {/* Form to Add Photo */}
                <div className="bg-white border border-[#DFBA73]/20 p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <ImageIcon className="w-5 h-5 text-[#DFBA73]" />
                    <h3 className="font-semibold text-lg text-foreground uppercase tracking-wider">
                      Register Photo in Catalog
                    </h3>
                  </div>

                  <form onSubmit={handleAddPhoto} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label htmlFor="g-year" className="text-xs uppercase font-medium text-muted-foreground">Year / Season</label>
                        <select
                          id="g-year"
                          value={gYear}
                          onChange={(e) => setGYear(e.target.value)}
                          className="w-full h-10 px-3 rounded-md border border-border bg-white text-sm focus:outline-none focus:border-[#DFBA73]"
                        >
                          {["2026", "2025", "2024", "2023", "2022", "2021"].map((y) => (
                            <option key={y} value={y}>{y} Season</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="g-src" className="text-xs uppercase font-medium text-muted-foreground">Image Path / URL</label>
                        <Input
                          id="g-src"
                          placeholder="e.g. /images/gallery/2026/image_15.webp"
                          value={gSrc}
                          onChange={(e) => setGSrc(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-4 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <label htmlFor="g-alt" className="text-xs uppercase font-medium text-muted-foreground">Alt Text / Caption</label>
                        <Input
                          id="g-alt"
                          placeholder="e.g. PCCOE Shourya Takeoff Flight Test"
                          value={gAlt}
                          onChange={(e) => setGAlt(e.target.value)}
                        />
                      </div>

                      <Button type="submit" disabled={isLoading} className="w-full bg-[#DFBA73] hover:bg-[#c9a45e] text-white">
                        {isLoading ? "Publishing Photo..." : "Register Photo"}
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Catalog lists grouped by year */}
                <div className="space-y-6">
                  <h3 className="font-semibold text-lg text-foreground uppercase tracking-wider border-b border-border pb-2">
                    Active Gallery Catalog
                  </h3>

                  {Object.keys(gallery).sort((a,b)=>Number(b)-Number(a)).map((year) => (
                    <div key={year} className="space-y-3">
                      <h4 className="font-bold text-xs uppercase text-[#DFBA73] tracking-widest pl-2">
                        {year} Season Catalog ({gallery[year].length})
                      </h4>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-[250px] overflow-y-auto pr-1">
                        {gallery[year].map((img) => (
                          <div key={img.id} className="group relative aspect-video bg-muted border border-border rounded-lg overflow-hidden shadow-sm">
                            <Image src={img.src} alt={img.alt} fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeletePhoto(img.id, year)}
                                className="text-white hover:bg-destructive hover:text-white h-8 w-8"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
