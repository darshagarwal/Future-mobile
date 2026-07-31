const express = require('express');
const cors = require('cors');
require('dotenv').config();

const contactRoute = require('./routes/contact');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/contact', contactRoute);

const PORT = process.env.PORT || 5050;

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    emailUser: process.env.EMAIL_USER || null,
    hasPass: !!process.env.EMAIL_PASS
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});