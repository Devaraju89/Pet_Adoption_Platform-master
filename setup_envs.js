
const fs = require('fs');
const path = require('path');

const backendEnv = `PORT=5002
MONGO_URI=mongodb://127.0.0.1:27017/pet_adoption
JWT_SECRET=development_secret_key_12345
GOOGLE_CLIENT_ID=placeholder_client_id
GOOGLE_CLIENT_SECRET=placeholder_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
RAZORPAY_DEMO_MODE=true
RAZORPAY_KEY_ID=placeholder_key_id
RAZORPAY_KEY_SECRET=placeholder_key_secret`;

const frontendEnv = `VITE_API_URL=http://localhost:5002/api`;

try {
  fs.writeFileSync(path.join(__dirname, 'backend', '.env'), backendEnv);
  console.log('Backend .env created successfully');
  fs.writeFileSync(path.join(__dirname, 'frontend', '.env'), frontendEnv);
  console.log('Frontend .env created successfully');
} catch (err) {
  console.error('Error creating .env files:', err);
}
