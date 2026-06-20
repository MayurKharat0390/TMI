"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Youtube, Linkedin, Instagram, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/planes", label: "Planes" },
  { href: "/team", label: "Team" },
  { href: "/gallery", label: "Gallery" },
  { href: "/forum", label: "Forum" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/support_us", label: "Support Us" },
  { href: "/contact", label: "Contact" },
];


export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  const socialLinks = [
    { href: "https://www.linkedin.com/company/team-maverick-pccoe/", icon: Linkedin },
    { href: "https://instagram.com/teammaverick_india", icon: Instagram },
    { href: "https://youtube.com/@teammaverickindia", icon: Youtube },
  ];

  return (
    <nav className={cn(
      "fixed left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 rounded-full transition-all duration-300 h-16 flex items-center px-4 sm:px-6 backdrop-blur-md",
      scrolled 
        ? "top-2 bg-background/90 dark:bg-black/85 border border-border dark:border-[#DFBA73]/30 shadow-[0_4px_24px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.6)]" 
        : isHome
          ? "top-4 bg-black/25 dark:bg-black/40 border border-white/10 dark:border-[#DFBA73]/15 shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
          : "top-4 bg-background/70 dark:bg-black/40 border border-border dark:border-[#DFBA73]/15 shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
    )}>
      <div className="w-full flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative w-[50px] h-[50px]">
            <Image src="/images/nav_logo.png" alt="Team Maverick Logo" fill loading="lazy" decoding="async" className="object-contain animate-pulse-subtle" />
          </div>
        </Link>

        <div className="hidden lg:flex items-center space-x-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative px-4 py-1.5 text-[11px] font-sans font-medium uppercase tracking-[0.18em] transition-colors duration-300",
                isActive(href) 
                  ? "text-[#DFBA73]" 
                  : scrolled 
                    ? "text-foreground/80 hover:text-[#DFBA73]" 
                    : isHome 
                      ? "text-white/80 hover:text-[#DFBA73]" 
                      : "text-foreground/80 dark:text-white/80 hover:text-[#DFBA73]"
              )}
            >
              {label}
              {isActive(href) && (
                <motion.span
                  layoutId="activeNav"
                  className="absolute inset-0 bg-[#DFBA73]/8 border border-[#DFBA73]/20 rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex items-center space-x-2">
            {socialLinks.map(({ href, icon: Icon }) => (
              <Button 
                key={href} 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "rounded-full h-8 w-8 transition-colors",
                  scrolled 
                    ? "text-foreground hover:text-[#DFBA73] hover:bg-foreground/5" 
                    : isHome
                      ? "text-white hover:text-[#DFBA73] hover:bg-white/10"
                      : "text-foreground dark:text-white hover:text-[#DFBA73] hover:bg-foreground/5 dark:hover:bg-white/10"
                )}
                asChild
              >
                <Link href={href} target="_blank" rel="noopener noreferrer">
                  <Icon className="h-4 w-4" />
                </Link>
              </Button>
            ))}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className={cn(
                  "rounded-full h-8 w-8 transition-colors",
                  scrolled 
                    ? "text-foreground hover:text-[#DFBA73] hover:bg-foreground/5" 
                    : isHome
                      ? "text-white hover:text-[#DFBA73] hover:bg-white/10"
                      : "text-foreground dark:text-white hover:text-[#DFBA73] hover:bg-foreground/5 dark:hover:bg-white/10"
                )}
                aria-label="Toggle Theme"
              >
                {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "lg:hidden rounded-full h-9 w-9 transition-colors",
                  scrolled 
                    ? "text-foreground hover:bg-foreground/5" 
                    : isHome
                      ? "text-white hover:bg-white/10"
                      : "text-foreground dark:text-white hover:bg-foreground/5 dark:hover:bg-white/10"
                )}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn("text-base font-sans font-medium tracking-[0.12em] uppercase", isActive(href) ? "text-[#DFBA73]" : "text-foreground")}
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
                <div className="flex space-x-4 mt-4">
                  {socialLinks.map(({ href, icon: Icon }) => (
                    <Button key={href} variant="ghost" size="icon" className="hover:text-[#DFBA73] rounded-full" asChild>
                      <Link href={href} target="_blank" rel="noopener noreferrer">
                        <Icon className="h-5 w-5" />
                      </Link>
                    </Button>
                  ))}
                  {mounted && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setTheme(resolvedTheme === "dark" ? "light" : "dark");
                        setIsOpen(false);
                      }}
                      className="hover:text-[#DFBA73] text-foreground rounded-full"
                      aria-label="Toggle Theme"
                    >
                      {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
