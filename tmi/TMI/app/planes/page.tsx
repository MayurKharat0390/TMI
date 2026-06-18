"use client";

import { Card } from "@/components/ui/card";
import StarryBackground from "@/components/StarryBackground";
import Head from 'next/head';

const planes = [
  {
    id: 1,
    name: "Shourya",
    year: "2024",
    description: `Shourya, our flagship fixed-wing UAV, achieved remarkable success, securing AIR 5 overall and AIR 1 in Technical Presentation. It set a record at SAEISS DDC by lifting four times its own weight, an unprecedented feat in the competition's history. With an empty weight of 4 kg, it effortlessly carried a 16 kg payload. Designed with a single-motor tractor configuration, its high-mount tapered wing spans an impressive 72 inches. The semi-monocoque fuselage, twin tail booms, and conventional tail structure showcase its advanced aerodynamics and efficiency.`,
    image: "/images/planes/shourya.png",
    specs: {
      wingspan: "72 in",
      weight: "4 kg",
      maxSpeed: "16 kg"
    }
  },
  {
    id: 2,
    name: "MOHAV-I",
    year: "2024",
    description: "MOHAV-I marked the team's first international success, ranking 10th globally and 4th in mission requirements. As one of the largest aircraft built by the team, it boasts a 170-inch wingspan and a sturdy 13.5 kg frame. With a semi-monocoque fuselage and twin tail booms, MOHAV-I was designed for unparalleled stability and aerodynamic efficiency, excelling in global competitions.",
    image: "/images/planes/mohav.png",
    specs: {
      wingspan:"170 in",
      weight: "13.5 kg",
      maxSpeed: "25 kg"
    }
  },
  {
    id: 3,
    name: "Vayutej",
    year: "2023",
    description: "Vayutej achieved AIR 1 overall and 1st place in Technical Presentation at SAEISS DDC 2023. This 4 kg UAV lifted 12 kg, demonstrating its remarkable payload capacity at three times its weight. Built with a 72-inch wingspan, a high-mount wing design, and a semi-monocoque fuselage, it balanced aerodynamic efficiency and structural durability, making it a standout performer.",
    image: "/images/planes/vayutej.png",
    specs: {
      wingspan: "72 in",
      weight: "4 kg",
      maxSpeed: "12 kg"
    }
  },
  {
    id: 4,
    name: "Trailblazer",
    year: "2022",
    description: "Trailblazer, the team's second aircraft and first competition entry, lifted 15 kg—three times its own weight—while setting benchmarks for the shortest takeoff and landing distances in its category. With a focus on lightweight design and robust aerodynamics, Trailblazer proved to be a milestone in the team's journey, pushing the limits of UAV performance.",
    image: "/images/planes/trailblazer.png",
    specs: {
      wingspan: "80 in",
      weight: "5 kg",
      maxSpeed: "15 kg"
    }
  },
  {
    id: 5,
    name: "Prototype - 1",
    year: "2021",
    description: "Prototype-1 was the team's first-ever aircraft, built as a learning project to master RC aircraft design and aerodynamics. With an empty weight of 3.5 kg, it carried a 3.5 kg payload, doubling its weight. This aircraft laid the foundation for future innovations, demonstrating a balanced and efficient flight design.",
    image: "/images/planes/prototype.png",
    specs: {
      wingspan: "60 in",
      weight: "3.5 kg",
      maxSpeed: "7 kg"
    }
  }
];

export default function PlanesPage() {
  return (
    <>
      <Head>
        <title>Our Aircraft | Team Maverick India</title>
        <meta
          name="description"
          content="Explore the innovative UAVs built by Team Maverick India, from our first prototype to our award-winning designs like Shourya and MOHAV-I. Discover the evolution of our aircraft technology."
        />
        <meta
          name="keywords"
          content="Team Maverick India aircraft, UAV designs, Shourya, UAV, MOHAV-I, Vayutej, Trailblazer, Prototype-1, aerospace engineering, drone technology"
        />
        <meta name="author" content="Team Maverick India" />
        <meta property="og:title" content="Our Aircraft | Team Maverick India" />
        <meta
          property="og:description"
          content="Explore the innovative UAVs built by Team Maverick India, from our first prototype to our award-winning designs like Shourya and MOHAV-I. Discover the evolution of our aircraft technology."
        />
        <meta property="og:image" content="/images/logo.png" />
        <meta property="og:url" content="https://www.team-maverick-india.com/aircraft" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Aircraft | Team Maverick India" />
        <meta
          name="twitter:description"
          content="Explore the innovative UAVs built by Team Maverick India, from our first prototype to our award-winning designs like Shourya and MOHAV-I. Discover the evolution of our aircraft technology."
        />
        <meta name="twitter:image" content="/images/logo.png" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Shourya",
                  "description": "Shourya, our flagship fixed-wing UAV, achieved remarkable success, securing AIR 5 overall and AIR 1 in Technical Presentation. It set a record at SAEISS DDC by lifting four times its own weight.",
                  "image": "/images/planes/shourya.png"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "MOHAV-I",
                  "description": "MOHAV-I marked the team's first international success, ranking 10th globally and 4th in mission requirements. With a 170-inch wingspan, it excels in stability and aerodynamic efficiency.",
                  "image": "/images/planes/mohav.png"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Vayutej",
                  "description": "Vayutej achieved AIR 1 overall and 1st place in Technical Presentation at SAEISS DDC 2023. This 4 kg UAV lifted 12 kg, demonstrating its remarkable payload capacity.",
                  "image": "/images/planes/vayutej.png"
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": "Trailblazer",
                  "description": "Trailblazer lifted 15 kg—three times its own weight—while setting benchmarks for the shortest takeoff and landing distances in its category.",
                  "image": "/images/planes/trailblazer.png"
                },
                {
                  "@type": "ListItem",
                  "position": 5,
                  "name": "Prototype - 1",
                  "description": "Prototype-1 was the team's first-ever aircraft, built as a learning project to master RC aircraft design and aerodynamics.",
                  "image": "/images/planes/prototype.png"
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
        <h1 className="text-4xl font-bold text-center mb-12">Our Aircraft</h1>

        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-2 bg-[#DFBA73] -translate-x-1/2" />

          <div className="md:hidden absolute left-4 top-0 bottom-0 w-2 bg-[#DFBA73] -translate-x-1/2" />

          <div className="space-y-12">
            {planes.map((plane, index) => (
              <div key={plane.id} className="relative">
                <div className={`absolute ${index % 2 === 0 ? 'md:left-1/2 right-1/2' : 'md:left-1/2'} left-4 right-4
                  w-5 h-5 rounded-full bg-[#FFFFFF] transform -translate-x-1/2 -translate-y-1/2
                  border-5 border-background
                `} />

                <div className={`absolute ${index % 2 === 0 ? 'right-[-30px]' : 'left-[-30px]'} top-1/2 transform -translate-y-1/2 rotate-[90deg] text-4xl font-bold text-[#DFBA73] shadow-text-glow md:block hidden`}>
                  {plane.year}
                </div>

                <div className={`md:flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 ml-8 md:ml-0`}>
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <Card className="overflow-hidden">
                      <img
                        src={plane.image}
                        alt={plane.name}
                        className="w-full h-80 object-cover"
                      />
                      <div className="p-6">
                        <h3 className="text-2xl font-bold mb-2">{plane.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{plane.year}</p>
                        <p className="mb-4 justify-center">{plane.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="font-semibold">Wingspan</p>
                            <p className="text-muted-foreground">{plane.specs.wingspan}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Empty Weight</p>
                            <p className="text-muted-foreground">{plane.specs.weight}</p>
                          </div>
                          <div>
                            <p className="font-semibold">All Up Weight </p>
                            <p className="text-muted-foreground">{plane.specs.maxSpeed}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
