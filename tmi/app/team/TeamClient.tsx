"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import dynamic from 'next/dynamic';

const StarryBackground = dynamic(() => import('@/components/StarryBackground'), { ssr: false });
const MemberCard = dynamic(() => import('./MemberCard'), { ssr: true });

interface Member {
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

interface TeamData {
  faculty: Member[];
  founding: Member[];
  members: Member[];
}

export default function TeamsPage() {
  const [teamData, setTeamData] = useState<TeamData>({ faculty: [], founding: [], members: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedYear, setSelectedYear] = useState("");

  const fetchTeamData = async () => {
    try {
      const res = await fetch("/api/team/members");
      if (res.ok) {
        const data = await res.json();
        setTeamData(data);
        
        // Calculate years list
        const yearsList = Array.from(
          new Set(
            (data.members || [])
              .map((m: Member) => m.year)
              .filter((y: string) => y && y !== "")
          )
        );

        if (yearsList.length > 0) {
          const maxYear = Math.max(...yearsList.map(y => Number(y))).toString();
          setSelectedYear(maxYear);
        }
      }
    } catch (e) {
      console.error("Failed to load roster", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const years = Array.from(
    new Set(
      (teamData.members || [])
        .map(member => member.year)
        .filter(year => year && year !== "")
    )
  ).sort((a, b) => Number(b) - Number(a));

  const latestYear = years.length > 0 ? years[0] : "";

  const roles = Array.from(
    new Set([
      ...(teamData.members || []).map(member => member.role),
      "Managing Director",
      "Executive Director"
    ])
  );

  const filteredMembers = (teamData.members || []).filter(member => {
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
  const filteredFoundingMembers = showFoundingMembers ? teamData.founding : [];

  const showFacultyMembers = !search && selectedRole === "all" && selectedYear === latestYear;
  const filteredFacultyMembers = showFacultyMembers ? teamData.faculty : [];

  const categorizedMembers = filteredMembers.reduce<Record<string, Member[]>>((acc, member) => {
    if (!acc[member.team]) acc[member.team] = [];
    acc[member.team].push(member);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="pt-40 pb-20 min-h-screen bg-background flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#DFBA73] border-t-transparent animate-spin" />
        <p className="text-xs uppercase tracking-widest text-[#DFBA73]">Loading Team Roster...</p>
      </div>
    );
  }

  return (
    <>
      <div className="pt-24 pb-16 relative min-h-screen bg-background scanlines grid-pattern">
        <StarryBackground />
        <div className="container mx-auto px-6 relative z-10">
          
          {/* Header */}
          <div id="team-header" className="text-center mb-16">
            <span className="text-[#DFBA73] text-xs font-bold uppercase tracking-[0.25em] font-sans">Meet the Crew</span>
            <h1 className="text-4xl md:text-6xl font-cormorant font-normal text-foreground mt-2 mb-4">
              Our <span className="italic font-light text-[#DFBA73]">Team</span>
            </h1>
            <div className="w-16 h-[1px] bg-[#DFBA73]/50 mx-auto mb-6" />
            <p className="text-muted-foreground text-sm tracking-wide max-w-xl mx-auto leading-relaxed font-sans font-light">
              "Meet the passionate engineers, designers, and organizers crafting the future of flight."
            </p>
          </div>

          {/* Filters console */}
          <div id="team-filters" className="glass-panel p-6 rounded-2xl border border-[#DFBA73]/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto shadow-xl">
            <Input 
              placeholder="Search by name or role..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="bg-background border-[#DFBA73]/20 focus:border-[#DFBA73] text-foreground tracking-wide placeholder:text-muted-foreground/50"
            />
            
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="bg-background border-[#DFBA73]/20 text-foreground">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-[#DFBA73]/30 text-popover-foreground">
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
              </SelectContent>
            </Select>
            
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="bg-background border-[#DFBA73]/20 text-foreground">
                <SelectValue placeholder="Filter by year" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-[#DFBA73]/30 text-popover-foreground">
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
                } else if (selectedYear === latestYear) {
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
              No matching members found in this hangar.
            </div>
          )}

        </div>
      </div>
    </>
  );
}

function Section({ title, badge, members }: { title: string; badge?: string; members: Member[] }) {
  return (
    <div className="mb-20">
      <div className="text-center mb-12">
        {badge && (
          <p className="text-[#DFBA73] text-xs font-bold tracking-[0.25em] uppercase mb-2 font-sans">
            {badge}
          </p>
        )}
        <h2 className="text-2xl md:text-3xl font-cormorant font-normal text-foreground">{title}</h2>
        <div className="w-12 h-[1px] bg-[#DFBA73]/40 mx-auto mt-3" />
      </div>
      
      <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
        {members.map((member, idx) => (
          <MemberCard key={member.id} member={member} index={idx} />
        ))}
      </div>
    </div>
  );
}
