const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campaignSchema = new Schema({
    dm: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    players: [{playerId: {type: Schema.Types.ObjectId, ref: 'User'}, character: {type: Schema.Types.ObjectId, ref: 'Character'}}],
    name: String,
});

const Campaign = mongoose.model("Campaign", campaignSchema);

module.exports = Campaign;