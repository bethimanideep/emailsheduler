const express = require('express');
const EmailModel = require('../models/Emaildata');
const { parse, format } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');
const nodemailer = require('nodemailer');
const { initializeAgenda, agenda } = require('../agenda');
const { sendEmail } = require('../emailService');
const router = express.Router();

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use the email service you prefer
  auth: {
    user: process.env.USER_EMAIL, // Your email address
    pass: process.env.USER_PASS, // Your email password (or an app-specific password)
  },
});

router.post('/schedule-email', async (req, res) => {
  try {
    await initializeAgenda(); // Initialize Agenda

    const timeZone = 'Asia/Kolkata';
    const { scheduledTime, email } = req.body;

    if (email === '') return res.json({ msg: 'Enter Email To Send' });

    if (scheduledTime === 'now') {
      let data = new EmailModel(req.body);
      let dbdata = await data.save();
      await sendEmail(dbdata);
      res.status(201).json({ message: 'Email Sent successfully' });
    } else {
      const parsedDate = parse(scheduledTime, 'MMMM dd, yyyy, h:mm a', new Date(), {
        timeZone,
      });

      if (parsedDate.toString() === 'Invalid Date') {
        return res.json({ msg: 'Invalid Time Format', scheduledTime });
      }

      let data = new EmailModel(req.body);
      let dbdata = await data.save();

      const parsedDateWithTimeZone = utcToZonedTime(parsedDate, timeZone);
      const formattedDate = format(parsedDateWithTimeZone, 'yyyy-MM-dd HH:mm:ss', {
        timeZone,
      });

      // Schedule the "send email" job at the specified time
      agenda.schedule(formattedDate, 'send email', dbdata);

      res.status(201).json({ message: 'Email scheduled successfully' });
    }
  } catch (error) {
    console.log('Error: ' + error);
    res.status(500).json({ error: 'Failed to schedule email' });
  }
});









module.exports = { router, sendEmail };