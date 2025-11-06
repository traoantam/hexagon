const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });

// Initialize Firebase Admin
admin.initializeApp();

// Configure nodemailer with your email service
// You can use Gmail, SendGrid, Mailgun, or any SMTP service
const transporter = nodemailer.createTransport({
  service: 'gmail', // Change to your email service
  auth: {
    user: functions.config().email.user,
    // Your email password or app password
    pass: functions.config().email.password,
  },
});

// Cloud Function to handle contact form submissions
exports.sendContactEmail = functions.https.onRequest((req, res) => {
  // Handle CORS preflight (OPTIONS request)
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    return res.status(204).send('');
  }

  return cors(req, res, async () => {
    // Only allow POST requests
    if (req.method !== 'POST') {
      res.set('Access-Control-Allow-Origin', '*');
      return res.status(405).json({
        success: false,
        error: 'Method not allowed',
        message: 'Only POST requests are allowed',
      });
    }

    try {
      const { name, email, subject, message } = req.body;

      // Validate required fields
      if (!name || !email || !subject || !message) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          message: 'Please fill in all required fields',
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format',
          message: 'Please enter a valid email address',
        });
      }

      // Email content
      const mailOptions = {
        from: functions.config().email.user,
        // Recipient email
        to: functions.config().email.to || functions.config().email.user,
        replyTo: email, // Reply to the sender's email
        subject: `Contact Form: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
        text: `
          New Contact Form Submission
          
          Name: ${name}
          Email: ${email}
          Subject: ${subject}
          
          Message:
          ${message}
        `,
      };

      // Send email
      await transporter.sendMail(mailOptions);

      // Optionally save to Firestore
      try {
        await admin.firestore().collection('contact_submissions').add({
          name,
          email,
          subject,
          message,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          status: 'sent',
        });
      } catch (firestoreError) {
        // Log error but don't fail the request if Firestore fails
        console.error('Firestore error:', firestoreError);
      }

      return res.status(200).json({
        success: true,
        message: 'Email sent successfully!',
      });
    } catch (error) {
      console.error('Error sending email:', error);
      // Ensure CORS headers are set even on error
      res.set('Access-Control-Allow-Origin', '*');
      return res.status(500).json({
        success: false,
        error: 'Failed to send email',
        message: error.message || 'An unexpected error occurred',
      });
    }
  });
});
