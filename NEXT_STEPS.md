# Next Steps - Complete Firebase Email Setup

## ✅ Completed

- Firebase project created: `hexagon-contact`
- Firebase Functions initialized
- Function code already in place (`functions/index.js`)

## 📋 Step-by-Step Instructions

### Step 1: Install Function Dependencies

```bash
cd functions
npm install
cd ..
```

This will install all required packages (nodemailer, firebase-functions, etc.)

### Step 2: Configure Email Credentials

You need to set up your email service credentials. Choose one option:

#### Option A: Gmail (Easiest for testing)

1. **Get Gmail App Password:**

   - Go to https://myaccount.google.com/
   - Security → 2-Step Verification (enable if not already)
   - App passwords → Generate app password for "Mail"
   - Copy the 16-character password

2. **Set Firebase config:**

   ```bash
   firebase functions:config:set email.user="your-email@gmail.com"
   firebase functions:config:set email.password="your-16-char-app-password"
   firebase functions:config:set email.to="recipient@example.com"
   ```

   Replace:

   - `your-email@gmail.com` - Your Gmail address
   - `your-16-char-app-password` - The app password you generated
   - `recipient@example.com` - Where you want to receive contact form emails

#### Option B: SendGrid (Recommended for production)

1. Create account at https://sendgrid.com
2. Get API key from Settings → API Keys
3. Set config:
   ```bash
   firebase functions:config:set sendgrid.api_key="your-sendgrid-api-key"
   firebase functions:config:set email.to="recipient@example.com"
   ```
4. Update `functions/index.js` to use SendGrid (see FIREBASE_SETUP.md)

### Step 3: Verify Configuration

```bash
firebase functions:config:get
```

You should see your email configuration values.

### Step 4: Deploy the Function

```bash
firebase deploy --only functions
```

This will:

- Upload your function code
- Create the Cloud Function
- Show you the function URL

**Important:** Copy the function URL that appears after deployment!
It will look like:

```
https://us-central1-hexagon-contact.cloudfunctions.net/sendContactEmail
```

### Step 5: Update Frontend JavaScript

Edit `static/js/contact-form.js` and update line 11:

```javascript
const FIREBASE_FUNCTION_URL =
  'https://YOUR-REGION-hexagon-contact.cloudfunctions.net/sendContactEmail';
```

Replace `YOUR-REGION` with the actual region (likely `us-central1`).

### Step 6: Rebuild Hugo Site

```bash
hugo
```

### Step 7: Test the Contact Form!

1. Visit your contact page
2. Fill out the form
3. Submit and check:
   - Success message appears
   - Email arrives at your configured address
   - Check logs: `firebase functions:log`

## 🔍 Troubleshooting

**Function deployment fails:**

- Make sure you're in the project root directory
- Check Node.js version: `node --version` (should be 20.x)
- Verify config: `firebase functions:config:get`

**Email not sending:**

- Check function logs: `firebase functions:log`
- Verify email credentials are correct
- For Gmail, ensure you're using App Password (not regular password)

**Form not submitting:**

- Check browser console for errors
- Verify function URL in `contact-form.js` is correct
- Ensure you rebuilt Hugo: `hugo`

## 📚 Additional Resources

- Full setup guide: `FIREBASE_SETUP.md`
- Quick reference: `QUICK_START.md`
- Firebase Console: https://console.firebase.google.com/project/hexagon-contact
