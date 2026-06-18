import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Team Maverick India | UAV Innovation & Aerospace Engineering',
  description: 'Official website of Team Maverick India - Wolves of the Sky. Developing cutting-edge autonomous fixed-wing UAVs and pushing the boundaries of aerodynamic design at PCCOE, Pune.',
  keywords: [
    'Team Maverick India',
    'Wolves of the Sky',
    'UAV PCCOE Pune',
    'aerospace engineering student team',
    'autonomous fixed-wing drone',
    'SAE Aero Design West competitor',
    'aerodynamics simulation Ansys'
  ],
};

export default function Page() {
  return <HomeClient />;
}
