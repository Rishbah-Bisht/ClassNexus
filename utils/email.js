const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendCustomEmail({ to, name, id, role }) {
  // Transporter setup (Gmail example)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Load email from .env
      pass: process.env.EMAIL_PASS  // Load app password from .env
    }
  });

  // Customize email subject and body based on the role
  const subject = role === 'teacher' ? 'Your Teacher ID - Welcome!' : 'Your Student ID - Welcome!';
  
  const body = role === 'teacher'
    ? `Dear ${name},\n\nWelcome to the faculty! In over Institue \nYour Teacher ID is ${id}.\nWe are glad to have you onboard.\n\nPlease Sing Up With this Teacher ID. Registar Your Self \n\nBest regards,\nUniversity Admin`
    : `Dear ${name},\n\nWelcome! In over Institue \n
    Your Student ID is ${id}.\nPlease keep it safe as it will be used throughout your university journey.\n\nPlease Sing Up With this Student ID. Registar Your Self \n\nBest regards,\nUniversity Admin`;

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Sender's email
    to,                           // Recipient email
    subject,                      // Subject based on role
    text: body                    // Message body
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = sendCustomEmail;
