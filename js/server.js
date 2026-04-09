require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const emailjs = require('emailjs-com'); // or server-side compatible version

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // serve your HTML/JS files

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
    console.error(err);
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));