const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testAuth() {
    const email = 'testuser@example.com';
    const password = 'password123';
    const name = 'Test User';

    console.log(`Testing registration for ${email}...`);

    // 1. Clean up potential previous failed test
    await prisma.user.deleteMany({ where: { email } });

    // 2. Simulate Registration
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: 'PATIENT'
        }
    });
    console.log('User created:', user.id);

    // 3. Simulate Login
    const fetchedUser = await prisma.user.findUnique({ where: { email } });
    if (!fetchedUser) {
        console.error('Login Failed: User not found in DB');
        return;
    }

    const match = await bcrypt.compare(password, fetchedUser.password);
    if (match) {
        console.log('✅ Login Successful: Password matched');
    } else {
        console.error('❌ Login Failed: Password mismatch');
    }

    // cleanup
    await prisma.user.delete({ where: { id: user.id } });
}

testAuth()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
