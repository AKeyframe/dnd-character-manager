require("dotenv").config();

const express = require('express');
const methodOverride = require('method-override');
const mongoose = require("mongoose");
const app = express();
const db = mongoose.connection;
const session = require('express-session');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

db.on('error', (err) => console.log(err.message + ' is mongod not running?'));
db.on('connected', () => console.log('Mongo Connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

//Require Controllers
const userController = require("./controllers/users");
const sessionsController = require('./controllers/sessions');

const characterController = require('./controllers/characters');
const User = require("./models/user");
const Character = require('./models/character');


app.use(express.static('public'));

//=================================================================
//                            MiddleWare
//==================================================================

// populates req.body with parsed info from forms
// extended: false - does not allow nested objects in query strings
app.use(express.urlencoded({ extended: false })); 
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form

// returns middleware that only parses JSON - may or may not need it depending on your project
//app.use(express.json());

app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false
    }));

app.use( (req, res, next) => {
  res.locals.currentUser = req.session.currentUser;
  next();
});


app.use('/users', userController);
app.use('/sessions', sessionsController);
app.use('/characters', characterController);
//===============================================================
//                            Routes
//===============================================================

app.get("/", (req, res) => {
  console.log(req.session.currentUser);
  
  if(!req.session.currentUser){
    res.render('plsLogin.ejs');
  }
	else {
    User.findById(req.session.currentUser._id, (error, currUser) => {
      
      res.render('index.ejs', {user: currUser});
    });
  }
});

app.get('/register', (req, res) => {
  res.render('register.ejs');
});


app.listen(PORT, () => console.log(`Server is listening... on port: ${PORT}`));