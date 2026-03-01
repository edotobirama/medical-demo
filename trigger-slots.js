async function checkSlots() {
    try {
        const response = await fetch('http://localhost:3001/api/slots');
        const slots = await response.json();
        console.log("Slots count:", slots.length);
        if (slots.length > 0) {
            console.log("First slot:", JSON.stringify(slots[0], null, 2));
        } else {
            console.log("No slots found via API");
        }
    } catch (e) {
        console.error("Failed to fetch slots:", e);
    }
}

checkSlots();
