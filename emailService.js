// emailService.js
const nodemailer = require("nodemailer");
const EmailModel = require("./models/Emaildata");

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASS
  }
});

async function sendEmail(data) {
    try {
  
      let response = await transporter.sendMail({
        from: process.env.USER_EMAIL,
        to: data.email,
        subject: data.subject,
        text: data.body,
      });
  
      if (response.accepted[0] == data.email) {
  
        const dbdata = await EmailModel.findByIdAndUpdate(
          { _id: data._id },
          { status: "sent" },
          { new: true }
        ).exec();
        console.log({ msg: "Status Updated To Sent", data: dbdata });
  
      } else {
  
        const dbdata = await EmailModel.findByIdAndUpdate(
          { _id: data._id },
          { status: "failed" },
          { new: true }
        ).exec();
        console.log({ msg: "faileddata", data: dbdata });
  
      }
      return response
  
    } catch (error) {
      if (error.message == "No recipients defined") {
        console.error({ msg: "Invalid Email", Email: data.email, Error: error.message });
      } else {
        console.log("Error in Sending Email" + error);
      }
    }
  }

module.exports = { sendEmail };
