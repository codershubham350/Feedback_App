email = 'a@a.com';
choice = 'yes' || 'no';

Survey.updateOne(
  {
    id: surveyId,
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
  }
);

// CLI shortcuts
Survey.find({ title: 'Checking Last Responded Date!!' }).then(console.log);
Survey.find({ yes: 0 }).then(console.log);
