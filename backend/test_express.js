
import express from 'express';
console.log("Imported express");
const app = express();
console.log("Created app");
try {
    app.use(express.json());
    console.log("Added json middleware");
} catch (e) {
    console.log("Middleware error: " + e);
}
