"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { FileText, Calendar } from "lucide-react";

interface Post {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
}

const forumSections = [
  {
    title: "Workshops",
    description: "Hands-on learning experiences and skill-building sessions."
  },
  {
    title: "Technical Sessions",
    description: "Deep dives into aerospace engineering and UAV technology."
  },
  {
    title: "Collaborative Events",
    description: "Partnering with industry and academic leaders for innovation."
  },
  {
    title: "Outreach Programs",
    description: "Spreading awareness about aerospace and STEM to the community."
  }
];

export default function ForumSections() {
  const [posts, setPosts] = useState<Post[]>([]);

  // Fetch published announcements from API
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

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="space-y-20 max-w-5xl mx-auto">
      
      {/* 1. Original 4 Circular Activity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {forumSections.map((section, index) => {
          // Check if there are dynamic posts matching this category
          const categoryPosts = posts.filter(p => p.category === section.title);

          return (
            <div
              key={index}
              className={cn(
                "rounded-xl border border-border/80 bg-white p-8 transition-all duration-300 ease-in-out",
                "hover:scale-105 hover:border-[#DFBA73]/30 hover:shadow-lg hover:shadow-[#DFBA73]/5",
                "animate-in fade-in slide-in-from-bottom-4 duration-700",
              )}
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
            >
              <h3 className="text-xl font-bold uppercase tracking-widest text-[#DFBA73] mb-4">
                {section.title}
              </h3>
              
              {categoryPosts.length > 0 ? (
                /* Render actual dynamic announcements for this category */
                <div className="space-y-4 text-left">
                  {categoryPosts.map((post) => (
                    <div key={post.id} className="border-l-2 border-[#DFBA73]/40 pl-3 py-1 space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                        <span>{post.date}</span>
                      </div>
                      <h4 className="font-semibold text-sm text-foreground uppercase tracking-wide">
                        {post.title}
                      </h4>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {post.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                /* Fallback "Coming Soon" original display */
                <div className="space-y-4">
                  <p className="text-foreground font-semibold text-lg">Coming Soon</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {section.description} We will update this section with upcoming activities.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 2. Dynamic Announcements List (if any posts exist) */}
      {posts.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-[#DFBA73]" />
            <h3 className="font-bold text-xl uppercase tracking-wider text-foreground">
              Recent Announcements
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white border border-border rounded-xl p-5 hover:border-[#DFBA73]/20 transition-all shadow-sm flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="bg-[#DFBA73]/10 text-[#DFBA73] rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest">
                      {post.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                      {post.date}
                    </span>
                  </div>
                  <h4 className="font-bold text-foreground tracking-wide text-base uppercase">
                    {post.title}
                  </h4>
                  <p className="text-muted-foreground text-xs leading-relaxed text-justify">
                    {post.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
