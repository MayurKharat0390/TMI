import Link from 'next/link';
import { Linkedin, Instagram, Youtube, Mail, MapPin } from 'lucide-react';

const socialLinks = [
  { href: 'https://linkedin.com/company/team-maverick-india', icon: Linkedin },
  { href: 'https://instagram.com/teammaverickindia', icon: Instagram },
  { href: 'https://youtube.com/teammaverickindia', icon: Youtube },
];

export function Footer() {
  return (
    <footer className="bg-background/80 backdrop-blur-sm border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              About Us
            </h3>
            <p className="text-muted-foreground">
              Team Maverick India is dedicated to pushing the boundaries of aviation
              excellence through innovation, dedication, and teamwork.
            </p>
          </div>

          <div>

          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Connect Us</h3>
            <ul className="space-y-3">
              <li className="text-muted-foreground flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#D4A348]" />
                Email:
                <a href="mailto:teammaverickindia@pccoepune.org" className="hover:text-[#D4A348]">
                  teammaverickindia@pccoepune.org
                </a>
              </li>
              <li className="text-muted-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#D4A348]" />
                Location: PCCoE, Pune, India 411044
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground mb-4 sm:mb-0">
            © {new Date().getFullYear()} Team Maverick India. All rights reserved.
          </p>
          <div className="flex space-x-4">
            {socialLinks.map(({ href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#D4A348]"
              >
                <Icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}