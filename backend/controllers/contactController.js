const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendContactMail = async (req, res) => {
  try {
    const { name, email, company, phone, message } = req.body;

    console.log('FORM RECEIVED:', req.body);

    const result = await resend.emails.send({
      from: 'Future Mobile <onboarding@resend.dev>',
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

    console.log('RESEND RESULT:', result);

    res.json({
      success: true,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('RESEND ERROR:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};