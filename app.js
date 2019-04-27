// Import Mongoose (used to connect to and interact with MongoDB)
const mongoose = require('mongoose');

// Create new express server
// Express is the main framework
const express = require('express');
const app = express();

// Import mongo key
const db = require('./config/keys').mongoURI;

// Connect to MongoDB using Mongoose
mongoose.connect(db, { useNewUrlParser: true })
        .then(() => console.log('Connected to MongoDB successfully!'))
        .catch(err => console.log(err));

// Set basic route as a test
app.get('/', (req, res) => res.send('HELLO WERLD'));

// Tell app which port to run on 
const port = process.env.PORT || 5000;

// Tell Express to start a socket and listen for connections on the path
// Callback included to log success message when running successfully
app.listen(port, () => console.log(`Server is running on port ${port}`));

