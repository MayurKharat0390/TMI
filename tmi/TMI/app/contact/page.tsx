"use client";

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail } from 'lucide-react';
import { toast } from "sonner";
import emailjs from 'emailjs-com';
import Head from 'next/head';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await emailjs.send(
        'service_68199oj', 
        'template_k605p7u', 
        formData,
        'ZBJImsgABlXQ5aiOt' 
      );

      console.log('Email Sent:', result.text);
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <>
      <Head>
        <title>Contact Team Maverick India | UAV Innovation & Support</title>
        <meta 
          name="description" 
          content="Reach out to Team Maverick India for UAV innovation collaborations, technical support, or sponsorship opportunities. Connect with our aerospace engineering team in Pune, India."
        />
        <meta 
          name="keywords" 
          content="Contact Team Maverick India, UAV support, aerospace engineering contact, drone technology help, PCCoE Pune collaboration, UAV sponsorship"
        />
        <meta name="author" content="Team Maverick India" />
        <meta property="og:title" content="Contact Team Maverick India | UAV Innovation & Support" />
        <meta 
          property="og:description" 
          content="Connect with India's premier student UAV team. Get technical support, discuss collaborations, or explore sponsorship opportunities for aerospace innovations."
        />
        <meta property="og:image" content="/images/logo.png" />
        <meta property="og:url" content="https://www.team-maverick-india.com/contact" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Team Maverick India | UAV Innovation & Support" />
        <meta 
          name="twitter:description" 
          content="Reach out to India's top UAV student team for technical collaborations, sponsorships, or aerospace engineering support. Based in PCCoE, Pune."
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
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-8454061436",
                "contactType": "technical support",
                "email": "teammaverickindia@pccoepune.org",
                "areaServed": "Global",
                "availableLanguage": ["English", "Hindi"]
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Pradhikaran",
                "addressLocality": "Akurdi",
                "addressRegion": "Maharashtra",
                "postalCode": "411044",
                "addressCountry": "India"
              }
            }
          `}
        </script>
        <link rel="icon" href="/images/favicon.ico" type="image/x-icon" />

      </Head>

    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="p-6 border-2 border-[#292929] rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-[#DFBA73]" />
                  <p>Team Maverick India, PCCoE, Pradhikaran, Akurdi, Pune, India</p>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-[#DFBA73]" />
                  <p>Mr. Dwaipayan Dhar: +91 8454061436</p>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-[#DFBA73]" />
                  <p>Ms. Riddhi Sonkusare: +91 8855937479</p>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-[#DFBA73]" />
                  <p>teammaverickindia@pccoepune.org</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 border-[#292929] rounded-lg shadow-md">
              <iframe
                src="https://maps.google.com/maps?width=600&amp;height=300&amp;hl=en&amp;q=Team Maverick Ind&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                width="100%"
                height="375"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Card>
          </div>

          <Card className="p-6 border-2 border-[#292929] rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                />
              </div>

              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
}
