const passport = require("passport");
const mongoose = require("mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");

const User = mongoose.model("users"); // pulling out Schma from mongoose
// here we are passing one argument to mongoose which means we are fetching something from mongoose

passport.serializeUser((user, done) => {
  done(null, user.id); // here user.id is the ID automatically generated by mongo whereas profile.id is our google ID
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

// when using GoogleStrategy and later authenticating with passport, passport knows that if we use
//passport.authenticate("google") it means passport needs to call GoogleStrategy
// and no other defined strategy due to some already predefined methods inside passport
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback", // Redirecting user to this address once he grants permission to acess his id
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        // we already have a record with the given profile ID
        return done(null, existingUser);
        // done() means we have completed creating our user now we can get back to auth process
        // done() takes two parameters-: null- means everything went well, existingUser- means here the user created/found
      }
      // we don't have a record with this ID, make a new record!
      const user = await new User({ googleId: profile.id }).save(); // initial user being created
      done(null, user); // user got back from databse with might some additional changes
    }
  )
);

// console.log("access Token:", accessToken); // accessToken allows Google to provide our App access user's data
//       console.log("refresh Token:", refreshToken); // refreshToken is required when after some amount of time our accessToken get's expired and we want to update our Token
//       console.log("profile:", profile); // profile has all out data
