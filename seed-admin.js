const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('admin123456', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@grandview.com' },
        update: { role: 'ADMIN', password: hashedPassword },
        create: {
            name: 'Admin',
            email: 'admin@grandview.com',
            password: hashedPassword,
            role: 'ADMIN',
            image: '/images/team-doctors.png',
        },
    });

    console.log('Admin user created:', admin.email, 'Role:', admin.role);
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
