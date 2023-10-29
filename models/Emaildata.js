const mongoose = require('mongoose');

const parkingSchema = new mongoose.Schema({
  email: String,
  scheduledTime: String,
  subject: String,
  body: String,
  status: {
    type: String,
    enum: ['scheduled', 'sent', 'failed'],
    default: 'scheduled',
  },
}, { versionKey: false });

const EmailModel = mongoose.model('emaildata', parkingSchema);

module.exports = EmailModel;
