const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const submit = require('./api/submit'); // Adjusted to point to submit.js in the api directory

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Route to handle submissions
app.post('/api/submit', submit);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
