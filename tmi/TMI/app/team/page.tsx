"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import StarryBackground from "@/components/StarryBackground";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Linkedin, Calendar } from "lucide-react";
import Head from 'next/head';

const teamMembers = [
  {
    "id": 1,
    "name": "Dwaipayan Dhar",
    "role": "Managing Director",
    "year": "2026",
    "image": "/images/team/dp.webp",
    "linkedin": "https://www.linkedin.com/in/dwaipayan-dhar-109783259/",
    "email": "dwaipayan.dhar22@pccoepune.org",
    "active": true,
    team: "Management Team" 
  },
  {
    "id": 2,
    "name": "Riddhi Sonkusare",
    "role": "Executive Director",
    "year": "2026",
    "image": "/images/team/riddhi.webp",
    "email": "riddhi.sonkusare22@pccoepune.org",
    "linkedin": "https://www.linkedin.com/in/riddhi-sonkusare-4b5671259/",
    "active": true,
    team: "Management Team"
  },
  {
    "id": 3,
    "name": "Maheshwar Dhone",
    "role": "Chief Flight Inspector",
    "year": "2026",
    "email": "maheshwar.dhone22@pccoepune.org",
    "image": "/images/team/maheshwar.webp",
    "active": true,
    team: "Management Team"
  },
  {
    "id": 4,
    "name": "Apoorva Chougule",
    "role": "Chief Technical Officer",
    "year": "2026",
    "image": "/images/team/apoorva.webp",
    "email": "apoorva.chougule22@pccoepune.org",
    "linkedin": "https://www.linkedin.com/in/apoorva-chougule-a37479259/",
    "active": true,
    team: "Management Team"
  },
  {
    "id": 5,
    "name": "Aditi Rade",
    "role": "Director of Design",
    "year": "2026",
    "image": "/images/team/aditi.webp",
    "email": "aditi.rade22@pccoepune.org",
    "linkedin": "https://www.linkedin.com/in/aditi-rade-924a14259/",
    "active": true,
    team: "Directors"
  },
  {
    "id": 6,
    "name": "Bhumika Shekawat",
    "role": "Director of Avionics",
    "year": "2026",
    "image": "/images/team/bhumika.webp",
    "email": "bhumika.shekawat22@pccoepune.org",
    "linkedin": "https://www.linkedin.com/in/bhumika-shekhawat-a2612225a/",
    "active": true,
    team: "Directors"
  },
  {
    "id": 7,
    "name": "Atharva Shitole",
    "role": "Director of Analysis",
    "year": "2026",
    "image": "/images/team/atharva.webp",
    "email": "atharva.shitole22@pccoepune.org",
    "linkedin": "https://linkedin.com/in/janesmith",
    "active": false,
    team: "Directors"
  },
  {
    "id": 8,
    "name": "Anjali Rade",
    "role": "HR Manager",
    "year": "2026",
    "image": "/images/team/anjali.webp",
    "email": "anjali.rade22@pccoepune.org",
    "linkedin": "https://www.linkedin.com/in/anjali-rade-9ab784259/",
    "active": true,
    team: "Management Team"
  },
  {
    "id": 9,
    "name": "Mrunal Sagare",
    "role": "Avionics Engineer",
    "year": "2026",
    "image": "/images/team/mrunal.webp",
    "email": "mrunal.sagare22@pccoepune.org",
    "linkedin": "https://www.linkedin.com/in/mrunal-sagare-b78672259/",
    "active": true,
    team: "Avionics Team"
  },
  {
    "id": 10,
    "name": "Aaditi Gurav",
    "role": "Design Engineer",
    "year": "2026",
    "image": "/images/team/aaditi.webp",
    "email": "aaditi.gurav2222@pccoepune.org",
    "linkedin": "https://www.linkedin.com/in/aaditi-gurav-b5147a259/",
    "active": false,
    team: "Design Team"
  },
  {
    "id": 11,
    "name": "Veena Waghmare",
    "role": "Design Engineer",
    "year": "2026",
    "image": "/images/team/veena.webp",
    "email": "apoorva.chougule22@pccoepune.org",
    "linkedin": "https://www.linkedin.com/in/veena-waghmare-46447a259/",
    "active": true,
    team: "Design Team"
  },
  {
    "id": 12,
    "name": "Sarvesh Patil",
    "role": "Avionics Engineer",
    "year": "2026",
    "image": "/images/team/sarvesh.webp",
    "email": "sarvesh.patil22@pccoepune.org",
    "linkedin": "https://www.linkedin.com/in/sarvesh-patil-/",
    "active": false,
    team: "Avionics Team"
  },
  {
    "id": 13,
    "name": "Krupa Rao",
    "role": "Avionics Engineer",
    "year": "2026",
    "image": "/images/team/krupa.webp",
    "email": "krupa.rao22@pccoepune.org",
    "linkedin": "https://www.linkedin.com/in/krupa-rao-215485259/",
    "active": false,
    team: "Avionics Team"
  },
  {
    "id": 14,
    "name": "Aayush Bodkhe",
    "role": "Autonomous Engineer",
    "year": "2026",
    "image": "/images/team/ayush.webp",
    "email": "aayush.bodkhe22@pccoepune.org",
    "linkedin": "https://www.linkedin.com/in/aayush-bodkhe/",
    "github": "https://github.com/aayushbodkhe/aayushbodkhe",
    "active": false,
    team: "Autonomous Team"
  },
  {
    "id": 15,
    "name": "Aditya Suryawanshi",
    "role": "Design Engineer",
    "year": "2026",
    "image": "/images/team/aditya.webp",
    "email": "aditya.suryawanshi22@pccoepune.org",
    "linkedin": "https://www.linkedin.com/in/adityas2004/",
    "active": false,
    team: "Design Team"
  },
  {
    "id": 16,
    "name": "Janhavi Ugalmugale",
    "role": "Avionics Engineer",
    "year": "2026",
    "image": "/images/team/janhavi.webp",
    "email": "janhavi.ugalmugale22@pccoepune.org",
    "linkedin": "https://www.linkedin.com/in/janhavi-ugalmugale-331479259/",
    "active": false,
    team: "Avionics Team"
  },
  {
    "id": 17,
    "name": "Ankur Fulzele",
    "role": "Content Creator",
    "year": "2026",
    "image": "/images/team/ankur.webp",
    "email": "ankur.fulzele22@pccoepune.org",
    "linkedin": "https://www.linkedin.com/in/ankur-fulzele/",
    "active": false,
    team: "Content Creation Team"
  },
  {
    "id": 18,
    "name": "Darshan Nair",
    "role": "Autonomous Engineer",
    "year": "2027",
    "image": "/images/team/darshan.webp",
    "linkedin": "https://www.linkedin.com/in/darshan-nair-1b60b228a/",
    "github": "https://github.com/Dash074",
    "active": true,
    team: "Autonomous Team"
  },
  {
    "id": 19,
    "name": "Mihik Shah",
    "role": "Autonomous Engineer",
    "year": "2027",
    "image": "/images/team/mihik.webp",
    "linkedin": "https://www.linkedin.com/in/mihik-shah-7633a1311/",
    "github": "https://github.com/Mihik30",
    "active": false,
    team: "Autonomous Team"
  },
  {
    "id": 20,
    "name": "Anshul Shelke",
    "role": "Design Engineer",
    "year": "2027",
    "image": "/images/team/anshul.webp",
    "linkedin": "https://www.linkedin.com/in/anshulshelke17/",
    "active": true,
    team: "Design Team"
  },
  {
    "id": 21,
    "name": "Mrudula Lele",
    "role": "Design Engineer",
    "year": "2027",
    "image": "/images/team/mrudula.webp",
    "linkedin": "https://www.linkedin.com/in/mrudula-lele-7b61b2318/",
    "active": true,
    team: "Design Team"
  },
  {
    "id": 22,
    "name": "Om kshirsagar",
    "role": "Design Engineer",
    "year": "2027",
    "image": "/images/team/om.webp",
    "linkedin": "https://www.linkedin.com/in/omkshirsagar627/",
    "active": false,
    team: "Design Team"
  },
  {
    "id": 23,
    "name": "Hemal Khairnar",
    "role": "Design Engineer",
    "year": "2027",
    "image": "/images/team/hemal.webp",
    "active": false,
    team: "Design Team"
  },
  {
    "id": 24,
    "name": "Mansi Kushwaha",
    "role": "Avionics Engineer",
    "year": "2027",
    "image": "/images/team/mansi.webp",
    "linkedin": "https://www.linkedin.com/in/mansi-kushwaha-6579ab292/",
    "active": true,
    team: "Avionics Team"
  },
  {
    "id": 25,
    "name": "Ishani Lohote",
    "role": "Avionics Engineer",
    "year": "2027",
    "image": "/images/team/ishani.webp",
    "linkedin": "https://www.linkedin.com/in/ishani-lohote-80a558292/",
    "active": true,
    team: "Avionics Team"
  },
  {
    "id": 26,
    "name": "Kshitij Jadhav",
    "role": "Structural Engineer",
    "year": "2027",
    "image": "/images/team/kshitij.webp",
    "linkedin": "https://www.linkedin.com/in/kshitij-jadhav1625/",
    "active": true,
    team: "Structural Team"
  },
  {
    "id": 27,
    "name": "Aryan Kakulte",
    "role": "Structural Engineer",
    "year": "2027",
    "image": "/images/team/aryan.webp",
    "linkedin": "https://www.linkedin.com/in/aryan-kakulte-700553292/",
    "active": true,
    team: "Structural Team"
  },
  {
    "id": 28,
    "name": "Vishalraju Laguduva",
    "role": "Analysis Engineer",
    "year": "2027",
    "image": "/images/team/vishalraju.webp",
    "linkedin": "https://www.linkedin.com/in/vishalraju-laguduva-37b0a0315/",
    "active": true,
    team: "Analysis Team"
  },
  {
    "id": 29,
    "name": "Ritik Lipate",
    "role": "Avionics Engineer",
    "year": "2027",
    "image": "/images/team/ritik.webp",
    "active": true,
    team: "Avionics Team"
  },
  {
    "id": 30,
    "name": "Nimisha Halabe",
    "role": "Avionics Engineer",
    "year": "2027",
    "image": "/images/team/nimisha.webp",
    "linkedin": "https://www.linkedin.com/in/nimisha-halabe-899188346/",
    "active": true,
    team: "Avionics Team"
  },
  {
    "id": 31,
    "name": "Sammed Vhora",
    "role": "Structural Engineer",
    "year": "2027",
    "image": "/images/team/sameed.webp",
    "linkedin": "https://www.linkedin.com/in/sammed-vhora-449498341/",
    "active": true,
    team: "Structural Team"
  },
  {
    "id": 32,
    "name": "Kedar Kulkarni",
    "role": "Analysis Engineer",
    "year": "2027",
    "image": "/images/team/kedar.webp",
    "linkedin": "https://www.linkedin.com/in/kedar-kulkarni-8a7822284/",
    "active": true,
    team: "Analysis Team"
  },
  {
    "id": 33,
    "name": "Aniruddha Patil",
    "role": "Autonomous Engineer",
    "year": "2026",
    "image": "/images/team/aniruddha.webp",
    "linkedin": "https://www.linkedin.com/in/aniruddha-patil-20290824b/",
    "github": "https://github.com/",
    "active": false,
    team: "Autonomous Team"
  },
  {
    "id": 34,
    "name": "Tanish Patil",
    "role": "Analysis Engineer",
    "year": "2027",
    "image": "/images/team/tanish.webp",
    "linkedin": "https://www.linkedin.com/in/tanish-patil-515bb2317/",
    "active": false,
    team: "Analysis Team"
  },
  {
    "id": 36,
    "name": "Tanmay Rajput",
    "role": "Ex-Managing Director",
    "year": "2025",
    "image": "/images/team/tanmay.webp",
    "linkedin": "https://www.linkedin.com/in/tanmayrajput11/",
    "active": false,
    team: "Management Team"
  },
  {
    "id": 37,
    "name": "Vedant Bharsakle",
    "role": "Ex-Executive Director",
    "year": "2025",
    "image": "/images/team/vedant.webp",
    "linkedin": "https://www.linkedin.com/in/vedant-bharsakle-529a0b266/",
    "active": false,
    team: "Management Team"
  },
  {
    "id": 35,
    "name": "Varadraj Patil",
    "role": "Avionics Engineer",
    "year": "2027",
    "image": "/images/team/varad.webp",
    "linkedin": "https://www.linkedin.com/in/varadraj-patil-66b00631b/",
    "active": false,
    team: "Avionics Team"
  },
  {
    "id": 38,
    "name": "Rohit Tambade",
    "role": "Ex-Chief Technical Officer",
    "year": "2025",
    "image": "/images/team/rohit.webp",
    "linkedin": "https://www.linkedin.com/in/rohit-tambade/",
    "active": false,
    team: "Management Team"
  },
  {
    "id": 39,
    "name": "Sujay Ambadkar",
    "role": "Ex-Project Manager",
    "year": "2025",
    "image": "/images/team/sujay.webp",
    "linkedin": "https://www.linkedin.com/in/sujay-ambadkar/",
    "active": false,
    team: "Management Team"
  },
  {
    "id": 40,
    "name": "Pranali Magdum",
    "role": "Ex-HR Manager",
    "year": "2025",
    "image": "/images/team/pranali.webp",
    "linkedin": "https://www.linkedin.com/in/magdum-pranali/",
    "active": false,
    team: "Management Team"
  }
];

const foundingTeam = [
  {
    "id": 1,
    "name": "Mihir Zambre",
    "role": "Founder Ex-Managing Director",
    "year": "2023",
    "image": "/images/team/mihir.webp",
    "linkedin": "https://www.linkedin.com/in/mihir-zambare-b543b7171/",
    "active": true,
    "team": "Founding Team"
  },
  {
    "id": 2,
    "name": "Anikett Pingle",
    "role": "Founder Ex-Executive Director",
    "year": "2023",
    "image": "/images/team/aniket.webp",
    "linkedin": "https://www.linkedin.com/in/anikett-pingle-ba2256231/",
    "active": true,
    "team": "Founding Team"
  }
];
const Faculty = [
  {
    "id": 1,
    "name": "Chandan Ingole",
    "role": "Faculty Advisor",
    "image": "/images/team/CRIngole.webp",
    "email": "chandan.ingole@pccoepune.org",
    "linkedin": "https://www.linkedin.com/in/chandan-ingole-04328241/",
    "active": true,
    "team": "Secretary",
    "year": ""
  },
];

const currentYear = "Current Batch";

export default function TeamsPage() {
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const roles = Array.from(new Set([...teamMembers.map(member => member.role), "Managing Director", "Executive Director"]));
  const years = Array.from(new Set(teamMembers.map(member => member.year)));

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = search ? member.name.toLowerCase().includes(search.toLowerCase()) || member.role.toLowerCase().includes(search.toLowerCase()) : true;
    const matchesRole = selectedRole !== "all" ? member.role === selectedRole : true;
    const matchesYear = selectedYear !== currentYear ? member.year === selectedYear : true;
    const isActiveOrFiltered = member.active || matchesSearch || matchesRole || matchesYear;
    return (selectedYear === currentYear ? member.active : isActiveOrFiltered) && matchesSearch && matchesRole && matchesYear;
  });

  const showFoundingMembers = !search && selectedRole === "all" && selectedYear === currentYear;
  const filteredFoundingMembers = showFoundingMembers ? foundingTeam : [];

  const showFacultyMembers = !search && selectedRole === "all" && selectedYear === currentYear;
  const filteredFacultyMembers = showFacultyMembers ? Faculty : [];

  const categorizedMembers = filteredMembers.reduce<Record<string, typeof teamMembers>>((acc, member) => {
    if (!acc[member.team]) acc[member.team] = [];
    acc[member.team].push(member);
    return acc;
  }, {});


  return (
    <>
      <Head>
        <title>Our Team | Team Maverick India</title>
        <meta
          name="description"
          content="Meet the talented individuals behind Team Maverick India, from founding members to current team leaders and engineers. Discover the people driving UAV innovation."
        />
        <meta
          name="keywords"
          content="Team Maverick India team, UAV team members, aerospace engineering team, founding members, current team, drone technology experts, Chandan Ingole, Narendra Deore, Sai Mehar,
           Mihir Zambre, Anikett Pingle, Dwaipayan Dhar, Riddhi Sonkusare, Maheshwar Dhone, Apoorva Chougule, Anjali Rade, Aditi Rade, Bhumika Shekawat, Mrunal Sagare, Mansi Kushwaha, Ishani Lohote, 
           Ritik Lipate, Nimisha Halabe, Veena Waghmare, Anshul Shelke, Mrudula Lele, Darshan Nair, kshitij Jadhav, Aryan Kakulte, Sammed Vhora, Vishalraju Laguduva, Kedar Kulkarni, Tanmay Rajput, 
           Vedant Bharsakle, Rohit Tambade, Pranali Magdum, Sujay Ambadkar, Atharva Shitole, Sarvesh Patil, Krupa Rao, Janhavi Ugalmugale, Aaditi Gurav, Aditya Suryawanshi, Aayush Bodkhe, Aniruddha Patil, 
           Ankur Fulzele, Mihik Shah, Om Kshirsagar, Hemal Khairnar, Varadraj Patil, Tanish Patil, "
        />
        <meta name="author" content="Team Maverick India" />
        <meta property="og:title" content="Our Team | Team Maverick India" />
        <meta
          property="og:description"
          content="Meet the talented individuals behind Team Maverick India, from founding members to current team leaders and engineers. Discover the people driving UAV innovation."
        />
        <meta property="og:image" content="/images/logo.png" />
        <meta property="og:url" content="https://www.team-maverick-india.com/team" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Team | Team Maverick India" />
        <meta
          name="twitter:description"
          content="Meet the talented individuals behind Team Maverick India, from founding members to current team leaders and engineers. Discover the people driving UAV innovation."
        />
        <meta name="twitter:image" content="/images/logo.png" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Team Maverick India",
              "url": "https://www.team-maverick-india.com",
              "logo": "https://www.team-maverick-india.com/logo.png",
              "member": [
                {
                  "@type": "Person",
                  "name": "Dwaipayan Dhar",
                  "jobTitle": "Managing Director",
                  "url": "https://www.linkedin.com/in/dwaipayan-dhar-109783259/"
                },
                {
                  "@type": "Person",
                  "name": "Riddhi Sonkusare",
                  "jobTitle": "Executive Director",
                  "url": "https://www.linkedin.com/in/riddhi-sonkusare-4b5671259/"
                }
              ]
            }
          `}
        </script>
        <link rel="icon" href="/images/favicon.ico" type="image/x-icon" />

      </Head>

    <div className="pt-24 pb-16">
      <StarryBackground />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Team</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Meet the passionate individuals behind Team Maverick India's success</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12 justify-center">
          <Input placeholder="Search by name or role..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger><SelectValue placeholder="Filter by role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="select-none">All roles</SelectItem>
              {roles.map(role => <SelectItem key={role} value={role} className="select-none">{role}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger><SelectValue placeholder="Filter by year" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={currentYear} className="select-none">{currentYear}</SelectItem>
              {years.map(year => <SelectItem key={year} value={year} className="select-none">{year} Batch</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {filteredFacultyMembers.length > 0 && (
          <Section title="Secretary" members={filteredFacultyMembers} />
        )}

        {filteredFoundingMembers.length > 0 && (
          <Section title="Founding Team" members={filteredFoundingMembers} />
        )}

        {Object.keys(categorizedMembers).length > 0 ? (
          Object.entries(categorizedMembers).map(([team, members]) => (
            <Section key={team} title={team} members={members} />
          ))
        ) : (
          <div className="text-center text-xl font-semibold mt-12">
            Member not found.
          </div>
        )}

      </div>
    </div>
    </>
  );
}

function Section({ title, members }: { title: string; members: typeof teamMembers }) {
  return (
    <div className="mb-12">
      <h2 className="text-4xl font-bold mb-6 text-center">{title}</h2>
      <div className="flex justify-center flex-wrap gap-6">
        {members.map(member => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}

function MemberCard({ member }: { member: (typeof teamMembers)[0] }) {
  return (
    <Card className="overflow-hidden w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
      <div className="relative h-80"> 
        <img 
          src={member.image} 
          alt={member.name} 
          className="w-full h-full object-cover" 
          style={{ objectPosition: "top" }} 
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{member.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{member.role}</p>
        {member.team !== "Secretary" && (
          <div className="flex items-center text-muted-foreground mb-2">
            <span className="text-sm">{member.year} Batch</span>
          </div>
        )}
        <div className="mt-auto flex space-x-2 pt-2">
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="text-muted-foreground hover:text-[#D4A348] transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
          )}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-[#D4A348] transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}