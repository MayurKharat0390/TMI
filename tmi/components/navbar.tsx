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
      "fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 bg-background/60 dark:bg-black/55 backdrop-blur-md border border-border dark:border-[#D4A348]/20 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-300 h-16 flex items-center px-4 sm:px-6",
      scrolled ? "top-2 bg-background/85 dark:bg-black/85 dark:border-[#D4A348]/40 shadow-[0_4px_30px_rgba(0,0,0,0.6)]" : ""
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
                "relative px-4 py-1.5 text-xs font-mono font-semibold uppercase tracking-widest transition-colors duration-300",
                isActive(href) ? "text-[#D4A348]" : "text-foreground/80 hover:text-[#D4A348]"
              )}
            >
              {label}
              {isActive(href) && (
                <motion.span
                  layoutId="activeNav"
                  className="absolute inset-0 bg-[#D4A348]/10 border border-[#D4A348]/30 rounded-full -z-10 shadow-[0_0_10px_rgba(212,163,72,0.15)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex items-center space-x-2">
            {socialLinks.map(({ href, icon: Icon }) => (
              <Button key={href} variant="ghost" size="icon" className="hover:text-[#D4A348] rounded-full h-8 w-8" asChild>
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
                className="hover:text-[#D4A348] text-foreground rounded-full h-8 w-8"
                aria-label="Toggle Theme"
              >
                {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden rounded-full h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn("text-lg font-mono tracking-wider uppercase", isActive(href) ? "text-[#D4A348]" : "text-foreground")}
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
                <div className="flex space-x-4 mt-4">
                  {socialLinks.map(({ href, icon: Icon }) => (
                    <Button key={href} variant="ghost" size="icon" className="hover:text-[#D4A348] rounded-full" asChild>
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
                      className="hover:text-[#D4A348] text-foreground rounded-full"
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