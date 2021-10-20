const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = (app) => {
  // in express middlewares we can pass as many arbitary arguments as we want, all express need is
  // any one function must process the request and send back response to the user
  app.post('/api/stripe', requireLogin, async (req, res) => {
    //console.log(req.body); // only looking for body parser;

    const charge = await stripe.charges.create({
      amount: 500,
      currency: 'inr',
      description: '$5 for 5 credits',
      source: req.body.id,
    });

    req.user.credits += 5;
    const user = await req.user.save();

    res.send(user);
  });
};
