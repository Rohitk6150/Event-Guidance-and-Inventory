const mongoose = require('mongoose');

const connectDB = async () => {
    // try {
    //     const conn = await mongoose.connect(process.env.MONGO_URI, {
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true,
    //         // useCreateIndex: true, // Not needed for Mongoose v6+
    //         // useFindAndModify: false, // Not needed for Mongoose v6+
    //     });

        try {
            const conn = await mongoose.connect('mongodb://localhost:27017/eventInvent');

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;