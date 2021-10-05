const express = require('express');
const characterRouter = express.Router();
const Character = require('../models/character');
const Campaign = require('../models/campaign');
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
            //Remove the character from User
            user.characters = user.characters.filter( (char, i) => {
                console.log('---------------------------------------');
                console.log(char);
                console.log(delChar._id);
                if(!char.equals(delChar._id)){
                    console.log(`added char: ${char}`);
                    return char;
                }
            }); //forEach
            user.save();
            console.log(user);
        }); //User

        //Find the campaigns that have the Del Character
        Campaign.find({players: {$elemMatch: {character: delChar._id}}}, (err, foundCamps) => {
            //For every campagin with the deleted character
            foundCamps.forEach((camp, i) => {
                //Go through each player and remove the deleted character
                camp.players.forEach( (player, i) => {
                    if(player.character.equals(delChar._id)) {
                        player.character = null;
                         
                    }
                })//forEach(player)
                camp.save();
            });//forEach(camp)

        });//Campaign
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

//Adding a created character to a campaign
//Probably should change the name of this eventually 
characterRouter.post('/joinCampaign', (req, res) => {
    //find the character selected by the user
    Character.findById(req.body.charId, (error, foundChar) => {
        //find the campaign the user is adding the character to
        Campaign.findById(req.body.campId, (campError, foundCamp) => {
            let exists=false;
            //If it's already there do nothing
            foundChar.campaign.forEach( camp => {
                if(camp.equals(foundCamp._id)){
                    exists=true;
                }
            });
            if(exists===false){
                //add the campaign to the character
                foundChar.campaign.push(foundCamp._id);
                foundChar.save();
            }
            
            //for each player in the campaign
            foundCamp.players.forEach( (p, i) => {

                //find the correct user
                if(p.playerId.equals(req.session.currentUser._id)) {
                    //check if a character is already being played by this user
                    if(p.character){
                        //If one is find the character
                        Character.findById(p.character, (e, prevChar) => {
                            //Then remove the campaign from the character
                            prevChar.campaign = prevChar.campaign.filter( pcCamp => {
                                if(!pcCamp.equals(foundCamp._id)){
                                    return pcCamp;
                                }
                            });//filter
                            prevChar.save();
                        });//Character (prevChar)
                    }
                    //Then add the charcter to that player within the campaign
                    p.character = foundChar._id;
                }
            }); //forEach()

            // If the DM is adding a character of their own
            if(foundCamp.dm.equals(req.session.currentUser._id)) {
                //check to see if the DM already added a character and if so
                //Replace it with the new one
                let exists = false;
                foundCamp.players.forEach((p, i) => {
                    if(p.playerId.equals(foundCamp.dm)){
                        exists=true;
                        p.character = foundChar._id;
                    }
                });

                //If it doesn't exist add the player id and the character
                if(exists===false) {
                    foundCamp.players.push({playerId: foundCamp.dm, character: foundChar._id});
                }

            } else {
                //Update the players object for the given user/char
                foundCamp.players.forEach( (p, i) => {
                    if(p.playerId.equals(foundChar.creator)){
                        p.character = foundChar._id;
                    }
                });
            }

            foundCamp.save();
            res.redirect(`/campaigns/${foundCamp._id}`);
        });
    });
});


//Edit

//Show
characterRouter.get('/:id', (req, res) => {
    Character.findById(req.params.id, (error, foundCharacter) =>{
        res.render('characters/show.ejs', {char: foundCharacter, user: req.session.currentUser});
    });
});



module.exports = characterRouter; 