import type { Metadata } from 'next';
import FundraiserPage from './SupportUsClient';

export const metadata: Metadata = {
  title: 'Support Team Maverick India | Crowdfunding for UAV Innovation',
  description: 'Support Team Maverick India in revolutionizing UAV technology. Your contribution helps us design, innovate, and compete globally. Donate now and be a part of our journey!',
  keywords: [
    'Team Maverick India',
    'support UAV innovation',
    'crowdfunding',
    'donate to UAV research',
    'Ketto',
    'GoFundMe',
    'aerospace engineering',
    'student innovation'
  ],
  authors: [{ name: 'Team Maverick India' }],
  openGraph: {
    title: 'Support Team Maverick India | Crowdfunding for UAV Innovation',
    description: 'Support Team Maverick India in revolutionizing UAV technology. Your contribution helps us design, innovate, and compete globally. Donate now and be a part of our journey!',
    images: [{ url: '/images/logo.png' }],
    url: 'https://www.team-maverick-india.com/support-us',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Support Team Maverick India | Crowdfunding for UAV Innovation',
    description: 'Support Team Maverick India in revolutionizing UAV technology. Your contribution helps us design, innovate, and compete globally. Donate now and be a part of our journey!',
    images: ['/images/logo.png'],
  },
};

export default function Page() {
  return <FundraiserPage />;
}
