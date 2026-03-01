const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:5433/hospital_portal',
});

async function testConnection() {
    try {
        console.log('Attempting to connect to DB at 127.0.0.1:5433 with password "postgres"...');
        await client.connect();
        console.log('✅ Connection Successful!');
        const res = await client.query('SELECT NOW()');
        console.log('Server Time:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error('❌ Connection Failed:', err.message);
        // Try without password
        const clientNoPass = new Client({
            connectionString: 'postgresql://postgres@127.0.0.1:5433/hospital_portal',
        });
        try {
            console.log('Attempting without password...');
            await clientNoPass.connect();
            console.log('✅ Connection Successful (No Password)!');
            await clientNoPass.end();
        } catch (e) {
            console.error('❌ No Password Failed too:', e.message);
        }
    }
}

testConnection();
