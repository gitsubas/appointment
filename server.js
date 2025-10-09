// Load environment variables from .env file in development
try {
  require('dotenv').config();
} catch (error) {
  console.log('dotenv not available, using system environment variables');
}

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors({
  origin: [
    'https://snazzy-cassata-f779f1.netlify.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5500',  // For Live Server extension
    'http://127.0.0.1:5500'   // For Live Server extension
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json());

app.post('/api/appointment', async (req, res) => {
  console.log('Received appointment request:', req.body);
  
  const data = req.body;
  
  // Validate required fields
  if (!data.name || !data.email || !data.contact) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  console.log('SMTP Config:', {
    user: process.env.SMTP_USER ? 'Set' : 'Missing',
    pass: process.env.SMTP_PASS ? 'Set' : 'Missing'
  });

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
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
    console.log('Attempting to send admin email...');
    await transporter.sendMail(adminMailOptions);
    console.log('Admin email sent successfully');
    
    console.log('Attempting to send client email...');
    await transporter.sendMail(clientMailOptions);
    console.log('Client email sent successfully');
    
    res.status(200).send('Success');
  } catch (error) {
    console.error('Detailed email error:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    res.status(500).json({ 
      error: 'Email sending failed', 
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const path = require('path');
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
