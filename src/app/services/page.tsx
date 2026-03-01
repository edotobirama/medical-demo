import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import ServicesContent from './ServicesContent';

export const metadata: Metadata = {
    title: 'Services & Facilities | Grandview Medical',
    description: 'Explore our treatments, advanced infrastructure, and community health programs.',
};

export default async function ServicesPage() {
    // Fetch data in parallel
    const [services, programs] = await Promise.all([
        prisma.service.findMany(),
        prisma.program.findMany({ orderBy: { date: 'asc' } })
    ]);

    // Group services
    const treatments = services
        .filter(s => ['CONSULTATION', 'TREATMENT', 'CHECKUP'].includes(s.category))
        .map(s => ({ ...s, price: Number(s.price), duration: s.duration || 0 }));

    const infrastructure = services
        .filter(s => ['SCAN', 'LAB', 'INFRASTRUCTURE'].includes(s.category))
        .map(s => ({ ...s, price: Number(s.price), duration: s.duration || 0 }));

    const mappedPrograms = programs.map(p => ({
        ...p,
        location: p.location || 'Hospital Campus'
    }));

    return (
        <ServicesContent
            treatments={treatments}
            infrastructure={infrastructure}
            programs={mappedPrograms}
        />
    );
}
