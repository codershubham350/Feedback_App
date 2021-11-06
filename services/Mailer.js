const sendgrid = require('sendgrid');
const helper = sendgrid.mail;
const keys = require('../config/keys');

class Mailer extends helper.Mail {
  // as we have defined const mailer = new Mailer(survey, surveyTemplate(survey)); inside surveyRoutes.js
  // so the 'new Mailer(...)' will invoke the constructor() we have defined in Mailer.js
  constructor({ subject, recipients }, content) {
    super();

    //this.from_email = new helper.Email('no-reply@emaily.com');
    this.sgApi = sendgrid(keys.sendGridKey);
    this.from_email = new helper.Email('shubhamsaxena350@gmail.com');
    this.subject = subject;
    this.body = new helper.Content('text/html', content);
    this.recipients = this.formatAddresses(recipients);

    this.addContent(this.body); // this.addContent() is a property on the helper.Mail
    this.addClickTracking();
    this.addRecipients();
  }

  // turning recipients into helper email, this.recipients is an array of helper functions, now we have to take
  // the list of helper.Email(email) object and add them to the Mailer
  formatAddresses(recipients) {
    return recipients.map(({ email }) => {
      return new helper.Email(email);
    });
  }

  addClickTracking() {
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);

    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }

  addRecipients() {
    const personalize = new helper.Personalization();

    this.recipients.forEach((recipient) => {
      personalize.addTo(recipient);
    });
    this.addPersonalization(personalize);
  }

  async send() {
    const request = this.sgApi.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: this.toJSON(),
    });

    const response = await this.sgApi.API(request);
    return response;
  }
}

module.exports = Mailer;
