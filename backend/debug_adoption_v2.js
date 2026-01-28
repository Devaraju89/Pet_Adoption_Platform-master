
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AdoptionRequest from './models/AdoptionRequest.js';
import User from './models/User.js';
import Pet from './models/Pet.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const logFile = path.join(__dirname, 'debug_output.txt');
const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
};

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        log("Connected to MongoDB.");

        const users = await User.find({});
        log(`Total Users: ${users.length}`);
        users.forEach(u => log(`- User: ${u.name} (Role: ${u.role}) ID: ${u._id}`));

        const pets = await Pet.find({});
        log(`Total Pets: ${pets.length}`);
        pets.forEach(p => log(`- Pet: ${p.name} ID: ${p._id}`));

        const requests = await AdoptionRequest.find({});
        log(`Total Adoption Requests: ${requests.length}`);
        requests.forEach(r => log(`- Request: Pet ${r.petId} by User ${r.userId}, Status: ${r.status}`));

        if (requests.length === 0) {
            log("No requests found for any user.");
        }

    } catch (err) {
        log("Error: " + err);
    } finally {
        await mongoose.disconnect();
    }
};

checkData();
