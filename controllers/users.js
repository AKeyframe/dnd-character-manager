// Dependencies
const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');
const db = mongoose.connection;
const userRouter = express.Router();
const User = require('../models/user.js');
const Campaign = require('../models/campaign');
const Character = require('../models/character');


// Index is in the server.js

// New (registration page) is in the server.js

// Delete

// Update

// Create (registration route)
userRouter.post('/', (req, res) => {
    //overwrite the user password with the hashed password, then pass that in to our database
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(12));
    User.create(req.body, (error, createdUser) => {
        res.redirect('/');
    });
});

// Edit

// Show
userRouter.get("/:username", (req, res) => {
    res.render(`user/profile.ejs`, {user: req.session.currentUser});
})

// Export User Router
module.exports = userRouter;