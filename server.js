const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors({
  origin: 'https://snazzy-cassata-f779f1.netlify.app/',
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json());

app.post('/api/appointment', async (req, res) => {
  const data = req.body;
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Or your provider's SMTP host
    port: 465,
    secure: true, // true for port 465, false for 587
    auth: {
      user: 'info@desireaccounting.com.au',
      pass: 'mwxpvesxjnnspxas' // this must be the correct email password or SMTP/app password
  }
});

const adminMailOptions = {
    from: 'info@desireaccounting.com.au',
    to: 'info@desireaccounting.com.au', // replace with your receiving email
    subject: 'New Appointment Request',
    text: `
      Full Name: ${data.name}
      Contact Number: ${data.contact}
      Email: ${data.email}
      Address: ${data.address}
      Preferred Date: ${data.date}
      Preferred Time: ${data.time}
      Appointment Type: ${data.type}
      Message: ${data.message}
    `
  };

  const clientMailOptions = {
    from: 'info@desireaccounting.com.au',
    to: data.email,
    subject: 'Appointment Request Received',
    text: `Dear ${data.name},

This is to confirm that we have received your appointment request. Our team will review your request and contact you as soon as possible. Please be advised, this email does not confirm the appointment yet. Our team will contact you and finalise your request including date and time.

Regards,
Practice Manager
Desire Accounting Associates`
  };

  try {
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(clientMailOptions);
    res.status(200).send('Success');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Email sending failed');
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

const path = require('path');
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });