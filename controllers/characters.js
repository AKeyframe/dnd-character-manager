const express = require('express');
const characterRouter = express.Router();
const Character = require('../models/character');
const User = require('../models/user');


//Index
characterRouter.get("/", (req, res) => {
    Character.find({creator: req.session.currentUser._id}, 
        (error, foundCharacter) => {
            res.render('characters/index.ejs', {chars: foundCharacter, user: req.session.currentUser});
        });
});


//New
characterRouter.get('/new', (req, res) => {
    res.render('characters/new.ejs', {user: req.session.currentUser});
});

//Delete
characterRouter.delete('/:id', (req, res) => {
    Character.findByIdAndDelete(req.params.id, (error, delChar) => {
        User.findById(req.session.currentUser._id, (error, user) => {

            user.characters = user.characters.filter( (char, i) => {
                if(!char.equals(delChar._id)){
                    console.log(`added char: ${char}`);
                    return char;
                }
            }); //forEach
            user.save();
            console.log(user);
        }); //User
        res.redirect('/characters');
    }); //Character
}); //Router


//Update

//Create
characterRouter.post('/', (req, res) => {
    Character.create(req.body, (error, createdChar) => {
        console.log(req.body);
        User.findById(req.session.currentUser._id, (error, user) => {
            user.characters.push(createdChar._id);
            user.save();
        })
        res.redirect(`characters/${createdChar._id}`);


        // User.updateOne({_id: createdChar.creator},
        //     {$push: {characters: createdChar._id}});
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