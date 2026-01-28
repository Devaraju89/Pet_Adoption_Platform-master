
import fs from 'fs';
const log = (msg) => fs.appendFileSync('import_test.log', msg + '\n');

async function testImports() {
    log("Starting import tests...");
    const modules = [
        'express', 'cors', 'dotenv', 'mongoose', 'bcryptjs',
        'jsonwebtoken', 'morgan', 'passport', 'passport-google-oauth20', 'razorpay'
    ];

    for (const mod of modules) {
        try {
            await import(mod);
            log(`✅ Imported ${mod}`);
        } catch (err) {
            log(`❌ Failed to import ${mod}: ${err.message}`);
        }
    }
    log("Import tests finished.");
}

testImports();
