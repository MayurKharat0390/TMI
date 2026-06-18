"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";

export default function FundraiserPage() {
  return (
    <>
      <Head>
        <title>Support Team Maverick India | Crowdfunding for UAV Innovation</title>
        <meta
          name="description"
          content="Support Team Maverick India in revolutionizing UAV technology. Your contribution helps us design, innovate, and compete globally. Donate now and be a part of our journey!"
        />
        <meta
          name="keywords"
          content="Team Maverick India, support UAV innovation, crowdfunding, donate to UAV research, Ketto, GoFundMe, aerospace engineering, student innovation"
        />
        <meta name="author" content="Team Maverick India" />
        <meta
          property="og:title"
          content="Support Team Maverick India | Crowdfunding for UAV Innovation"
        />
        <meta
          property="og:description"
          content="Support Team Maverick India in revolutionizing UAV technology. Your contribution helps us design, innovate, and compete globally. Donate now and be a part of our journey!"
        />
        <meta property="og:image" content="/images/logo.png" />
        <meta property="og:url" content="https://www.team-maverick-india.com/support-us" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Support Team Maverick India | Crowdfunding for UAV Innovation"
        />
        <meta
          name="twitter:description"
          content="Support Team Maverick India in revolutionizing UAV technology. Your contribution helps us design, innovate, and compete globally. Donate now and be a part of our journey!"
        />
        <meta name="twitter:image" content="/images/logo.png" />
        <link rel="icon" href="/images/favicon.ico" type="image/x-icon" />
      </Head>

      <div className="relative pt-24 pb-20 overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#DFBA73]/[0.02] to-transparent pointer-events-none" />
        <div className="absolute -top-[20%] -left-[10%] w-[40%] h-[40%] bg-[#DFBA73]/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[40%] h-[40%] bg-[#DFBA73]/[0.03] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl sm:text-6xl text-[#DFBA73] font-bold mb-6 tracking-tight">
              Support Us
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join us in our mission to revolutionize UAV technology. Your contribution fuels our journey toward breakthrough innovations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="p-8 mb-16 border border-border bg-card/60 backdrop-blur-sm rounded-2xl shadow-2xl hover:border-[#DFBA73]/40 transition-all duration-500">
              <h2 className="text-3xl text-[#DFBA73] font-bold mb-6 text-center">Our Story</h2>
              <div className="max-w-3xl mx-auto space-y-4">
                <p className="text-muted-foreground text-center text-lg leading-relaxed">
                  We are Team Maverick India, a dedicated group of young engineers from Pimpri Chinchwad College of Engineering, Pune, established in 2021. United by a shared passion for innovation and a commitment to creating impactful solutions, we embarked on a mission to design and build autonomous aircraft.
                </p>
                <p className="text-muted-foreground text-center text-lg leading-relaxed">
                  Our journey has spanned the nation and the world, showcasing our exceptional skills and innovative spirit in prestigious competitions.
                </p>
                <p className="text-foreground font-medium text-center text-lg mt-6">
                  Your support not only funds our research but also inspires our team to reach new heights. Together, we can make a real difference.
                </p>
              </div>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="group p-8 border border-border bg-card/60 backdrop-blur-sm rounded-2xl shadow-lg flex flex-col items-center hover:border-[#DFBA73]/40 hover:shadow-[#DFBA73]/5 transition-all duration-500">
                <div className="relative mb-6 p-4 bg-white rounded-xl group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src="/images/support_us/ketto.png"
                    alt="Ketto QR Code"
                    width={400}
                    height={400}
                    loading="lazy"
                    decoding="async"
                    quality={85}
                    className="w-56 h-56 object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-foreground/90">Donate on Ketto</h3>
                <p className="text-muted-foreground text-center mb-6 text-sm">Scan QR or click below to support via Ketto</p>
                <Button
                  className="w-full mt-auto bg-[#DFBA73] hover:bg-[#DFBA73]/90 text-black font-bold py-6 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  onClick={() => window.open("https://www.ketto.org/fundraiser/team-maverick-india-redefining-boundaries", "_blank")}
                >
                  Donate via Ketto
                </Button>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card className="group p-8 border border-border bg-card/60 backdrop-blur-sm rounded-2xl shadow-lg flex flex-col items-center hover:border-[#DFBA73]/40 hover:shadow-[#DFBA73]/5 transition-all duration-500">
                <div className="relative mb-6 p-4 bg-white rounded-xl group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src="/images/support_us/gofundme.png"
                    alt="GoFundMe QR Code"
                    width={400}
                    height={400}
                    loading="lazy"
                    decoding="async"
                    quality={85}
                    className="w-56 h-56 object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-foreground/90">Donate on GoFundMe</h3>
                <p className="text-muted-foreground text-center mb-6 text-sm">Scan QR or click below to support via GoFundMe</p>
                <Button
                  className="w-full mt-auto bg-[#DFBA73] hover:bg-[#DFBA73]/90 text-black font-bold py-6 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  onClick={() => window.open("https://www.gofundme.com/f/support-team-mavericks-global-challenge", "_blank")}
                >
                  Donate via GoFundMe
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
