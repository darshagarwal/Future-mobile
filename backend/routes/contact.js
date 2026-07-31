const express = require('express');
const nodemailer = require('nodemailer');
const dns = require('dns');

const router = express.Router();

console.log('USING SMTP PORT 587');



const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  family: 4, // force IPv4
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  lookup(hostname, options, callback) {
    return dns.lookup(hostname, { family: 4 }, callback);
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, company, phone, message } = req.body;

    console.log('New form submission:', req.body);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Website Enquiry from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    console.log('Email sent successfully');

    res.json({
      success: true,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('MAIL ERROR:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;