const _ = require('lodash');
const { Path } = require('path-parser');
const { URL } = require('url'); // default library in node.js
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys'); // for Testing the application

module.exports = (app) => {
  app.get('/api/surveys', requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false,
    });

    res.send(surveys);
  });

  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for your valuable Feedback 😇 !');
  });

  app.post('/api/surveys/webhooks', (req, res) => {
    const p = new Path('/api/surveys/:surveyId/:choice');

    _.chain(req.body)
      .map(({ email, url }) => {
        const match = p.test(new URL(url).pathname);
        if (match) {
          return {
            email,
            surveyId: match.surveyId,
            choice: match.choice,
          };
        }
      })
      .compact()
      .uniqBy('email', 'surveyId')
      .each(({ surveyId, email, choice }) => {
        Survey.updateOne(
          {
            _id: surveyId, // _id used to declare ID on Mongo
            recipients: {
              // go to all the sub-document elemetns and find which matches the below criteria
              $elemMatch: { email: email, responded: false },
            },
          }, // once the object we found in updateOne() then update the object based on below data provided in object
          {
            // mongo operator-> will check for choice either 'yes' or 'no' and increment by 1
            $inc: { [choice]: 1 }, // key interpolition
            // look for only recipients and '$' indicates just one recipient and look for responded property and set it to true
            $set: { 'recipients.$.responded': true },
            lastResponded: new Date(),
          }
        ).exec(); // execute the updated query to database
      })
      .value(); // returns chain value(used in lodash library)

    //console.log(events);

    res.send({}); // here we are updating SendGrid that we got successfull response
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map((email) => ({
        email: email.trim(),
      })), // here we are splitting 'emails' with comma and converting into array , then we are converting emails from 'string' to 'object'
      _user: req.user.id, // already available on mongoose model
      dateSent: Date.now(),
    });

    // Great place to send an E-mail!
    const mailer = new Mailer(survey, surveyTemplate(survey));
    try {
      await mailer.send();
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();

      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};

/*
// will return only events object and no other data like: undefined, null
const compactEvents = _.compact(events);
// will return user with 'email id' and 'survey id' and restrict user to vote multiple times on the same survey.
const uniqueEvents = _.uniqBy(compactEvents, 'email', 'surveyId');
*/
