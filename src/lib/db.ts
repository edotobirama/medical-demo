import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data.json');

// Interface for our DB schema
interface Database {
    waitlist: {
        id: number;
        name: string;
        email: string; // added email
        status: string;
        timestamp: string;
    }[];
    appointments: {
        id: number;
        patientName: string; // simplified for demo
        type: 'irl' | 'digital';
        date: string;
        doctor: string;
        status: string;
    }[];
}

// Default initial state
const initialState: Database = {
    waitlist: [
        { id: 1, name: "Existing Patient 1", email: "p1@test.com", status: "waiting", timestamp: new Date().toISOString() },
        { id: 2, name: "Existing Patient 2", email: "p2@test.com", status: "notified", timestamp: new Date().toISOString() }
    ],
    appointments: []
};

// Helper to read DB
export function readDb(): Database {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify(initialState, null, 2));
        return initialState;
    }
    try {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return initialState;
    }
}

// Helper to write DB
export function writeDb(data: Database) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
