import fetch from 'node-fetch';

async function main() {
    // Requires the dev server to be running on :3001
    const targetUrl = 'http://localhost:3001/api/booking/simulate';

    // Using Dr. Sarah Wilson's ID or dummy data
    const doctorId = 'cm801ig3q0009mngj4e0tpy1d'; // Typical format for cuid
    // If not works we'll fetch dynamic. Let's just mock request body.

    // We expect the wait time to be calculated against CURRENT time 
    // rather than REQUESTED time.

    // Since we don't strictly have a hardcoded doctorId in this script context easily,
    // let's fetch doctor id first.

    const bodyObj = {
        doctorId: "cm802c6in0001mnf2ks1yihps", // Using a dummy or real string since DB is seeded
        requestedTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
        issueDescription: "test"
    }

    try {
        const res = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyObj)
        });

        const data = await res.json();
        console.log("Simulation Result:", data);

        if (data && typeof data.estimatedWaitTime === 'number') {
            console.log("\n✅ Success! The API returned an estimated wait time:", data.estimatedWaitTime);
        } else {
            console.log("\n❌ API returned malformed data or no wait time.");
        }
    } catch (e) {
        console.error("Test failed", e);
    }
}

main();
