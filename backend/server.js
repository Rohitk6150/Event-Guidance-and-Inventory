const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/event');
const inventoryRoutes = require('./routes/inventory');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors'); // Import CORS

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins (adjust as needed for production)
app.use(express.json()); // Body parser

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/inventory', inventoryRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});