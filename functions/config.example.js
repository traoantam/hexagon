/**
 * Example configuration file
 *
 * DO NOT commit actual credentials to version control!
 * Use Firebase Functions config instead:
 *
 * firebase functions:config:set email.user="your-email@gmail.com"
 * firebase functions:config:set email.password="your-app-password"
 * firebase functions:config:set email.to="recipient@example.com"
 *
 * Or use environment variables for better security:
 * firebase functions:secrets:set EMAIL_USER
 * firebase functions:secrets:set EMAIL_PASSWORD
 */

module.exports = {
  email: {
    // Your sending email address
    user: 'your-email@gmail.com',

    // For Gmail: Use App Password (not your regular password)
    // For SendGrid: Use API key
    // For other services: Use appropriate credentials
    password: 'your-app-password-or-api-key',

    // Email address to receive contact form submissions
    to: 'recipient@example.com',
  },

  // Alternative: SendGrid configuration
  sendgrid: {
    api_key: 'your-sendgrid-api-key',
  },

  // Alternative: SMTP configuration
  smtp: {
    host: 'smtp.example.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'your-smtp-user',
      pass: 'your-smtp-password',
    },
  },
};
