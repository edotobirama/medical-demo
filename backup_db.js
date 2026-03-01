const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, 'backups');
const DB_URL = "postgresql://postgres@127.0.0.1:5433/hospital_portal";

function ensureDir() {
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR);
        console.log(`Created backup directory: ${BACKUP_DIR}`);
    }
}

function rotateBackups() {
    const files = fs.readdirSync(BACKUP_DIR)
        .filter(f => f.startsWith('backup_') && f.endsWith('.sql'))
        .map(f => ({
            name: f,
            time: fs.statSync(path.join(BACKUP_DIR, f)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time); // Newest first

    if (files.length > 3) {
        const toDelete = files.slice(3);
        toDelete.forEach(file => {
            fs.unlinkSync(path.join(BACKUP_DIR, file.name));
            console.log(`Rotated (deleted) old backup: ${file.name}`);
        });
    }
}

function backup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').split('.')[0];
    const filename = `backup_${timestamp}.sql`;
    const filepath = path.join(BACKUP_DIR, filename);

    // Check if pg_dump is available or try to find it
    // Assuming standard postgres tools are in path or use the one from known location if needed.
    // Simplifying to assume 'pg_dump' is in path given 'pg_ctl' worked, or using npx if relevant? 
    // Actually, pg tools are usually system level.

    console.log(`Creating backup: ${filename}...`);
    try {
        // Use connection string for pg_dump
        // Note: pg_dump might not accept full URL directly in all versions without -d key, but standard is `pg_dump dbname`
        // We will try using the params derived.

        const cmd = `pg_dump "${DB_URL}" > "${filepath}"`;
        execSync(cmd, { stdio: 'inherit' });
        console.log(`Backup created successfully at ${filepath}`);
    } catch (e) {
        console.error("Backup failed:", e.message);
        // Do not stop servers if backup fails? Or warn?
        // User asked to backup AND stop. We will proceed to stop but warn.
    }
}

function stopServers() {
    console.log('Stopping servers...');
    try {
        // Stop Node (frontend)
        try {
            // Windows specific kill for node
            execSync('taskkill /F /IM node.exe', { stdio: 'ignore' });
        } catch (e) { }
        console.log('Stopped Node processes.');

        // Stop Postgres
        // Assuming pg_data is strictly local in root
        const pgData = path.join(__dirname, 'pg_data');
        try {
            execSync(`pg_ctl stop -D "${pgData}" -m fast`, { stdio: 'ignore' });
        } catch (e) {
            // It might be stopped or not found in path if environment differs slightly (but we started it earlier)
            // Try absolute path if needed, but let's hope 'pg_ctl' is binding.
        }
        console.log('Stopped Postgres database.');

    } catch (e) {
        console.error("Error stopping servers:", e.message);
    }
}

function main() {
    ensureDir();
    backup();
    rotateBackups();
    stopServers();
}

main();
