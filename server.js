const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/send-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email service (e.g., Gmail, Outlook, or SMTP server)
      auth: {
        user: 'shanebrillantes45@gmail.com',
        pass: 'bdci sjjt avaf hgpu', // Use an app password if using Gmail
      },
    });

    const mailOptions = {
      from: 'shanebrillantes45@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
