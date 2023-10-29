// agenda.js
const Agenda = require('agenda');
const mongoose = require('mongoose');
const { sendEmail } = require('./emailService');

const agenda = new Agenda();

// Set up Agenda to use your MongoDB connection
const initializeAgenda = async () => {
    const db = await mongoose.connection;
    agenda.mongo(db);
    await agenda.start();
};
agenda.define('send email', async (job) => {
    console.log(job.attrs.data);
    await sendEmail(job.attrs.data); // Call the sendEmail function with the job data
});


module.exports = { agenda, initializeAgenda };
