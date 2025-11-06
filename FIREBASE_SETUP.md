# Firebase Email Setup Guide

This guide will help you set up Firebase Cloud Functions to handle email sending from your contact form.

## Prerequisites

1. A Firebase account (free tier is sufficient)
2. **Node.js installed (version 20 or higher)** - Firebase CLI requires Node.js >=20.0.0
   - If using nvm: `nvm install 20 && nvm use 20`
   - Verify: `node --version` should show v20.x.x or higher
3. Firebase CLI installed (`npm install -g firebase-tools`)

## Step 1: Initialize Firebase Project

1. **Login to Firebase CLI:**

   ```bash
   firebase login
   ```

2. **Initialize Firebase in your project:**

   ```bash
   firebase init
   ```

   Select the following options:

   - ✅ Functions: Configure a Cloud Functions directory
   - ✅ Hosting: Configure files for Firebase Hosting (optional, if you want to host the site)
   - When asked about existing functions directory, choose `functions` (or create new)
   - Choose your Firebase project or create a new one
   - Select JavaScript as the language
   - Install dependencies: Yes

3. **Update `.firebaserc`:**
   ```json
   {
     "projects": {
       "default": "your-actual-firebase-project-id"
     }
   }
   ```

## Step 2: Configure Email Service

You have several options for sending emails:

### Option A: Gmail (Easiest for testing)

1. **Enable App Password:**

   - Go to your Google Account settings
   - Enable 2-Step Verification
   - Generate an App Password for "Mail"
   - Copy the 16-character password

2. **Set Firebase config:**
   ```bash
   firebase functions:config:set email.user="your-email@gmail.com"
   firebase functions:config:set email.password="your-app-password"
   firebase functions:config:set email.to="recipient@example.com"
   ```

### Option B: SendGrid (Recommended for production)

1. **Create SendGrid account** and get API key

2. **Update `functions/index.js`:**
   Replace the nodemailer transport configuration:

   ```javascript
   const transporter = nodemailer.createTransport({
     host: 'smtp.sendgrid.net',
     port: 587,
     auth: {
       user: 'apikey',
       pass: functions.config().sendgrid.api_key,
     },
   });
   ```

3. **Set Firebase config:**
   ```bash
   firebase functions:config:set sendgrid.api_key="your-sendgrid-api-key"
   firebase functions:config:set email.to="recipient@example.com"
   ```

### Option C: Other SMTP Services

Update the transporter configuration in `functions/index.js` with your SMTP details:

- Mailgun
- AWS SES
- Any other SMTP service

## Step 3: Deploy Firebase Functions

1. **Install dependencies:**

   ```bash
   cd functions
   npm install
   cd ..
   ```

2. **Deploy the function:**

   ```bash
   firebase deploy --only functions
   ```

3. **Get your function URL:**
   After deployment, Firebase will show you the function URL. It will look like:
   ```
   https://YOUR-REGION-YOUR-PROJECT-ID.cloudfunctions.net/sendContactEmail
   ```

## Step 4: Update Frontend Configuration

1. **Update `static/js/contact-form.js`:**
   Replace `YOUR-REGION-YOUR-PROJECT-ID` with your actual Firebase Function URL:

   ```javascript
   const FIREBASE_FUNCTION_URL =
     'https://YOUR-REGION-YOUR-PROJECT-ID.cloudfunctions.net/sendContactEmail';
   ```

   Or better yet, add it to your Hugo config file and reference it dynamically.

2. **Rebuild your Hugo site:**
   ```bash
   hugo
   ```

## Step 5: Test the Contact Form

1. Visit your contact page
2. Fill out the form
3. Submit and check:
   - Success message appears
   - Email is received at the configured recipient address
   - Check Firebase Functions logs: `firebase functions:log`

## Troubleshooting

### Function not found

- Ensure the function is deployed: `firebase deploy --only functions`
- Check the function URL matches exactly in `contact-form.js`

### Email not sending

- Check Firebase Functions logs: `firebase functions:log`
- Verify email credentials are correct
- For Gmail, ensure App Password is used (not regular password)
- Check spam folder

### CORS errors

- The function already includes CORS handling
- Ensure your domain is allowed in Firebase Hosting settings

### Form not submitting

- Open browser console to check for JavaScript errors
- Verify `contact-form.js` is loaded (check Network tab)
- Ensure form has `id="contact-form"`

## Optional: Store Submissions in Firestore

The function already saves submissions to Firestore. To view them:

1. Go to Firebase Console > Firestore Database
2. Check the `contact_submissions` collection

## Security Considerations

1. **Rate Limiting:** Consider adding rate limiting to prevent spam
2. **Input Validation:** Already implemented, but you can add more strict validation
3. **ReCAPTCHA:** Consider adding Google reCAPTCHA to prevent bots
4. **Environment Variables:** Keep sensitive credentials in Firebase config, never commit them

## Advanced: Using Environment Variables

For better security, use Firebase environment variables instead of config:

```bash
firebase functions:secrets:set EMAIL_USER
firebase functions:secrets:set EMAIL_PASSWORD
```

Then update `functions/index.js` to use secrets (requires Firebase Functions v2).

## Support

For issues, check:

- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Nodemailer Documentation](https://nodemailer.com/about/)
