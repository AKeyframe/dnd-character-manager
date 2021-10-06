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
       
        //DnD Math Ignore until next comment --- Converts stat to modifier
        let stats = [createdChar.stats.str.val,
                        createdChar.stats.dex.val,
                        createdChar.stats.con.val,
                        createdChar.stats.int.val,
                        createdChar.stats.wis.val,
                        createdChar.stats.cha.val];
        
        stats.forEach( (stat, i) => {
            let mod;
            if(stat>=20) {mod=5;}
            if(stat>=18 && stat<20) {mod=4;}
            if(stat>=16 && stat<18) {mod=3;}
            if(stat>=14 && stat<16) {mod=2;}
            if(stat>=12 && stat<14) {mod=1;}
            if(stat>=10 && stat<12) {mod=0;}
            if(stat>=8 && stat<10) {mod=-1;}
            if(stat>=6 && stat<8) {mod=-2;}
            if(stat>=4 && stat<6) {mod=-3;}
            if(stat>=2 && stat<4) {mod=-4;}
            if(stat>=1 && stat<2) {mod=-5;}
            console.log(mod);
            if(i===0) {createdChar.stats.str.mod=mod;}
            if(i===1) {createdChar.stats.dex.mod=mod;}
            if(i===2) {createdChar.stats.con.mod=mod;}
            if(i===3) {createdChar.stats.int.mod=mod;}
            if(i===4) {createdChar.stats.wis.mod=mod;}
            if(i===5) {createdChar.stats.cha.mod=mod;}
        });
        createdChar.hp.cur = createdChar.hp.max;

        createdChar.save();
        

        //Add the new character to the user
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
        console.log(foundCharacter);
        res.render('characters/show.ejs', {char: foundCharacter, user: req.session.currentUser});
    });
});



module.exports = characterRouter; 