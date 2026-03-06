const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

(async () => {
    const docs = await p.user.findMany({ where: { role: 'DOCTOR' } });
    for (const d of docs) {
        let img = d.image;
        if (d.name.includes('Robert')) img = '/images/doctors/robert.png';
        if (d.name.includes('Alan')) img = '/images/doctors/alan.png';
        await p.user.update({ where: { id: d.id }, data: { image: img } });
        console.log(d.name + ' -> ' + img);
    }
    await p.$disconnect();
    console.log('Done!');
})();
