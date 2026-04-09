require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const emailjs = require('emailjs-com'); // server-compatible

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public folder
app.use(express.static('../public'));

// Parse JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// POST endpoint to send email
app.post('/send-email', async (req, res) => {
  const { user_name, user_email, message } = req.body;

  emailjs.init(process.env.EMAILJS_USER_ID);

  try {
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      { user_name, user_email, message }
    );
    res.json({ success: true });
  } catch (err) {
    console.error('EmailJS Error:', err);
    res.status(500).json({ error: err.toString() });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));