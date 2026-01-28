import { spawn } from 'child_process';
import fs from 'fs';

console.log("Starting wrapper...");
const logStream = fs.createWriteStream('./wrapper_out.log', { flags: 'a' });
const errStream = fs.createWriteStream('./wrapper_err.log', { flags: 'a' });

const child = spawn('node', ['server.js'], { cwd: process.cwd() });

child.stdout.on('data', (data) => {
    console.log("STDOUT:", data.toString());
    logStream.write(data);
});

child.stderr.on('data', (data) => {
    console.log("STDERR:", data.toString());
    errStream.write(data);
});

child.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
    logStream.write(`Exited with code ${code}\n`);
    errStream.write(`Exited with code ${code}\n`);
});
