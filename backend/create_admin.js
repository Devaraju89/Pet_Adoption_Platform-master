
import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import fs from 'fs';

// Load env vars
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pet_adoption';
const OUTPUT_FILE = 'create_admin_result.txt';

const log = (msg) => {
    console.log(msg);
    try {
        fs.appendFileSync(OUTPUT_FILE, msg + '\n');
    } catch (e) {
        // ignore
    }
};

const createAdmin = async () => {
    // Clear previous log
    try { fs.unlinkSync(OUTPUT_FILE); } catch (e) { }

    try {
        log('Connecting to: ' + MONGO_URI);
        await mongoose.connect(MONGO_URI);
        log('Connected to DB');

        const existingAdmin = await User.findOne({ email: 'admin@petadoption.com' });
        if (existingAdmin) {
            log('Admin user already exists.');
        } else {
            log('Creating admin user...');
            const hashedPassword = await bcrypt.hash("admin123", 10);
            const adminUser = await User.create({
                name: "Admin User",
                email: "admin@petadoption.com",
                password: hashedPassword,
                role: "admin"
            });
            log('Admin user created successfully!');
            log('Email: admin@petadoption.com');
            log('Password: admin123');
        }

    } catch (err) {
        log('Error: ' + err.toString());
    } finally {
        await mongoose.disconnect();
        log('Done');
        process.exit(0);
    }
};

createAdmin();
