"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Terminal, Send, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import Head from 'next/head';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const StarryBackground = dynamic(() => import('@/components/StarryBackground'), { ssr: false });

const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message cannot exceed 2000 characters')
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { resolvedTheme } = useTheme();
  
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, isSubmitting } 
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: ''
    }
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      toast.success('Message sent successfully!');
      reset();
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.message || 'Failed to send message. Please try again.');
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
        <link rel="icon" href="/images/favicon.ico" type="image/x-icon" />
      </Head>

      <div className="pt-24 pb-16 relative min-h-screen bg-background scanlines grid-pattern">
        <div className="hidden dark:block">
          <StarryBackground />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-[#DFBA73] text-xs font-bold uppercase tracking-[0.25em]">Sponsorship & Support</span>
            <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-wide text-foreground mt-2 mb-4 font-montserrat">
              CONTACT <span className="text-[#DFBA73] text-gold-glow">US</span>
            </h1>
            <div className="w-24 h-1 bg-[#DFBA73] mx-auto rounded-full mb-6" />
            <p className="text-muted-foreground text-sm tracking-wide max-w-xl mx-auto leading-relaxed">
              "Send telemetry, report anomalies, or initiate collaboration with the Wolves."
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Info Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-8"
            >
              <div className="glass-panel p-8 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-xl text-foreground">
                <div className="flex items-center gap-3 mb-6">
                  <Terminal className="w-5 h-5 text-[#DFBA73]" />
                  <h2 className="text-xl font-bold uppercase tracking-wider font-montserrat">COMMUNICATIONS HUB</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2.5 rounded-lg bg-[#DFBA73]/10 border border-[#DFBA73]/20 flex-shrink-0">
                      <MapPin className="h-5 w-5 text-[#DFBA73]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Headquarters</h4>
                      <p className="text-sm text-foreground/90">Team Maverick India, PCCoE, Pradhikaran, Akurdi, Pune, India</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-2.5 rounded-lg bg-[#DFBA73]/10 border border-[#DFBA73]/20 flex-shrink-0">
                      <Phone className="h-5 w-5 text-[#DFBA73]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Primary Contacts</h4>
                      <p className="text-sm text-foreground/90">Mr. Ritik Lipate: +91 9284383901</p>
                      <p className="text-sm text-foreground/90 mt-1">Ms. Nimisha Halabe: +91 9028401706</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-2.5 rounded-lg bg-[#DFBA73]/10 border border-[#DFBA73]/20 flex-shrink-0">
                      <Mail className="h-5 w-5 text-[#DFBA73]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">NOC Mailbox</h4>
                      <p className="text-sm text-[#DFBA73] hover:underline">
                        <a href="mailto:teammaverickindia@pccoepune.org">teammaverickindia@pccoepune.org</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map panel */}
              <div className="glass-panel overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-xl relative h-[320px]">
                <iframe
                  src="https://maps.google.com/maps?width=600&amp;height=300&amp;hl=en&amp;q=Team%20Maverick%20Ind&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: resolvedTheme === "dark" ? "invert(90%) hue-rotate(180deg) opacity(80%)" : "opacity(90%)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>

            {/* Form Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="glass-panel p-8 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md text-foreground shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Terminal className="w-5 h-5 text-[#DFBA73]" />
                  <h2 className="text-xl font-bold uppercase tracking-wider font-montserrat">SECURE CONSOLE</h2>
                </div>
                <p className="text-muted-foreground text-xs tracking-wide mb-6 leading-relaxed uppercase">
                  ENTER YOUR PAYLOAD INFORMATION BELOW TO DISPATCH MESSAGE
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Sender Name
                    </label>
                    <Input
                      id="name"
                      {...register('name')}
                      className="bg-background/60 border-border focus-visible:ring-[#DFBA73] text-foreground hover:border-[#DFBA73]/40 transition-colors py-6"
                      placeholder="e.g. John Doe"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1 font-mono">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Sender Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="bg-background/60 border-border focus-visible:ring-[#DFBA73] text-foreground hover:border-[#DFBA73]/40 transition-colors py-6"
                      placeholder="e.g. john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 font-mono">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Message Payload
                    </label>
                    <Textarea
                      id="message"
                      {...register('message')}
                      rows={6}
                      className="bg-background/60 border-border focus-visible:ring-[#DFBA73] text-foreground hover:border-[#DFBA73]/40 transition-colors"
                      placeholder="Describe your request, project context or sponsorship details..."
                    />
                    {errors.message && (
                      <p className="text-red-500 text-xs mt-1 font-mono">{errors.message.message}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-[#DFBA73] hover:bg-yellow-400 text-black font-bold uppercase tracking-wider py-6 transition-all duration-300 hover:scale-[1.02] shadow-[0_0_20px_rgba(212,163,72,0.2)] active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Transmitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Transmit Signal
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
