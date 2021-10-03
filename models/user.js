// Dependencies 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;



// User Schema
const userSchema = Schema({
  email: { type: String, unique: true, required: true },
  username: {type: String, unique: true, required: true },
  password: { type: String, required: true },
  avatar: String,
  characters: [{type: Schema.Types.ObjectId, ref: 'Character'}],
  campaigns: [{type: Schema.Types.ObjectId, ref: 'Campaign'}]
});

// User Model
const User = mongoose.model('User', userSchema);

// Export User Model
module.exports = User;