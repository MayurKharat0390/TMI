import type { Metadata } from 'next';
import TeamsPageClient from './TeamClient';

export const metadata: Metadata = {
  title: 'Our Team | Meet the Wolves',
  description: 'Meet the talented individuals behind Team Maverick India, from founding members to current team leaders and engineers. Discover the people driving UAV innovation in Pune, India.',
  keywords: [
    'Team Maverick India team',
    'UAV team members',
    'aerospace engineering team',
    'founding members',
    'current team'
  ],
};

export default function Page() {
  return <TeamsPageClient />;
}
