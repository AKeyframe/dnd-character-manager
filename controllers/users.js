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

userRouter.post('/acceptRequest', (req, res) => {
    User.findById(req.body.userId, (error, user) => {
        // Add the campaign to the USer
        if(req.body.invType == 'campaign'){
            user.campaigns.push(req.body.campId);
        }
       
        //Remove the request from the users list
        user.requests = user.requests.filter( reQ => {
            if(!reQ._id.equals(req.body.reqId)){
                return reQ._id;
            }
        });
        
        user.save();

        //Add the user to the campaign
        Campaign.findById(req.body.campId, (error, foundCamp) => {
            let obj={id: user._id}
            foundCamp.players.push(obj);
            foundCamp.save();
        });

        res.redirect(`/campaigns/${req.body.campId}`);
    });
});

userRouter.post('/declineRequest', (req, res) => {
    User.findById(req.body.userId, (error, user) => {
        //Remove the request from User's list
        user.requests = user.requests.filter( reQ => {
            if(!reQ._id.equals(req.body.reqId)){
                console.log(`added request ${reQ._id}`);
                return reQ._id;
            }
        });
        user.save();
        res.redirect(`/user/${user.username}/requests`);
    });
});


// Create (registration route)
userRouter.post('/', (req, res) => {
    //overwrite the user password with the hashed password, then pass that in to our database
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(12));
    User.create(req.body, (error, createdUser) => {
        res.redirect('/');
    });
});




userRouter.get("/:username/requests", (req, res) => {
    sesUser = req.session.currentUser;
    User.findById(sesUser._id).populate('requests.by').populate('requests.for').exec( (error, user) => {
        res.render(`user/requests.ejs`, {user: user});
    });
});

// Edit

// Show
userRouter.get("/:username", (req, res) => {
    res.render(`user/profile.ejs`, {user: req.session.currentUser});
})

// Export User Router
module.exports = userRouter;