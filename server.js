import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/contact', async (req, res) => {
  const { name, email, query } = req.body;

  if (!name || !email || !query) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // 1. Email to Pranit with query details
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: `[Portfolio] New Message from ${name}`,
      html: `
        <h3>New Query from Portfolio</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Query:</strong></p>
        <p style="padding: 12px; border-left: 4px solid #7DD3FC; background: #f9f9f9; color: #333;">${query}</p>
      `,
    });

    // 2. Auto-reply to the sender
    await transporter.sendMail({
      from: `"Pranit Kumar" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thank you for connecting, ${name}!`,
      html: `
        <div style="font-family: sans-serif; color: #1a1a1a;">
          <p>Hi ${name},</p>
          <p>Thank you for reaching out! I've received your message and will get back to you as soon as I can.</p>
          <p>Best regards,<br/><strong>Pranit Kumar</strong><br/>AI Engineer & Full Stack Developer</p>
        </div>
      `,
    });

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
