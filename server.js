require("dotenv").config();

const express = require('express');
const methodOverride = require('method-override');
const mongoose = require("mongoose");
const app = express();
const db = mongoose.connection;


const port = process.env.port || 3000;

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

db.on('error', (err) => console.log(err.message + ' is mongod not running?'));
db.on('connected', () => console.log('Mongo Connected'));
db.on('disconnected', () => console.log('mongo disconnected'));


app.use(express.static('public'));

//=================================================================
//                            MiddleWare
//==================================================================

// populates req.body with parsed info from forms
// extended: false - does not allow nested objects in query strings
app.use(express.urlencoded({ extended: false })); 


// returns middleware that only parses JSON - may or may not need it depending on your project
//app.use(express.json());

app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form


//=================================================================
//                            Routes
//==================================================================

app.get('/', (req, res) => {
    res.send('hello world');
});



app.listen(port, () => console.log(`Server is listening... on port: ${port}`));