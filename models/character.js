const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const characterSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: "User"},
    campaign: [{type: Schema.Types.ObjectId, ref: 'Campaign'}],
    name: String,
    race: String,
    class: String,
    level: {type: Number, min:1},
    hp: {cur: Number, max: Number},
    ac: Number,
    initiative: Number,
    insp: Boolean,
    stats: {str: {val: {type:Number, min:1, max:20},
                        mod: Number, save:{prof: String, val: Number}},
            dex: {val: {type:Number, min:1, max:20}, 
                        mod: Number, save:{prof: String, val: Number}},
            con: {val: {type:Number, min:1, max:20}, 
                        mod: Number, save:{prof: String, val: Number}},
            int: {val: {type:Number, min:1, max:20}, 
                        mod: Number, save:{prof: String, val: Number}},
            wis: {val: {type:Number, min:1, max:20}, 
                        mod: Number, save:{prof: String, val: Number}},
            cha: {val: {type:Number, min:1, max:20}, 
                        mod: Number, save:{prof: String, val: Number}}
    },
    skills: {acrobatics: {prof: String, mod: String, bonus: Number},
             animalHandling: {prof: String, mod: String, bonus: Number},
             arcana: {prof: String, mod: String, bonus: Number},
             athletics: {prof: String, mod: String, bonus: Number},
             deception: {prof: String, mod: String, bonus: Number},
             history: {prof: String, mod: String, bonus: Number},
             insight: {prof: String, mod: String, bonus: Number},
             intimidation: {prof: String, mod: String, bonus: Number},
             investigation: {prof: String, mod: String, bonus: Number},
             medicine: {prof: String, mod: String, bonus: Number},
             nature: {prof: String, mod: String, bonus: Number},
             perception: {prof: String, mod: String, bonus: Number},
             performance: {prof: String, mod: String, bonus: Number},
             persuasion: {prof: String, mod: String, bonus: Number},
             religion: {prof: String, mod: String, bonus: Number},
             slightOfHand: {prof: String, mod: String, bonus: Number},
             stealth: {prof: String, mod: String, bonus: Number},
             survival: {prof: String, mod: String, bonus: Number},
    },
    feats: [{name: String, description: String}],
    rp: {alignment: String,
         background: String,
         notes: [{title: String, note: String}]
    }
});

const Character = mongoose.model("Character", characterSchema);

module.exports = Character;