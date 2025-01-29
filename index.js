const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./schema');  // Import User model

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3010;

// Middleware to parse JSON data
app.use(express.json());  // To handle POST data as JSON

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.error('Error connecting to database:', err);
  });

// Serve static files from the 'static' folder
app.use(express.static('static'));

// Handle GET request to the root URL
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

// POST API Endpoint for creating users
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Create a new user instance with the provided data
    const newUser = new User({
      name,
      email,
      password,
    });

    // Save the user to the database
    await newUser.save();

    // Return a success response
    return res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    // Handle validation errors or server errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: `Validation error: ${err.message}` });
    }
    return res.status(500).json({ message: 'Server error, please try again later' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
