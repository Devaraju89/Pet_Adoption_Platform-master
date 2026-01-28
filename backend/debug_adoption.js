
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AdoptionRequest from './models/AdoptionRequest.js';
import User from './models/User.js';
import Pet from './models/Pet.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");

        const users = await User.find({});
        console.log(`Total Users: ${users.length}`);
        users.forEach(u => console.log(`- User: ${u.name} (${u.email}) ID: ${u._id}`));

        const pets = await Pet.find({});
        console.log(`Total Pets: ${pets.length}`);

        const requests = await AdoptionRequest.find({});
        console.log(`Total Adoption Requests: ${requests.length}`);
        requests.forEach(r => console.log(`- Request: Pet ${r.petId} by User ${r.userId}, Status: ${r.status}`));

        if (requests.length === 0 && users.length > 0 && pets.length > 0) {
            console.log("Attempting to create a dummy request...");
            const dummyRequest = new AdoptionRequest({
                petId: pets[0]._id,
                userId: users[0]._id,
                name: users[0].name,
                email: users[0].email,
                message: "Debug request"
            });
            await dummyRequest.save();
            console.log("Dummy request created.");
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.disconnect();
    }
};

checkData();
