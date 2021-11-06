const mongoose = require('mongoose');
const { Schema } = mongoose;
const RecipientSchema = require('./Recipient');

const surveySchema = new Schema({
  title: String,
  body: String,
  subject: String,
  recipients: [RecipientSchema], // (Subdocument)an array containing list of string(which is the email address of the customers seperated by comma)
  yes: {
    type: Number,
    default: 0,
  },
  no: {
    type: Number,
    default: 0,
  },

  // surveySchema belongs to a specific user, _user is a reference field
  _user: {
    type: Schema.Types.ObjectId, // Id of the user who owns this survey
    ref: 'User', // ref here we are using from 'Users' collection
  },

  dateSent: Date,
  lastResponded: Date,
});

mongoose.model('surveys', surveySchema);
