const express = require('express');
const characterRouter = express.Router();
const Character = require('../models/character');
const User = require('../models/user');


//Index
characterRouter.get("/", (req, res) => {
    Character.find({creator: req.session.currentUser._id}, 
        (error, foundCharacter) => {
            res.render('characters/index.ejs', {chars: foundCharacter});
        });
});


//New
characterRouter.get('/new', (req, res) => {
    res.render('characters/new.ejs', {user: req.session.currentUser});
});

//Delete
characterRouter.delete('/:id', (req, res) => {
    Character.findByIdAndDelete(req.params.id, (error, delChar) => {
        res.redirect('/characters');
    });    
});


//Update

//Create
characterRouter.post('/', (req, res) => {
    Character.create(req.body, (error, createdChar) => {
        console.log(req.body);
        
        res.redirect(`characters/${createdChar._id}`);
    });
});

//Edit

//Show
characterRouter.get('/:id', (req, res) => {
    Character.findById(req.params.id, (error, foundCharacter) =>{
        res.render('characters/show.ejs', {char: foundCharacter});
    });
});



module.exports = characterRouter; 