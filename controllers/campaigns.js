const express = require('express');
const campaignRouter = express.Router();
const Campaign = require('../models/campaign');
const Character = require('../models/character');
const User = require('../models/user');


//Index
campaignRouter.get('/', (req, res) => {
    user=req.session.currentUser;
    Campaign.find({$or: [{dm: user._id }, {pcs: user._id }]},
        (error, foundCamp) => {
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
        User.findById(req.session.currentUser._id, (error, user) => {
            console.log(user);
            user.campaigns = user.campaigns.filter( (camp, i) => {
                if(!camp.equals(delCamp._id)){
                    console.log(`added char: ${camp}`);
                    return camp;
                }
            });
            user.save();
            console.log(user);
        });
        
        res.redirect("/campaigns");
    });
});


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
//Edit

//Show
campaignRouter.get('/:id', (req, res) => {
    Campaign.findById(req.params.id, (error, foundCamp) => {
        res.render('campaigns/show.ejs', {camp: foundCamp});
    });
});


module.exports = campaignRouter;