require('dotenv').config()
// Requiring necessary npm packages
var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
// Requiring passport as we've configured it
var passport = require("./config/passport");
var firebase=require("firebase");

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 3001;
var db = require("./models");

// Creating express app and configuring middleware needed for authentication
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
// We need to use sessions to keep track of our user's login status
app.use(session({ 
  secret: "keyboard cat", 
  resave: true, 
  saveUninitialized: true, 
 }));
app.use(passport.initialize());
app.use(passport.session());

// CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-token,");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});
// END CORS

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

//Firebase
var config={
  apiKey:process.env.API_KEY,
  authDomain: "testu-cb1cc.firebaseapp.com",
  databaseURL: "https://testu-cb1cc.firebaseio.com",
  projectId: "testu-cb1cc",
  storageBucket: "testu-cb1cc.appspot.com",
  messagingSenderId: "965313007323"
};
firebase.initializeApp(config);



// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});
