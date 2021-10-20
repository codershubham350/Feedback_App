const passport = require("passport");

module.exports = (app) => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );
  // google has defined scopes like scope:['profile', 'email', 'contactList', 'image'.. etc]

  // below user have the code to authenticate and with that code we are now accessing users profile
  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      res.redirect("/surveys");
      // redirect function responds back to the browser and says got to /surveys
    }
  );

  app.get("/api/logout", (req, res) => {
    req.logout(); // it will remove the id from the user
    res.redirect("/");
  });

  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
    // res.send(req.session);
    // data that passport is attempting to store inside a cookie, when user makes request
    // cookie data is passed to passport creates a session and user data is deserialized to get the specific user associated with this ID
  });
};
