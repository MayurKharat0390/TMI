import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us | UAV Innovation & Support',
  description: 'Reach out to Team Maverick India for UAV innovation collaborations, technical support, or sponsorship opportunities. Connect with our aerospace engineering team in Pune, India.',
  keywords: [
    'Contact Team Maverick India',
    'UAV support',
    'aerospace engineering contact',
    'drone technology help',
    'PCCoE Pune collaboration',
    'UAV sponsorship'
  ],
};

export default function Page() {
  return <ContactClient />;
}
