const mongoose = require('mongoose');

const connectToDataBase = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1); // Stop server on DB failure
    }
};

module.exports = connectToDataBase;
