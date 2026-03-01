const { spawn } = require('child_process');
const path = require('path');

// Manually set environment variable for the child process
const env = {
    ...process.env,
    DATABASE_URL: "postgresql://postgres@localhost:5433/hospital_portal"
};

// Use full path to npx if possible, otherwise rely on PATH.
// On Windows 'npx.cmd' is safer.
const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

console.log("Starting migration...");
console.log("DATABASE_URL:", env.DATABASE_URL);

// npx -y to avoid prompts
const child = spawn(cmd, ['-y', 'prisma', 'migrate', 'dev', '--name', 'init'], {
    env: env,
    cwd: __dirname, // Ensure it runs in this directory (hospital-website)
    shell: true
});

child.stdout.on('data', (data) => {
    console.log(`[STDOUT] ${data}`);
});

child.stderr.on('data', (data) => {
    console.error(`[STDERR] ${data}`);
});

child.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
    process.exit(code);
});
