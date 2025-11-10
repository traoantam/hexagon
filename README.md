# Hexagon - Hugo Static Site

A modern static website built with Hugo and the Hexagon theme, featuring Firebase Functions for contact form email handling.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Hugo Extended** (v0.152.2 or later) - Required for SCSS compilation
  - Download from: https://github.com/gohugoio/hugo/releases
  - Or install via Homebrew: `brew install hugo`
- **Node.js** (v20.x or later) - Required for Firebase Functions
  - Download from: https://nodejs.org/
  - Or use nvm: `nvm install 20`
- **Firebase CLI** (optional, for contact form functionality)
  - Install: `npm install -g firebase-tools`
- **Git** - For version control

### Verify Installations

```bash
hugo version    # Should show "hugo v0.152.2" or later with "extended" in the name
node --version  # Should show "v20.x.x" or later
npm --version   # Should show version number
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd hexagon
```

### 2. Run Development Server

Start the Hugo development server with live reload:

```bash
hugo server
```

The site will be available at `http://localhost:1313/`

### 3. Build for Production

Generate static files in the `public/` directory:

```bash
hugo
```

For production builds with minification:

```bash
hugo --minify
```

## 📁 Project Structure

```
hexagon/
├── archetypes/          # Content templates
├── assets/             # Source assets (SCSS, JS)
├── content/            # Site content (Markdown files)
│   ├── _index.md       # Homepage content
│   ├── contact.md      # Contact page
│   ├── news/           # News/blog posts
│   └── service.md      # Service page
├── data/               # Data files (YAML, JSON, TOML)
├── functions/          # Firebase Cloud Functions
│   ├── index.js        # Function code
│   └── package.json    # Node.js dependencies
├── layouts/            # Custom layout overrides
├── public/             # Generated static site (gitignored)
├── static/             # Static files (copied as-is)
│   └── js/             # JavaScript files
├── themes/             # Hugo themes
│   └── hexagon/        # Hexagon theme
├── hugo.toml           # Hugo configuration
├── firebase.json        # Firebase configuration
└── README.md           # This file
```

## ⚙️ Configuration

### Hugo Configuration

Main configuration is in `hugo.toml`:

```toml
theme = 'hexagon'
baseURL = 'http://localhost:1313/'
languageCode = 'en-us'
title = 'Hexagon'
```

### Firebase Functions Setup (Optional)

If you want to enable the contact form email functionality, follow these steps:

#### Prerequisites

- **Node.js 20+** (required for Firebase CLI)

  ```bash
  node --version  # Should show v20.x.x or higher
  # If using nvm: nvm install 20 && nvm use 20
  ```

- **Firebase CLI**
  ```bash
  npm install -g firebase-tools
  firebase --version  # Verify installation
  ```

#### Step 1: Initialize Firebase

1. **Login to Firebase:**

   ```bash
   firebase login
   ```

2. **Initialize Firebase in your project:**

   ```bash
   firebase init
   ```

   Select:

   - ✅ Functions: Configure a Cloud Functions directory
   - Choose existing project or create new
   - Select JavaScript as the language
   - Yes to install dependencies

#### Step 2: Configure Email Service

Choose one of the following options:

**Option A: Gmail (Easiest for testing)**

1. **Get Gmail App Password:**

   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → Enable 2-Step Verification (if not already enabled)
   - App passwords → Generate app password for "Mail"
   - Copy the 16-character password

2. **Set Firebase config:**
   ```bash
   firebase functions:config:set email.user="your-email@gmail.com"
   firebase functions:config:set email.password="your-16-char-app-password"
   firebase functions:config:set email.to="recipient@example.com"
   ```

**Option B: SendGrid (Recommended for production)**

1. Create account at [SendGrid](https://sendgrid.com)
2. Get API key from Settings → API Keys
3. Update `functions/index.js` to use SendGrid transport (see Firebase docs)
4. Set config:
   ```bash
   firebase functions:config:set sendgrid.api_key="your-sendgrid-api-key"
   firebase functions:config:set email.to="recipient@example.com"
   ```

#### Step 3: Install Function Dependencies

```bash
cd functions
npm install
cd ..
```

#### Step 4: Deploy Functions

```bash
firebase deploy --only functions
```

After deployment, you'll see the function URL:

```
✔ functions[sendContactEmail(us-central1)]: Successful create operation.
Function URL: https://YOUR-REGION-YOUR-PROJECT-ID.cloudfunctions.net/sendContactEmail
```

**Important:** Copy this URL for the next step!

#### Step 5: Update Frontend Configuration

Edit `static/js/contact-form.js` and replace the function URL:

```javascript
const FIREBASE_FUNCTION_URL =
  'https://YOUR-REGION-YOUR-PROJECT-ID.cloudfunctions.net/sendContactEmail';
```

Replace `YOUR-REGION-YOUR-PROJECT-ID` with your actual function URL from Step 4.

#### Step 6: Rebuild Hugo Site

```bash
hugo
```

#### Step 7: Test the Contact Form

1. Visit your contact page
2. Fill out and submit the form
3. Check:
   - Success message appears
   - Email arrives at configured recipient address
   - View logs: `firebase functions:log`

#### Firebase Troubleshooting

**Function deployment fails:**

- Ensure Node.js 20+ is installed: `node --version`
- Check Firebase login: `firebase login`
- Verify project: `firebase projects:list`
- Check functions folder exists and has `index.js`

**Email not sending:**

- Check logs: `firebase functions:log`
- Verify email config: `firebase functions:config:get`
- For Gmail, ensure you're using App Password (not regular password)
- Check spam folder

**Form not submitting:**

- Check browser console for errors
- Verify function URL in `contact-form.js` is correct
- Ensure you rebuilt Hugo: `hugo`

## 🛠️ Development

### Adding New Content

Create new pages using Hugo's content management:

```bash
hugo new news/my-article.md
```

Edit the generated file in `content/news/my-article.md`.

### Customizing the Theme

The Hexagon theme is located in `themes/hexagon/`. You can:

- Override templates by copying them to `layouts/`
- Customize styles by modifying SCSS files in `assets/scss/`
- Add custom JavaScript in `static/js/`

### Running with Different Base URL

For production builds, specify the base URL:

```bash
hugo --baseURL "https://yourdomain.com/"
```

## 📦 Building and Deployment

### Local Build

```bash
# Development build
hugo

# Production build with minification
hugo --minify --gc
```

Output will be in the `public/` directory.

### GitHub Pages Deployment

The project includes a GitHub Actions workflow (`.github/workflows/hugo.yaml`) that automatically builds and deploys to GitHub Pages on push to the `master` branch.

To deploy manually:

1. Build the site: `hugo --baseURL "https://yourusername.github.io/hexagon/"`
2. Push the `public/` directory to the `gh-pages` branch, or
3. Use the GitHub Actions workflow (already configured)

## 🔧 Common Commands

```bash
# Start development server
hugo server

# Start server with draft content
hugo server -D

# Build site
hugo

# Build with minification
hugo --minify

# Build for specific environment
hugo --environment production

# Clean public directory
rm -rf public/

# Check Hugo version
hugo version
```

## 📝 Content Management

### Creating Content

```bash
# Create a new page
hugo new about.md

# Create a new blog post
hugo new news/my-post.md

# Create with custom archetype
hugo new --kind post news/my-post.md
```

### Content Front Matter

Example front matter for a news article:

```yaml
---
title: 'My Article Title'
date: 2024-01-15
draft: false
categories: ['technology']
tags: ['hugo', 'static-site']
---
```

## 🐛 Troubleshooting

### Hugo Server Not Starting

- Ensure Hugo Extended is installed (not just Hugo)
- Check if port 1313 is already in use
- Verify `hugo.toml` configuration is correct

### SCSS Not Compiling

- Make sure you have Hugo Extended version installed
- Check that Dart Sass is available (for GitHub Actions)

### Build Errors

- Clear cache: `rm -rf resources/_gen/`
- Clean public directory: `rm -rf public/`
- Rebuild: `hugo --gc`

## 📚 Additional Resources

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Hugo Quick Start](https://gohugo.io/getting-started/quick-start/)
- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 📄 License

[Add your license information here]

## 🤝 Contributing

[Add contribution guidelines here]

---

**Note:** This project uses Hugo Extended for SCSS compilation. Make sure you have the extended version installed, not just the regular Hugo binary.
