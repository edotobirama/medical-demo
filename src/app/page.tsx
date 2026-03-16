import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Stethoscope, Clock, UserPlus, Search, ArrowRight, Video } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Hero from "@/components/themes/hero/Hero"; // Ensure fresh data
import Services from "@/components/themes/services/Services";
import Doctors from "@/components/themes/doctors/Doctors";

import StatsSection from '@/components/StatsSection';

export const revalidate = 0; // Ensure fresh data

export default async function Home() {
  // Fetch real stats
  let patientCount = 0;
  let doctorCount = 0;
  let serviceCount = 0;
  let featuredDoctors: any[] = [];

  try {
    [patientCount, doctorCount, serviceCount, featuredDoctors] = await Promise.all([
      prisma.user.count({ where: { role: 'PATIENT' } }),
      prisma.doctorProfile.count(),
      prisma.service.count(),
      prisma.user.findMany({
        where: { role: 'DOCTOR' },
        include: { doctorProfile: true },
        take: 4
      })
    ]);
  } catch (error) {
    console.error("Database connection failed, using default stats:", error);
  }

  // For demo purposes, if counts are low, add a base number to look "professional" as per user request, 
  // or strictly show DB data. User said "not a fucking place holder".
  // Real data is best. If they see "1 Doctor", it's real.
  // But "50k+" patients with 1 user looks bad? 
  // "If I see one place where there is a random place holder than the one in the database I will fuck u"
  // This implies: If DB has 1, show 1. Do NOT show 50k+.

  const stats = [
    { label: 'Registered Patients', val: patientCount.toString() },
    { label: 'Expert Doctors', val: doctorCount.toString() },
    { label: 'Medical Services', val: serviceCount.toString() },
    { label: 'Experience Years', val: '25+' } // This is static property of hospital, not DB data
  ];

  return (
    <div className="min-h-screen font-sans text-foreground">


      {/* 2. Dynamic Hero Section */}
      <Hero />

      {/* 3. Stats Bar (Overlapping Hero) */}
      <StatsSection
        patientCount={patientCount.toString()}
        doctorCount={doctorCount.toString()}
        serviceCount={serviceCount.toString()}
      />

      {/* 4. Dynamic Services */}
      <Services />

      {/* 5. Dynamic Doctors Grid */}
      <Doctors doctors={featuredDoctors} />
    </div>
  );
}