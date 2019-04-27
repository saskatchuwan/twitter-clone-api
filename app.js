// Import Mongoose (used to connect to and interact with MongoDB)
const mongoose = require('mongoose');

// Create new express server
// Express is the main framework
const express = require('express');
const app = express();

// Import mongo key
const db = require('./config/keys').mongoURI;

// Import our routes
const users = require('./routes/api/users');
const tweets = require('./routes/api/tweets');

// Import body-parser (so that we can parse the JSON we send to our frontend)
const bodyParser = require('body-parser');

//Set up middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB using Mongoose
mongoose.connect(db, { useNewUrlParser: true })
        .then(() => console.log('Connected to MongoDB successfully!'))
        .catch(err => console.log(err));

// Set basic routes as a test
app.get('/', (req, res) => res.send('HELLO WERLD'));
app.use('/api/users', users);
app.use('/api/tweets', tweets);

// Tell app which port to run on 
const port = process.env.PORT || 5000;

// Tell Express to start a socket and listen for connections on the path
// Callback included to log success message when running successfully
app.listen(port, () => console.log(`Server is running on port ${port}`));

