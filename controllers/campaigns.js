const express = require('express');
const campaignRouter = express.Router();
const Campaign = require('../models/campaign');
const Character = require('../models/character');
const User = require('../models/user');


//Index
campaignRouter.get('/', (req, res) => {
    user=req.session.currentUser;
    Campaign.find({$or: [{dm: user._id }, {players: {$elemMatch: {playerId: user._id}}}]}).populate('players.playerId').exec((error, foundCamp) => {
            console.log(foundCamp);
            console.log(user._id);
            res.render('campaigns/index.ejs', {camps: foundCamp, user: user});
    });
});


//New
campaignRouter.get('/new', (req, res) => {
    res.render('campaigns/new.ejs', {user: req.session.currentUser});
})


//Delete
campaignRouter.delete('/:id', (req, res) => {
    Campaign.findByIdAndDelete(req.params.id, (error, delCamp) => {
        //Find the users apart of the deleted campaign 
        User.find({campaigns: delCamp._id}, (error, foundUsers) => {
            //remove the deleted campaign from each users campaign list
            foundUsers.forEach( (user, i) => {
                user.campaigns = user.campaigns.filter( (camp, i) => {
                    if(!camp.equals(delCamp._id)){
                        return camp;
                    }
                }); //filter
                user.save();
                
            }); //forEach()
            
        }); //User
        //Look for Chracters in the deleted campaign
        Character.find({campaign: delCamp._id}, (err, foundChar) => {
            //For each Character in the campaign remove the campaign
            foundChar.forEach( (char, i) => {                
                char.campaign = char.campaign.filter( (camp, i) => {
                    if(!camp.equals(delCamp._id)) {
                        return camp;
                    }
                }); //Filter
                char.save();
            });//forEach()
            
        });//Character


        res.redirect("/campaigns");
    }); //Campaign
}); //Router


//Update

//Create
campaignRouter.post('/', (req, res) => {
    Campaign.create(req.body, (error, createdCampaign) => {
        User.findById(req.session.currentUser._id, (error, user) => {
            user.campaigns.push(createdCampaign._id);
            user.save();

        });
        res.redirect(`/campaigns/${createdCampaign._id}`);
    });
});

campaignRouter.post('/sendRequest', (req, res) => {
    User.findOne({username: req.body.username}, (error, foundUser) => {
        let tempRequest = {};
        tempRequest.invType = 'campaign';
        tempRequest.by = req.session.currentUser._id;
        tempRequest.for = req.body.id;
    
        foundUser.requests.push(tempRequest);
        foundUser.save();

        res.redirect(`/campaigns/${req.body.id}`);
    });
});
//Edit

//Show
campaignRouter.get('/:id', (req, res) => {
    Campaign.findById(req.params.id, (error, foundCamp) => {
        User.findById(req.session.currentUser._id).populate('characters').exec((err, user) => {
            res.render('campaigns/show.ejs', {camp: foundCamp, user: user});
        });
    });
});


module.exports = campaignRouter;