const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple test endpoint
app.get('/test', (req, res) => {
  console.log('Test GET endpoint hit');
  res.json({ message: 'Test server is working' });
});

// Test POST endpoint
app.post('/register', (req, res) => {
  console.log('Test POST endpoint hit');
  console.log('Request body:', req.body);
  res.json({ message: 'Post received', data: req.body });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
}); 