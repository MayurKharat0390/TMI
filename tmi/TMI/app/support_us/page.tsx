"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Head from "next/head";

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

      <div className="pt-24 pb-16 bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl text-[#DFBA73] font-bold mb-4">
              Support Us !
            </h1>
            <p className="text-xl text-gray max-w-2xl mx-auto">
              Join us in our mission to revolutionize UAV technology. Your contribution fuels our journey toward breakthrough innovations.
            </p>
          </div>

          <Card className="p-8 mb-16 border-2 border-[#292929] rounded-lg shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <h2 className="text-3xl text-[#DFBA73] font-bold mb-4 text-center">Our Story</h2>
            <p className="text-gray text-center mb-4">
              We are Team Maverick India, a dedicated group of young engineers from Pimpri Chinchwad College of Engineering, Pune, established in 2021. United by a shared passion for innovation and a commitment to creating impactful solutions, we embarked on a mission to design and build autonomous aircraft.
              Our journey has spanned the nation and the world, showcasing our exceptional skills and innovative spirit in prestigious competitions.
            </p>
            <p className="text-gray text-center ">
              Your support not only funds our research but also inspires our team to reach new heights. Together, we can make a real difference.
            </p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
            <Card className="p-6 border-2 border-[#292929] rounded-lg shadow-md  flex flex-col items-center hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <img
                src="/images/support_us/ketto.png"
                alt="Ketto QR Code"
                className="w-64 h-64 object-contain mb-4"
              />
              <h3 className="text-2xl font-semibold mb-2">Donate on Ketto</h3>
              <Button
                className="w-full mt-4 bg-[#DFBA73] hover:bg-[#A47C2C] text-white"
                onClick={() => window.open("https://www.ketto.org/fundraiser/team-maverick-india-redefining-boundaries", "_blank")}
              >
                Donate via Ketto
              </Button>
            </Card>

            <Card className="p-6 border-2 border-[#292929] rounded-lg shadow-md  flex flex-col items-center hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <img
                src="/images/support_us/gofundme.png"
                alt="GoFundMe QR Code"
                className="w-64 h-64 object-contain mb-4"
              />
              <h3 className="text-2xl font-semibold mb-2">Donate on GoFundMe</h3>
              <Button
                className="w-full mt-4 bg-[#DFBA73] hover:bg-[#A47C2C] text-white"
                onClick={() => window.open("https://www.gofundme.com/f/support-team-mavericks-global-challenge", "_blank")}
              >
                Donate via GoFundMe
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
