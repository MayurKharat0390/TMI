import { cn } from "@/lib/utils";

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
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {forumSections.map((section, index) => (
                <div
                    key={index}
                    className={cn(
                        "rounded-xl border border-white/10 bg-white/5 p-8 text-center transition-all duration-300 ease-in-out",
                        "hover:scale-105 hover:border-[#D4A348]/30 hover:shadow-lg hover:shadow-black/30",
                        "animate-in fade-in slide-in-from-bottom-4 duration-700",
                    )}
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                >
                    <h3 className="text-xl font-bold uppercase tracking-widest text-[#D4A348] mb-4">
                        {section.title}
                    </h3>
                    <div className="space-y-4">
                        <p className="text-white font-semibold text-lg">Coming Soon</p>
                        <p className="text-white/40 text-sm leading-relaxed">
                            We will update this section with upcoming activities.
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
