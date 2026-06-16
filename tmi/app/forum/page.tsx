
import Head from 'next/head';
import StarryBackground from "@/components/StarryBackground";
import { cn } from "@/lib/utils";

import dynamic from "next/dynamic";

const ForumSections = dynamic(() => import("./ForumSections"), { ssr: true });

export default function ForumPage() {
    return (
        <>
            <Head>
                <title>Forum | Team Maverick India</title>
                <meta
                    name="description"
                    content="Explore Team Maverick India's engagement and activities including workshops, technical sessions, and collaborative events."
                />
                <meta name="author" content="Team Maverick India" />
            </Head>

            <div className="pt-24 pb-20 min-h-screen relative">
                <StarryBackground />

                <div className="container mx-auto px-6 relative z-10">
                    {/* Header Section */}
                    <div className="text-center mb-20 animate-in fade-in duration-700 ease-out">
                        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-[0.25em] text-white mb-6">
                            FORUM
                        </h1>
                        <p className="text-[#D4A348] text-lg font-semibold tracking-widest uppercase mb-4">
                            Team Maverick India Engagement & Activities
                        </p>
                        <p className="text-white/60 text-sm md:text-base tracking-wide max-w-2xl mx-auto leading-relaxed">
                            This space will showcase our circular activities including workshops, technical sessions, collaborative events, and knowledge-sharing initiatives conducted throughout the year.
                        </p>
                    </div>

                    {/* Sections Grid */}
                    <ForumSections />
                </div>
            </div>
        </>
    );
}
