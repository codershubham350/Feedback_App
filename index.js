const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
require("./routes/authRoutes");
const keys = require("./config/keys");
require("./models/User");
require("./services/passport"); //passport.js is not returning anything so we just use require, instead of assigning its value to a variable

// connecting mongoose with out database
mongoose.connect(keys.mongoURI);

const app = express();

// Middleware

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, //30 days validity
    keys: [keys.cookieKey],
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Here require("./routes/authRoutes") is returning a function which will immediately invokes
// an arrow fuction where we passed the value of app
require("./routes/authRoutes")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);

/*const express = require("express");
const app = express();
//  app is used to setup configuration which will listen to request that is being
//  routed to Express and then route those request on differenr Route Handlers

//Route Handler
app.get("/", (req, res) => {
  res.send({ by: "buddy" });
});

// env-> Whenever Heroku runs it used to inject environment variables, environment variables are variables that are set
//in the underlying runtime that Node is running on top-of and escentially no Herok's opportunity to pass us runtime configuration
// or some configuration which Heroku wants to tell us after we had deployed our application
const PORT = process.env.PORT || 5000;
// Want's to listen incoming traffic at PORT or if we are using locally then localhost: 5000
app.listen(PORT);

// Server side importing
// const express = require("express");
// Common JS modules implemented in Node.js in requiring/sharing code in different file

// Front-end side importing
// import express from "express";
//It uses different module system called ES2015 modules */
