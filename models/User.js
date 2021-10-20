const mongoose = require('mongoose');
const { Schema } = mongoose;

// By default MongoDB has a property to store different values inside the database
// But when we are using mongoose we loose that default property of MongoDB, so when we use
// Schema it means we need to update our database ahead of time what all properties we need from user

const userSchema = new Schema({
  googleId: String,
  credits: {
    type: Number,
    default: 0,
  },
});

mongoose.model('users', userSchema);

// Here we are passing two arguments which means we are loading something fom mongoose
