const express = require('express');
const { Resend } = require('resend');

const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/', async (req, res) => {
  try {
    const { name, email, company, phone, message } = req.body;

    console.log('New form submission:', req.body);

    await resend.emails.send({
      from: 'Future Mobile <agarwaldarsh2007@gmail.com>',
      to: 'agarwaldarsh2007@gmail.com',
      reply_to: email,
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