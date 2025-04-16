const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`🎉 MongoDB Connected: ${conn.connection.host} 📚`);
        
        mongoose.connection.once("open", () => {
            require('../models/user').ensureIndexes();
            require('../models/organization').ensureIndexes();
        });
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
