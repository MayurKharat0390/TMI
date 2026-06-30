"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import "../app/flivan.css";

const navLinks = [
  { href: "/",         label: "Home"     },
  { href: "/planes",   label: "Planes"   },
  { href: "/team",     label: "Team"     },
  { href: "/gallery",  label: "Gallery"  },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/contact",  label: "Contact"  },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav>
      {/* Logo — same as Flivan's .nav__logo but with a small image beside the text */}
      <Link href="/" className="nav__logo" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", whiteSpace: "nowrap" }}>
        <img
          src="/images/nav_logo.png"
          alt="TMI"
          style={{ width: "32px", height: "32px", objectFit: "contain", display: "inline-block", flexShrink: 0 }}
        />
        Team Maverick India
      </Link>

      {/* Nav links — exact Flivan <ul class="nav__links"> */}
      <ul className="nav__links">
        {navLinks.map(({ href, label }) => (
          <li key={href} className="link">
            <Link
              href={href}
              style={pathname === href ? { color: "var(--primary-color)", fontWeight: 600 } : {}}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* CTA — exact Flivan <button class="btn"> */}
      <Link href="/contact" className="btn" style={{ whiteSpace: "nowrap" }}>
        Contact Us
      </Link>
    </nav>
  );
}
