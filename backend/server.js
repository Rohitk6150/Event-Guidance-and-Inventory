const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./modals/User');
const Event = require('./modals/Event');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: '*',  // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));
app.use(express.json());

// Add a preflight handler for all routes
app.options('*', cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://nobigamer00:e1GdrWRwo7wHmmVQ@cluster0.vl7qd5h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Authentication middleware
const protect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      const token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallbacksecret');
      
      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');
      
      next();
    } catch (error) {
      console.error('Auth error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Test route
app.get('/api/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'API is working' });
});

// Register route
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Register endpoint hit');
    console.log('Request body:', req.body);
    
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password, // Password hashing is handled by the User model
    });

    if (user) {
      // Generate JWT
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallbacksecret', {
        expiresIn: '30d',
      });

      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: token,
      });
    }
  } catch (error) {
    console.error('Error in register route:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login endpoint hit');
    console.log('Request body:', req.body);
    
    const { email, identifier, password } = req.body;
    
    // Use email if provided, otherwise use identifier
    const loginEmail = email || identifier;
    
    if (!loginEmail || !password) {
      return res.status(400).json({ message: 'Please provide email/username and password' });
    }
    
    // Find user by email
    const user = await User.findOne({ 
      $or: [
        { email: loginEmail }, 
        { username: loginEmail }
      ] 
    });
    
    if (user && (await user.matchPassword(password))) {
      // Generate JWT
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallbacksecret', {
        expiresIn: '30d',
      });
      
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email/username or password' });
    }
  } catch (error) {
    console.error('Error in login route:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Event Routes
// Get all events
app.get('/api/events', protect, async (req, res) => {
  try {
    console.log('Get all events endpoint hit');
    const events = await Event.find({});
    res.json(events);
  } catch (error) {
    console.error('Error getting events:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get event by ID
app.get('/api/events/:id', protect, async (req, res) => {
  try {
    console.log('Get event by ID endpoint hit:', req.params.id);
    const event = await Event.findById(req.params.id);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    console.error('Error getting event by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create event
app.post('/api/events', protect, async (req, res) => {
  try {
    console.log('Create event endpoint hit');
    console.log('Request body:', req.body);
    
    const { name, description, date, time, location } = req.body;
    
    if (!name || !date || !time) {
      return res.status(400).json({ message: 'Please provide required fields: name, date, time' });
    }
    
    const event = await Event.create({
      name,
      description,
      date,
      time,
      location,
      // createdBy: req.user._id, // If you want to associate with the user
    });
    
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update event
app.put('/api/events/:id', protect, async (req, res) => {
  try {
    console.log('Update event endpoint hit:', req.params.id);
    console.log('Request body:', req.body);
    
    const event = await Event.findById(req.params.id);
    
    if (event) {
      event.name = req.body.name || event.name;
      event.description = req.body.description || event.description;
      event.date = req.body.date || event.date;
      event.time = req.body.time || event.time;
      event.location = req.body.location || event.location;
      
      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete event
app.delete('/api/events/:id', protect, async (req, res) => {
  try {
    console.log('Delete event endpoint hit:', req.params.id);
    
    const event = await Event.findById(req.params.id);
    
    if (event) {
      await event.deleteOne(); // Using deleteOne instead of remove which is deprecated
      res.json({ message: 'Event removed' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});