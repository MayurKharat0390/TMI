"use client";

import { useState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Youtube, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Image from "next/image";

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

  const isActive = (path: string) => pathname === path;

  const socialLinks = [
    { href: "https://www.linkedin.com/company/team-maverick-pccoe/", icon: Linkedin },
    { href: "https://instagram.com/teammaverick_india", icon: Instagram },
    { href: "https://youtube.com/@teammaverickindia", icon: Youtube },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-[75px] h-[75px]">
              <Image src="/images/nav_logo.png" alt="Team Maverick Logo" fill loading="lazy" decoding="async" className="object-contain" />
            </div>

          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative px-3 py-2 transition-colors hover:text-[#D4A348]",
                  isActive(href) ? "text-[#D4A348]" : "text-foreground"
                )}
              >
                {label}
                {isActive(href) && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#D4A348]" />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-2">
              {socialLinks.map(({ href, icon: Icon }) => (
                <Button key={href} variant="ghost" size="icon" className="hover:text-[#D4A348]" asChild>
                  <Link href={href} target="_blank" rel="noopener noreferrer">
                    <Icon className="h-5 w-5" />
                  </Link>
                </Button>
              ))}
            </div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  {navLinks.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className={cn("text-lg", isActive(href) ? "text-[#D4A348]" : "text-foreground")}
                      onClick={() => setIsOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                  <div className="flex space-x-4 mt-4">
                    {socialLinks.map(({ href, icon: Icon }) => (
                      <Button key={href} variant="ghost" size="icon" className="hover:text-[#D4A348]" asChild>
                        <Link href={href} target="_blank" rel="noopener noreferrer">
                          <Icon className="h-5 w-5" />
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}