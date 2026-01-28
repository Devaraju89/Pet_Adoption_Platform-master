console.log("Starting debug_user_import.js");
try {
    await import("./models/User.js");
    console.log("User import successful");
} catch (e) {
    console.error("User import failed:", e);
    process.exit(1);
}
console.log("Done");
