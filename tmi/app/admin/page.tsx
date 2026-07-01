"use client";

import { useState, useEffect, useRef } from "react";
import { Trash2, Plus, LogIn, LogOut, ShieldAlert, Edit, Save, X, Layout, Users, Image as ImageIcon, Upload, Loader2, Award } from "lucide-react";
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

interface Sponsor {
  id: number;
  name: string;
  logo: string;
  link?: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
}

const categories = ["Workshops", "Technical Sessions", "Collaborative Events", "Outreach Programs"];

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "categories" | "team" | "gallery" | "sponsors">("posts");

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
  const [isUploadingMember, setIsUploadingMember] = useState(false);

  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [editingMemberType, setEditingMemberType] = useState<"faculty" | "founding" | "members">("members");

  // Gallery states
  const [gallery, setGallery] = useState<Record<string, GalleryImage[]>>({});
  const [gYear, setGYear] = useState("2026");
  const [gSrc, setGSrc] = useState("");
  const [gAlt, setGAlt] = useState("");
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // Sponsors states
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [sName, setSName] = useState("");
  const [sLink, setSLink] = useState("");
  const [sLogo, setSLogo] = useState("");
  const [sTier, setSTier] = useState<'platinum' | 'gold' | 'silver' | 'bronze'>("platinum");
  const [isUploadingSponsor, setIsUploadingSponsor] = useState(false);
  const [editingSponsorId, setEditingSponsorId] = useState<number | null>(null);

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

  // File input refs
  const memberFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);
  const sponsorFileRef = useRef<HTMLInputElement>(null);

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

  const fetchSponsors = async () => {
    try {
      const res = await fetch("/api/sponsors");
      if (res.ok) setSponsors(await res.json());
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
    fetchSponsors();
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

  /* ── FILE UPLOAD LOGIC ── */
  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        return data.url;
      } else {
        toast.error(data.error || "Upload failed");
        return null;
      }
    } catch (err) {
      toast.error("Upload error. Check file size/type.");
      return null;
    }
  };

  const handleMemberPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMember(true);
    const url = await uploadFile(file);
    setIsUploadingMember(false);

    if (url) {
      setMImage(url);
      toast.success("Photo uploaded successfully!");
    }
  };

  const handleGalleryPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingGallery(true);
    const url = await uploadFile(file);
    setIsUploadingGallery(false);

    if (url) {
      setGSrc(url);
      toast.success("Image cataloged successfully!");
    }
  };

  const handleSponsorLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingSponsor(true);
    const url = await uploadFile(file);
    setIsUploadingSponsor(false);

    if (url) {
      setSLogo(url);
      toast.success("Logo uploaded successfully!");
    }
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
    if (memberFileRef.current) memberFileRef.current.value = "";
  };

  /* ── GALLERY CRUD ── */
  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gYear || !gSrc) {
      toast.error("Year and Image are mandatory");
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
        if (galleryFileRef.current) galleryFileRef.current.value = "";
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

  /* ── SPONSORS CRUD ── */
  const handleSaveSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sName || !sLogo) {
      toast.error("Name and Logo Image are mandatory");
      return;
    }
    setIsLoading(true);
    const method = editingSponsorId !== null ? "PUT" : "POST";
    const payload = {
      id: editingSponsorId,
      name: sName,
      logo: sLogo,
      link: sLink,
      tier: sTier
    };

    try {
      const res = await fetch("/api/sponsors", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success(editingSponsorId !== null ? "Sponsor updated!" : "Sponsor added!");
        clearSponsorForm();
        fetchSponsors();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save sponsor");
      }
    } catch (e) { toast.error("Error saving sponsor details"); }
    finally { setIsLoading(false); }
  };

  const startEditSponsor = (sponsor: Sponsor) => {
    setEditingSponsorId(sponsor.id);
    setSName(sponsor.name);
    setSLink(sponsor.link || "");
    setSLogo(sponsor.logo);
    setSTier(sponsor.tier);
  };

  const handleDeleteSponsor = async (id: number) => {
    if (!confirm("Remove this sponsor from the catalog?")) return;
    try {
      const res = await fetch(`/api/sponsors?id=${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Sponsor removed"); fetchSponsors(); }
    } catch (e) { toast.error("Error deleting sponsor"); }
  };

  const clearSponsorForm = () => {
    setEditingSponsorId(null);
    setSName(""); setSLink(""); setSLogo(""); setSTier("platinum");
    if (sponsorFileRef.current) sponsorFileRef.current.value = "";
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
                { id: "gallery",    label: "Gallery Grid",   icon: ImageIcon },
                { id: "sponsors",   label: "Sponsors List",  icon: Award }
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
                        <h3 className="font-semibold text-lg text-foreground uppercase tracking-wider font-sans">
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
                          <label htmlFor="edit-title" className="text-xs uppercase font-medium text-muted-foreground font-sans">Title</label>
                          <Input
                            id="edit-title"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="border-border focus:border-[#DFBA73] bg-white font-sans text-xs"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="edit-cat" className="text-xs uppercase font-medium text-muted-foreground font-sans">Category</label>
                          <select
                            id="edit-cat"
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="w-full h-10 px-3 rounded-md border border-border bg-white text-xs font-sans focus:outline-none focus:border-[#DFBA73]"
                          >
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4 flex flex-col justify-between">
                        <div className="space-y-1.5 flex-grow flex flex-col">
                          <label htmlFor="edit-desc" className="text-xs uppercase font-medium text-muted-foreground font-sans">Description</label>
                          <textarea
                            id="edit-desc"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="w-full p-3 flex-grow rounded-md border border-border bg-white text-xs font-sans focus:outline-none focus:border-[#DFBA73] min-h-[100px]"
                            required
                          />
                        </div>

                        <div className="flex gap-4">
                          <Button type="button" variant="outline" onClick={() => setEditingPostId(null)} className="flex-1 font-sans text-xs">
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isLoading} className="flex-grow bg-[#DFBA73] hover:bg-[#c9a45e] text-white font-sans text-xs">
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
                      <h3 className="font-semibold text-lg text-foreground uppercase tracking-wider font-sans">
                        Publish New Forum Announcement
                      </h3>
                    </div>

                    <form onSubmit={handleAddPost} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label htmlFor="adm-title" className="text-xs uppercase font-medium text-muted-foreground font-sans">Title</label>
                          <Input
                            id="adm-title"
                            placeholder="e.g. Aerodynamics Design Bootcamp"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="border-border focus:border-[#DFBA73] font-sans text-xs"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="adm-cat" className="text-xs uppercase font-medium text-muted-foreground font-sans">Category</label>
                          <select
                            id="adm-cat"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="w-full h-10 px-3 rounded-md border border-border bg-white text-xs font-sans focus:outline-none focus:border-[#DFBA73]"
                          >
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4 flex flex-col justify-between">
                        <div className="space-y-1.5 flex-grow flex flex-col">
                          <label htmlFor="adm-desc" className="text-xs uppercase font-medium text-muted-foreground font-sans">Description</label>
                          <textarea
                            id="adm-desc"
                            placeholder="Enter session or outreach event details..."
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            className="w-full p-3 flex-grow rounded-md border border-border bg-white text-xs font-sans focus:outline-none focus:border-[#DFBA73] min-h-[100px]"
                            required
                          />
                        </div>

                        <Button type="submit" disabled={isLoading} className="w-full bg-[#DFBA73] hover:bg-[#c9a45e] text-white font-sans text-xs">
                          {isLoading ? "Publishing..." : "Publish Announcement"}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {/* List of Existing Posts */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-foreground uppercase tracking-wider border-b border-border pb-2 font-sans">
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
                              <span className="text-[10px] text-muted-foreground font-sans">
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
                      <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground text-xs uppercase tracking-wider font-sans">
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
                    <h3 className="font-semibold text-lg text-foreground uppercase tracking-wider font-sans">
                      Edit Forum Category Descriptions
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                    Update the description text that appears under the main Workshop, Technical Sessions, Collaborative, and Outreach cards on the public page.
                  </p>
                </div>

                <div className="space-y-4">
                  {sections.map((section) => (
                    <div key={section.id} className="bg-white border border-border rounded-xl p-6 space-y-4 shadow-sm hover:border-[#DFBA73]/10 transition-all">
                      <div className="flex justify-between items-center border-b border-border/40 pb-2">
                        <h4 className="font-bold text-foreground uppercase tracking-wider text-xs text-[#DFBA73] font-sans">
                          {section.title}
                        </h4>
                        
                        {editingSectionId !== section.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditSection(section)}
                            className="gap-1.5 h-8 border-[#DFBA73]/30 text-[#DFBA73] hover:bg-[#DFBA73]/5 font-sans text-xs"
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
                            className="w-full p-3 rounded-md border border-border bg-white text-xs font-sans focus:outline-none focus:border-[#DFBA73] min-h-[80px]"
                            required
                          />
                          <div className="flex justify-end gap-3">
                            <Button size="sm" variant="outline" onClick={() => setEditingSectionId(null)} className="h-8 font-sans text-xs">
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSaveSectionEdit(section.id)}
                              disabled={isLoading}
                              className="h-8 bg-[#DFBA73] hover:bg-[#c9a45e] text-white gap-1 font-sans text-xs"
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
                      <h3 className="font-semibold text-lg text-foreground uppercase tracking-wider font-sans">
                        {editingMemberId !== null ? "Edit Team Member" : "Add Team Member"}
                      </h3>
                    </div>
                    {editingMemberId !== null && (
                      <Button variant="ghost" size="sm" onClick={clearMemberForm} className="h-8 text-muted-foreground font-sans text-xs">
                        Cancel Edit
                      </Button>
                    )}
                  </div>

                  <form onSubmit={handleSaveMember} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label htmlFor="m-type" className="text-xs uppercase font-medium text-muted-foreground font-sans">List / Category</label>
                        <select
                          id="m-type"
                          value={memberType}
                          onChange={(e) => setMemberType(e.target.value as any)}
                          disabled={editingMemberId !== null}
                          className="w-full h-10 px-3 rounded-md border border-border bg-white text-xs font-sans focus:outline-none focus:border-[#DFBA73] disabled:opacity-50"
                        >
                          <option value="members">General Members (Alumni & Students)</option>
                          <option value="faculty">Faculty Advisor</option>
                          <option value="founding">Founding Team</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="m-name" className="text-xs uppercase font-medium text-muted-foreground font-sans">Full Name</label>
                        <Input
                          id="m-name"
                          placeholder="e.g. Dwaipayan Dhar"
                          value={mName}
                          onChange={(e) => setMName(e.target.value)}
                          className="font-sans text-xs"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="m-role" className="text-xs uppercase font-medium text-muted-foreground font-sans">Role / Designation</label>
                        <Input
                          id="m-role"
                          placeholder="e.g. Ex-Managing Director"
                          value={mRole}
                          onChange={(e) => setMRole(e.target.value)}
                          className="font-sans text-xs"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="m-team" className="text-xs uppercase font-medium text-muted-foreground font-sans">Sub-Team / Department</label>
                        <Input
                          id="m-team"
                          placeholder="e.g. Aerodynamics Team, Ex-Management, Directors"
                          value={mTeam}
                          onChange={(e) => setMTeam(e.target.value)}
                          className="font-sans text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label htmlFor="m-year" className="text-xs uppercase font-medium text-muted-foreground font-sans">Year / Batch</label>
                            <Input
                              id="m-year"
                              placeholder="e.g. 2026"
                              value={mYear}
                              onChange={(e) => setMYear(e.target.value)}
                              className="font-sans text-xs"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs uppercase font-medium text-muted-foreground font-sans">Upload Photo</label>
                            <input
                              type="file"
                              accept="image/*"
                              ref={memberFileRef}
                              onChange={handleMemberPhotoUpload}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => memberFileRef.current?.click()}
                              disabled={isUploadingMember}
                              className="w-full h-10 border-[#DFBA73]/30 text-[#DFBA73] hover:bg-[#DFBA73]/5 gap-1.5 font-sans text-xs"
                            >
                              {isUploadingMember ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="w-3.5 h-3.5" /> Choose Image File
                                </>
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Image Preview Thumbnail */}
                        {mImage && (
                          <div className="flex items-center gap-3 bg-muted/40 p-2 rounded-lg border border-border">
                            <div className="relative w-12 h-12 rounded-md overflow-hidden border border-border bg-white flex-shrink-0">
                              <Image src={mImage} alt="Member preview" fill className="object-cover object-top" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider font-sans">Photo Preview</p>
                              <p className="text-[10px] text-foreground truncate font-sans">{mImage}</p>
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => setMImage("")} className="h-7 w-7 text-destructive hover:bg-destructive/10 ml-auto">
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label htmlFor="m-email" className="text-xs uppercase font-medium text-muted-foreground font-sans">Email</label>
                            <Input
                              id="m-email"
                              placeholder="name@pccoepune.org"
                              value={mEmail}
                              onChange={(e) => setMEmail(e.target.value)}
                              className="font-sans text-xs"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label htmlFor="m-link" className="text-xs uppercase font-medium text-muted-foreground font-sans">LinkedIn</label>
                            <Input
                              id="m-link"
                              placeholder="https://linkedin.com/in/..."
                              value={mLinkedin}
                              onChange={(e) => setMLinkedin(e.target.value)}
                              className="font-sans text-xs"
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
                          <label htmlFor="m-active" className="text-xs uppercase font-medium text-muted-foreground font-sans">
                            Active Status (visible on page)
                          </label>
                        </div>
                      </div>

                      <Button type="submit" disabled={isLoading || isUploadingMember} className="w-full bg-[#DFBA73] hover:bg-[#c9a45e] text-white font-sans text-xs">
                        {isLoading ? "Saving Details..." : editingMemberId !== null ? "Update Team Member" : "Add to Roster"}
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Team roster lists preview */}
                <div className="space-y-6">
                  <h3 className="font-semibold text-lg text-foreground uppercase tracking-wider border-b border-border pb-2 font-sans">
                    Current Team Directory
                  </h3>

                  {(["faculty", "founding", "members"] as const).map((type) => (
                    <div key={type} className="space-y-3">
                      <h4 className="font-bold text-xs uppercase text-[#DFBA73] tracking-widest pl-2 font-sans">
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
                                  <h5 className="font-bold text-xs text-foreground font-sans">{member.name}</h5>
                                  <p className="text-[10px] text-muted-foreground font-medium font-sans">{member.role} {member.year && `• Batch ${member.year}`}</p>
                                  <p className="text-[9px] text-[#DFBA73] uppercase tracking-wider font-semibold font-sans">{member.team}</p>
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
                          <div className="col-span-full py-6 text-center text-xs text-muted-foreground uppercase border border-dashed rounded-lg font-sans">
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
                    <h3 className="font-semibold text-lg text-foreground uppercase tracking-wider font-sans">
                      Register Photo in Catalog
                    </h3>
                  </div>

                  <form onSubmit={handleAddPhoto} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label htmlFor="g-year" className="text-xs uppercase font-medium text-muted-foreground font-sans">Year / Season</label>
                        <select
                          id="g-year"
                          value={gYear}
                          onChange={(e) => setGYear(e.target.value)}
                          className="w-full h-10 px-3 rounded-md border border-border bg-white text-xs font-sans focus:outline-none focus:border-[#DFBA73]"
                        >
                          {["2026", "2025", "2024", "2023", "2022", "2021"].map((y) => (
                            <option key={y} value={y}>{y} Season</option>
                          ))}
                        </select>
                      </div>

                      {/* Interactive File Upload Option */}
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase font-medium text-muted-foreground font-sans">Upload Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          ref={galleryFileRef}
                          onChange={handleGalleryPhotoUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => galleryFileRef.current?.click()}
                          disabled={isUploadingGallery}
                          className="w-full h-10 border-[#DFBA73]/30 text-[#DFBA73] hover:bg-[#DFBA73]/5 gap-1.5 font-sans text-xs"
                        >
                          {isUploadingGallery ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5" /> Choose Image File
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <label htmlFor="g-alt" className="text-xs uppercase font-medium text-muted-foreground font-sans">Alt Text / Caption</label>
                        <Input
                          id="g-alt"
                          placeholder="e.g. PCCOE Shourya Takeoff Flight Test"
                          value={gAlt}
                          onChange={(e) => setGAlt(e.target.value)}
                          className="font-sans text-xs"
                        />
                      </div>

                      {/* Image Preview Thumbnail */}
                      {gSrc && (
                        <div className="flex items-center gap-3 bg-muted/40 p-2 rounded-lg border border-border">
                          <div className="relative w-16 aspect-video rounded-md overflow-hidden border border-border bg-white flex-shrink-0">
                            <Image src={gSrc} alt="Gallery preview" fill className="object-cover" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider font-sans">Image Preview</p>
                            <p className="text-[10px] text-foreground truncate font-sans">{gSrc}</p>
                          </div>
                          <Button type="button" variant="ghost" size="icon" onClick={() => setGSrc("")} className="h-7 w-7 text-destructive hover:bg-destructive/10 ml-auto">
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      )}

                      <Button type="submit" disabled={isLoading || isUploadingGallery} className="w-full bg-[#DFBA73] hover:bg-[#c9a45e] text-white font-sans text-xs">
                        {isLoading ? "Publishing Photo..." : "Register Photo"}
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Catalog lists grouped by year */}
                <div className="space-y-6">
                  <h3 className="font-semibold text-lg text-foreground uppercase tracking-wider border-b border-border pb-2 font-sans">
                    Active Gallery Catalog
                  </h3>

                  {Object.keys(gallery).sort((a,b)=>Number(b)-Number(a)).map((year) => (
                    <div key={year} className="space-y-3">
                      <h4 className="font-bold text-xs uppercase text-[#DFBA73] tracking-widest pl-2 font-sans">
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

            {/* ──────── TAB 5: SPONSORS ──────── */}
            {activeTab === "sponsors" && (
              <div className="space-y-10">
                {/* Form to Add/Edit Sponsor */}
                <div className="bg-white border border-[#DFBA73]/20 p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#DFBA73]" />
                      <h3 className="font-semibold text-lg text-foreground uppercase tracking-wider font-sans">
                        {editingSponsorId !== null ? "Edit Sponsor" : "Add Sponsor"}
                      </h3>
                    </div>
                    {editingSponsorId !== null && (
                      <Button variant="ghost" size="sm" onClick={clearSponsorForm} className="h-8 text-muted-foreground font-sans text-xs">
                        Cancel Edit
                      </Button>
                    )}
                  </div>

                  <form onSubmit={handleSaveSponsor} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label htmlFor="s-name" className="text-xs uppercase font-medium text-muted-foreground font-sans">Sponsor Name</label>
                        <Input
                          id="s-name"
                          placeholder="e.g. Dassault Systemes"
                          value={sName}
                          onChange={(e) => setSName(e.target.value)}
                          className="font-sans text-xs"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="s-tier" className="text-xs uppercase font-medium text-muted-foreground font-sans">Sponsorship Tier</label>
                        <select
                          id="s-tier"
                          value={sTier}
                          onChange={(e) => setSTier(e.target.value as any)}
                          className="w-full h-10 px-3 rounded-md border border-border bg-white text-xs font-sans focus:outline-none focus:border-[#DFBA73]"
                        >
                          <option value="platinum">Platinum Tier (displays as TITLE SPONSOR)</option>
                          <option value="gold">Gold Tier (displays as PLATINUM SPONSOR)</option>
                          <option value="silver">Silver Tier (displays as GOLD SPONSOR)</option>
                          <option value="bronze">Bronze Tier (displays as SILVER SPONSOR)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="s-link" className="text-xs uppercase font-medium text-muted-foreground font-sans">Sponsor Website Link</label>
                        <Input
                          id="s-link"
                          placeholder="e.g. https://www.3ds.com/"
                          value={sLink}
                          onChange={(e) => setSLink(e.target.value)}
                          className="font-sans text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs uppercase font-medium text-muted-foreground font-sans">Upload Logo Image</label>
                          <input
                            type="file"
                            accept="image/*"
                            ref={sponsorFileRef}
                            onChange={handleSponsorLogoUpload}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => sponsorFileRef.current?.click()}
                            disabled={isUploadingSponsor}
                            className="w-full h-10 border-[#DFBA73]/30 text-[#DFBA73] hover:bg-[#DFBA73]/5 gap-1.5 font-sans text-xs"
                          >
                            {isUploadingSponsor ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading Logo...
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5" /> Choose Logo File
                              </>
                            )}
                          </Button>
                        </div>

                        {/* Image Preview Thumbnail */}
                        {sLogo && (
                          <div className="flex items-center gap-3 bg-muted/40 p-2 rounded-lg border border-border">
                            <div className="relative w-16 h-12 rounded-md overflow-hidden border border-border bg-white flex-shrink-0 p-1 flex items-center justify-center">
                              <Image src={sLogo} alt="Sponsor logo preview" fill className="object-contain" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider font-sans">Logo Preview</p>
                              <p className="text-[10px] text-foreground truncate font-sans">{sLogo}</p>
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => setSLogo("")} className="h-7 w-7 text-destructive hover:bg-destructive/10 ml-auto">
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>

                      <Button type="submit" disabled={isLoading || isUploadingSponsor} className="w-full bg-[#DFBA73] hover:bg-[#c9a45e] text-white font-sans text-xs">
                        {isLoading ? "Saving Sponsor..." : editingSponsorId !== null ? "Update Sponsor" : "Register Sponsor"}
                      </Button>
                    </div>
                  </form>
                </div>

                {/* List of current Sponsors grouped by tier */}
                <div className="space-y-6">
                  <h3 className="font-semibold text-lg text-foreground uppercase tracking-wider border-b border-border pb-2 font-sans">
                    Sponsor Directory Directory
                  </h3>

                  {(['platinum', 'gold', 'silver', 'bronze'] as const).map((tier) => {
                    const tierSponsors = sponsors.filter(s => s.tier === tier);
                    return (
                      <div key={tier} className="space-y-3">
                        <h4 className="font-bold text-xs uppercase text-[#DFBA73] tracking-widest pl-2 font-sans">
                          {tier === 'platinum' ? "Platinum (Title Sponsors)" : tier === 'gold' ? "Gold (Platinum Sponsors)" : tier === 'silver' ? "Silver (Gold Sponsors)" : "Bronze (Silver Sponsors)"} ({tierSponsors.length})
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-1">
                          {tierSponsors.length > 0 ? (
                            tierSponsors.map((sponsor) => (
                              <div key={sponsor.id} className="bg-white border border-border rounded-xl p-4 flex justify-between items-center hover:border-[#DFBA73]/10 shadow-sm transition-all">
                                <div className="flex items-center gap-3">
                                  <div className="relative w-12 h-10 rounded border border-border bg-muted/20 p-1 flex items-center justify-center overflow-hidden">
                                    <Image src={sponsor.logo} alt={sponsor.name} fill className="object-contain p-1" />
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-xs text-foreground font-sans">{sponsor.name}</h5>
                                    {sponsor.link && (
                                      <a href={sponsor.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 hover:underline truncate max-w-[200px] block font-sans">
                                        {sponsor.link}
                                      </a>
                                    )}
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <Button variant="ghost" size="icon" onClick={() => startEditSponsor(sponsor)} className="text-foreground hover:bg-[#DFBA73]/10 h-8 w-8">
                                    <Edit className="w-3.5 h-3.5" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => handleDeleteSponsor(sponsor.id)} className="text-destructive hover:bg-destructive/10 h-8 w-8">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-full py-6 text-center text-xs text-muted-foreground uppercase border border-dashed rounded-lg font-sans">
                              No sponsor entries listed in this tier.
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
