# Quick Start Guide - Firebase Email Setup

## ⚡ Quick Setup (5 minutes)

### 1. Switch to Node.js 20+ (if using nvm)

```bash
nvm use 20
# Or install if not available: nvm install 20
```

### 2. Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
firebase --version  # Verify installation
```

### 3. Login to Firebase

```bash
firebase login
```

### 4. Initialize Firebase in your project

```bash
firebase init
```

Select:

- ✅ Functions
- Choose existing project or create new
- JavaScript
- Yes to install dependencies

### 5. Configure Email Credentials

**For Gmail:**

```bash
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.password="your-gmail-app-password"
firebase functions:config:set email.to="recipient@example.com"
```

**To get Gmail App Password:**

1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Generate App Password for "Mail"
4. Use the 16-character password

### 6. Install Function Dependencies

```bash
cd functions
npm install
cd ..
```

### 7. Deploy the Function

```bash
firebase deploy --only functions
```

After deployment, you'll see:

```
✔ functions[sendContactEmail(us-central1)]: Successful create operation.
Function URL: https://YOUR-REGION-YOUR-PROJECT-ID.cloudfunctions.net/sendContactEmail
```

### 8. Update Frontend Configuration

Edit `static/js/contact-form.js` and replace:

```javascript
const FIREBASE_FUNCTION_URL =
  'https://YOUR-REGION-YOUR-PROJECT-ID.cloudfunctions.net/sendContactEmail';
```

With your actual function URL from step 7.

### 9. Rebuild Hugo Site

```bash
hugo
```

### 10. Test!

Visit your contact page and submit the form.

## 🔧 Troubleshooting

**Firebase command not found:**

- Make sure you're using Node.js 20+: `nvm use 20`
- Reinstall: `npm install -g firebase-tools`

**Function deployment fails:**

- Check you're logged in: `firebase login`
- Verify project: `firebase projects:list`
- Check functions folder exists and has `index.js`

**Email not sending:**

- Check logs: `firebase functions:log`
- Verify email config: `firebase functions:config:get`
- For Gmail, make sure you're using App Password, not regular password

## 📝 Notes

- Keep Node.js 20 active while working with Firebase: `nvm use 20`
- To set Node 20 as default: `nvm alias default 20`
- Function URL will be shown after deployment - copy it!
