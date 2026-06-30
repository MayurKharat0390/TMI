import Link from "next/link";
import "../app/flivan.css";

export function Footer() {
  return (
    /* exact Flivan <footer class="footer"> */
    <footer className="footer">
      <div className="section__container footer__container">

        <div className="footer__col">
          <h3>Team Maverick India</h3>
          <p>
            Where Excellence Takes Flight. With a strong commitment to engineering
            and a passion for autonomous systems, Team Maverick India builds
            competition-grade UAVs that solve real-world problems.
          </p>
          <p>
            From Pune to Los Angeles, we connect the world of aerospace
            engineering — ensuring innovative, safe, and high-performance flights.
          </p>
        </div>

        <div className="footer__col">
          <h4>INFORMATION</h4>
          <Link href="/"><p>Home</p></Link>
          <Link href="/planes"><p>Planes</p></Link>
          <Link href="/team"><p>Team</p></Link>
          <Link href="/gallery"><p>Gallery</p></Link>
          <Link href="/sponsors"><p>Sponsors</p></Link>
        </div>

        <div className="footer__col">
          <h4>CONTACT</h4>
          <p>teammaverickindia@pccoepune.org</p>
          <p>PCCoE, Pune — 411044</p>
          <Link href="/support_us"><p>Support Us</p></Link>
          <Link href="/contact"><p>Contact</p></Link>
        </div>

      </div>

      <div className="section__container footer__bar">
        <p>Copyright © {new Date().getFullYear()} Team Maverick India. All rights reserved.</p>
        <div className="socials">
          <a href="https://linkedin.com/company/team-maverick-india" target="_blank" rel="noopener noreferrer">
            <span><i className="ri-linkedin-fill" /></span>
          </a>
          <a href="https://instagram.com/teammaverickindia" target="_blank" rel="noopener noreferrer">
            <span><i className="ri-instagram-line" /></span>
          </a>
          <a href="https://youtube.com/@teammaverickindia" target="_blank" rel="noopener noreferrer">
            <span><i className="ri-youtube-fill" /></span>
          </a>
        </div>
      </div>
    </footer>
  );
}
