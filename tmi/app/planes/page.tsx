import type { Metadata } from 'next';
import PlanesClient from './PlanesClient';

export const metadata: Metadata = {
  title: 'Our Aircraft | UAV Fleet & Designs',
  description: 'Explore the cutting-edge UAVs engineered by Team Maverick India—from Prototype-1 to the world-class MOHAV-II. Discover how each aircraft advanced our innovation in aerospace.',
  keywords: [
    'Team Maverick India aircraft',
    'UAV designs',
    'MOHAV-II',
    'Shourya',
    'MOHAV-I',
    'Vayutej',
    'Trailblazer',
    'Prototype-1'
  ],
};

export default function Page() {
  return <PlanesClient />;
}
