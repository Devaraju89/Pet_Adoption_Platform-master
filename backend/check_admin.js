
import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
import fs from 'fs';

// Load env vars
dotenv.config();

// Fallback if .env is not readable or empty
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pet_adoption';
const OUTPUT_FILE = 'admin_check_result.txt';

const log = (msg) => {
    console.log(msg);
    try {
        fs.appendFileSync(OUTPUT_FILE, msg + '\n');
    } catch (e) {
        // ignore
    }
};

const checkAdmin = async () => {
    // Clear previous log
    try { fs.unlinkSync(OUTPUT_FILE); } catch (e) { }

    try {
        log('Connecting to: ' + MONGO_URI);
        await mongoose.connect(MONGO_URI);
        log('Connected to DB');

        const admin = await User.findOne({ email: 'admin@petadoption.com' });
        if (admin) {
            log('Admin user FOUND:');
            log('ID: ' + admin._id);
            log('Email: ' + admin.email);
            log('Role: ' + admin.role);
            log('Password hash length: ' + (admin.password ? admin.password.length : 0));
        } else {
            log('Admin user NOT FOUND');
        }

    } catch (err) {
        log('Error: ' + err.toString());
    } finally {
        await mongoose.disconnect();
        log('Done');
        process.exit(0);
    }
};

checkAdmin();
