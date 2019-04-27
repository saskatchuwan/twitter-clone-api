const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

// The callback for every Express route requires a request
// and response as arguments
router.get('/test', (req, res) => res.json({
  msg: 'This is the users route',
}));

// User sign-up
router.post('/register', (req, res) => {

  // Check to make sure nobody has already registered with a duped email
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        // Throw a 400 error if the email address already exists
        return res.status(400).json({
          email: "A user has already registered with this address"
        });
      } else {
        // Otherwise, create a new user
        const newUser = new User({
          handle: req.body.handle,
          email: req.body.email,
          password: req.body.password
        });
      
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => {
                const payload = { id: user.id, name: user.name };

                jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                  res.json({
                    success: true,
                    token: "Bearer " + token
                  });
                });
              })
              .catch(err => console.log(err));
          });
        });
      }
    });


});

// User log-in
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({
          email: 'This user does not exist'
        });
      }

      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            // res.json({ msg: 'Success' });

            const payload = {
              id: user.id,
              name: user.name
            };

            // We want to return a signed web token with each login or register 
            // request in order to "sign the user in" on the frontend.
            jwt.sign(
              payload,
              keys.secretOrKey,
              // Tell the key to expire in one hour
              {expiresIn: 3600},
              (err, token) => {
                res.json({
                  success:true,
                  token: 'Bearer ' + token
                });
              }
            );

          } else {
            return res.status(400).json({ password: 'Incorrect password'});
          }
        });
    });
});


module.exports = router;