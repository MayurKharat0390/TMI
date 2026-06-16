"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Head from 'next/head';
import dynamic from 'next/dynamic';

const StarryBackground = dynamic(() => import('@/components/StarryBackground'), { ssr: false });
const MemberCard = dynamic(() => import('./MemberCard'), { ssr: true });

import teamData from "@/data/team.json";

const teamMembers = teamData.members;
const foundingTeam = teamData.founding;
const Faculty = teamData.faculty;

export default function TeamsPage() {
  const years = Array.from(
    new Set(
      teamData.members
        .map(member => member.year)
        .filter(year => year && year !== "")
    )
  );

  const latestYear = Math.max(
    ...years.map(year => Number(year))
  ).toString();

  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedYear, setSelectedYear] = useState(latestYear);

  const roles = Array.from(new Set([...teamMembers.map(member => member.role), "Managing Director", "Executive Director"]));

  const filteredMembers = teamData.members.filter(member => {
    const matchesSearch = search
      ? member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.role.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesRole =
      selectedRole !== "all" ? member.role === selectedRole : true;

    const isLatestYear = selectedYear === latestYear;
    const isCurrentManagement = member.year === "2027" && (member.team === "Management Team" || member.team === "Directors");

    const matchesYear = member.year === selectedYear || (isLatestYear && isCurrentManagement);

    return matchesSearch && matchesRole && matchesYear;
  });

  const showFoundingMembers = !search && selectedRole === "all" && selectedYear === latestYear;
  const filteredFoundingMembers = showFoundingMembers ? foundingTeam : [];

  const showFacultyMembers = !search && selectedRole === "all" && selectedYear === latestYear;
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
          content="Team Maverick India team, UAV team members, aerospace engineering team, founding members, current team"
        />
        <link rel="icon" href="/images/favicon.ico" type="image/x-icon" />
      </Head>

      <div className="pt-24 pb-16 relative min-h-screen bg-background scanlines grid-pattern">
        <StarryBackground />
        <div className="container mx-auto px-6 relative z-10">
          
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-[#D4A348] text-xs font-bold uppercase tracking-[0.25em]">Meet the Crew</span>
            <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-wide text-foreground mt-2 mb-4 font-montserrat">
              OUR <span className="text-[#D4A348] text-gold-glow">TEAM</span>
            </h1>
            <div className="w-24 h-1 bg-[#D4A348] mx-auto rounded-full mb-6" />
            <p className="text-muted-foreground text-sm tracking-wide max-w-xl mx-auto leading-relaxed">
              "Meet the passionate engineers, designers, and organizers crafting the future of flight."
            </p>
          </div>

          {/* Filters console */}
          <div className="glass-panel p-6 rounded-2xl border border-[#D4A348]/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto shadow-xl">
            <Input 
              placeholder="Search by name or role..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="bg-background border-[#D4A348]/20 focus:border-[#D4A348] text-foreground tracking-wide placeholder:text-muted-foreground/50"
            />
            
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="bg-background border-[#D4A348]/20 text-foreground">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-[#D4A348]/30 text-popover-foreground">
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
              </SelectContent>
            </Select>
            
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="bg-background border-[#D4A348]/20 text-foreground">
                <SelectValue placeholder="Filter by year" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-[#D4A348]/30 text-popover-foreground">
                {years.map(year => <SelectItem key={year} value={year}>{year} Batch</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Faculty section */}
          {filteredFacultyMembers.length > 0 && (
            <Section title="Faculty Advisors" badge="Advisory Board" members={filteredFacultyMembers} />
          )}

          {/* Founding section */}
          {filteredFoundingMembers.length > 0 && (
            <Section title="Founding Board" badge="Genesis Team" members={filteredFoundingMembers} />
          )}

          {/* Active departments */}
          {Object.keys(categorizedMembers).length > 0 ? (
            [
              "Management Team",
              "Ex-Management",
              "Directors",
              ...Object.keys(categorizedMembers).filter(
                team => team !== "Management Team" && team !== "Ex-Management" && team !== "Directors" && team !== "Secretary" && team !== "Founding Team"
              )
            ]
              .filter(team => categorizedMembers[team] && categorizedMembers[team].length > 0)
              .map(team => {
                let badge = "";
                let displayTitle = team;

                const isCurrentManagementTeam = (team === "Management Team" || team === "Directors");

                if (isCurrentManagementTeam) {
                  badge = "Current Leadership";
                } else if (selectedYear === "2028") {
                  badge = "Active Members";
                } else if (team === "Ex-Management") {
                  badge = "Alumni Board";
                  displayTitle = "Leadership Board";
                } else {
                  badge = "Operations Department";
                }

                return (
                  <Section key={team} title={displayTitle} badge={badge} members={categorizedMembers[team]} />
                );
              })
          ) : (
            <div className="text-center text-xl text-muted-foreground tracking-wider font-semibold py-12">
              No matching wolves found in this hangar.
            </div>
          )}

        </div>
      </div>
    </>
  );
}

function Section({ title, badge, members }: { title: string; badge?: string; members: typeof teamMembers }) {
  return (
    <div className="mb-20">
      <div className="text-center mb-12">
        {badge && (
          <p className="text-[#D4A348] text-xs font-bold tracking-[0.25em] uppercase mb-2">
            {badge}
          </p>
        )}
        <h2 className="text-3xl md:text-4xl font-extrabold uppercase text-foreground font-montserrat">{title}</h2>
        <div className="w-16 h-0.5 bg-[#D4A348]/40 mx-auto mt-3 rounded-full" />
      </div>
      
      <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
        {members.map(member => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
