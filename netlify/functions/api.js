const serverless = require('serverless-http');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const passUserToView = require('../../middleware/pass-to-view.js')
const isSignedIn = require('../../middleware/is-signed-in.js')


const authController = require('../../controllers/auth.js');
const listingsController = require('../../controllers/listings.js');

const path = require('path'); 

//Middleware 
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(express.static("public"));

app.use(
 session({
   secret: process.env.SESSION_SECRET,
   resave: false,
   saveUninitialized: true,
   store: MongoStore.create({
     mongoUrl: process.env.MONGODB_URI
   })
 })
);


app.use(passUserToView);

// server.js
app.use((req, res, next) => {
  if (req.session.message) {
    res.locals.message = req.session.message;
    req.session.message = null;
  }
  next();
});


//Routes
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect(`listings`);
  } else {
    res.render('index.ejs');
  }
});



app.use('/auth', authController);
app.use(isSignedIn);
app.use('/listings', listingsController);

app.get("*", function (req, res) {
  res.render("404.ejs");
});



//Server 

const connect = async () => {
   try {
       await mongoose.connect(process.env.MONGODB_URI)
       console.log("database connection established")

       }
   catch (error) {
  console.log(error);
   } }


connect()

module.exports.handler = serverless(app)

