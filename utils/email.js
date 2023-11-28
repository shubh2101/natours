const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    //Create a transporter
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //define email options
  const mailOptions = {
    from: 'Shubham singh <shubham@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //actually send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
