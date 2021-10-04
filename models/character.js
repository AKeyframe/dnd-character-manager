const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const characterSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: "User"},
    games: {type: Schema.Types.ObjectId, ref: 'Campaign'},
    name: String,
    race: String,
    class: String
});

const Character = mongoose.model("Character", characterSchema);

module.exports = Character;