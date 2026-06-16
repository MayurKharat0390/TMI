"use client";

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import StarryBackground from "@/components/StarryBackground";

const testimonials = [
  {
    text: "Founding Team Maverick India was more than just starting a team—it was about building a legacy of passion, innovation, and resilience. From winning a national championship to securing a global top 10 rank, our journey has proven that no dream is too big when backed by determination and teamwork. This website stands as a testament to our unwavering spirit and the limitless potential of those who dare to dream. From Pune to Los Angeles, Team Maverick has been and will be a family. A family of honour, respect and love. To every future Maverick: cherish the journey, honor the struggles, and remember—dreams take flight when hearts beat as one.",
    author: "Mr. Mihir Zambare",
    role: "Founder & Ex-Managing Director",
    image: "/images/team/mihir.webp"
  },
  {
    text: `Being part of this team was an incredible journey that shaped me in countless ways. I loved spending hours at work in college with my team family—because "members" just don’t cut it! This wasn’t just about learning aerodynamics, teamwork, or leadership; it was about life and rising stronger after every fall. From crashes and failures to successful flights and victories, this team has been truly a Maverick experience like no other. I’ll forever be grateful for how it shaped me personally, and I’d happily relive those Maverick days anytime.`,
    author: "Ms. Rifa Ansari",
    role: "Ex-Managing Director 24'",
    image: "/images/team/rifa.webp"
  }
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalTestimonials = testimonials.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalTestimonials);
    }, 13000);

    return () => clearInterval(interval);
  }, [totalTestimonials]);

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalTestimonials);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalTestimonials) % totalTestimonials);
  };

  return (
    <>
      <Head>
        <title>Team Maverick India - Wolves of the Sky | UAV Design & Innovation</title>
        <meta
          name="description"
          content="Team Maverick India is a pioneering student team specializing in the design, innovation, and fabrication of fixed-wing UAVs. Join us in our journey to excel in national and international Aero Design challenges."
        />
        <meta
          name="keywords"
          content="Team Maverick India, UAV design, fixed-wing UAVs, Aero Design, student innovation, aerospace engineering, national championship, global top 10 rank"
        />
        <meta name="author" content="Team Maverick India" />
        <meta
          property="og:title"
          content="Team Maverick India - Wolves of the Sky | UAV Design & Innovation"
        />
        <meta
          property="og:description"
          content="Team Maverick India is a pioneering student team specializing in the design, innovation, and fabrication of fixed-wing UAVs. Join us in our journey to excel in national and international Aero Design challenges."
        />
        <meta property="og:image" content="/images/logo.png" />
        <meta property="og:url" content="https://www.team-maverick-india.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Team Maverick India - Wolves of the Sky | UAV Design & Innovation"
        />
        <meta
          name="twitter:description"
          content="Team Maverick India is a pioneering student team specializing in the design, innovation, and fabrication of fixed-wing UAVs. Join us in our journey to excel in national and international Aero Design challenges."
        />
        <meta name="twitter:image" content="/images/logo.png" />
        <link rel="icon" href="/images/favicon.ico" type="image/x-icon" />
      </Head>

    <div className="pt-16">
      <StarryBackground />
      <section className="relative h-screen w-full flex items-center justify-center bg-[url('/images/home/hero.gif')] bg-cover bg-center bg-no-repeat mt-[-3.3rem] sm:mt-0">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4 text-center text-white">
          <h1 className="text-[2.5rem] md:text-[5rem] font-bold mb-4 font-montserrat">
            TEAM MAVERICK INDIA
          </h1>
          <p className="text-lg md:text-[2rem] mb-6 font-montserrat">
            Wolves of the Sky!
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">About Us</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground">
                We design, innovate, fabricate and test fixed Wing UAVs. The team's objective is to allow students to transcend themselves and sharpen their skills in the aero domain. The team is enriching this learning experience by participating in a hands-on engineering challenge at the Aero Design Series at the national and international levels.
              </p>
              <Button asChild className="w-full sm:w-auto">
                <Link href="/team">Meet Our Team</Link>
              </Button>
            </div>
            <div className="relative w-full h-auto rounded-lg overflow-hidden">
              <Image
                src="/images/home/aboutus.png"
                alt="Team"
                width={800}
                height={450}
                layout="responsive"
                objectFit="contain"
              />
            </div>

          </div>
        </div>
      </section>

      <section className="py-16 bg-background overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Testimonials</h2>
          <div className="relative">
            <div className="relative w-full overflow-hidden">
              <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-full bg-card p-6 rounded-lg shadow-lg transition-all duration-500"
                  >
                    <p className="text-base md:text-lg italic mb-6 text-justify text-center">{testimonial.text}</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={testimonial.image}
                          alt={testimonial.author}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${currentIndex === index ? 'bg-[#D4A348]' : 'bg-gray-400'}`}
                  onClick={() => goToTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}