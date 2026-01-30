# 🚀 Culinaria Deployment Guide

## Overview

This guide covers everything you need to deploy your Culinaria application to production. Your app is built with React + Vite and uses Firebase for backend services.

## 📋 Pre-Deployment Checklist

### ✅ Required Setup

- [ ] Firebase project configured
- [ ] Environment variables set up
- [ ] Domain name registered (optional)
- [ ] SSL certificate (handled by hosting platforms)
- [ ] Firebase security rules deployed

### ✅ Code Preparation

- [ ] All branding updated to "Culinaria"
- [ ] Security features implemented
- [ ] Error boundaries in place
- [ ] SEO optimization complete
- [ ] Responsive design tested

## 🔧 Environment Configuration

### 1. Firebase Setup

#### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "culinaria"
3. Enable Authentication (Email/Password)
4. Create Firestore database
5. Set up Storage (if needed)

#### Get Firebase Configuration

1. Go to Project Settings
2. Add a web app to your project
3. Copy the configuration object

#### Update Firebase Config

Replace the placeholder values in `src/firebase/config.ts` (or set env vars; the app reads from `import.meta.env`).

### 2. Environment Variables

Create a `.env` file in your project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id

# USDA API (for nutrition data)
VITE_USDA_API_KEY=your-usda-api-key

# App Configuration
VITE_APP_NAME=Culinaria
VITE_APP_URL=https://your-domain.com

# Optional: Social links (Footer)
VITE_GITHUB_URL=https://github.com/your-username
VITE_TWITTER_URL=https://x.com/your-handle
VITE_LINKEDIN_URL=https://linkedin.com/in/your-profile
```

### 3. Update Firebase Config to Use Environment Variables

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
```

## 🛡️ Security Configuration

### 1. Deploy Firebase Security Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Deploy security rules
firebase deploy --only firestore:rules
```

### 2. Configure Authentication Methods

1. Go to Firebase Console > Authentication
2. Enable Email/Password authentication
3. Add authorized domains
4. Configure password reset settings

### 3. Set Up Firestore Security Rules

Your `firestore.rules` file should already be configured with proper security rules.

## 🏗️ Build Process

### 1. Install Dependencies

```bash
npm install
```

### 2. Build for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

### 3. Test Production Build

```bash
npm run preview
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

#### Setup

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel`

#### Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_FIREBASE_API_KEY": "@firebase-api-key",
    "VITE_FIREBASE_AUTH_DOMAIN": "@firebase-auth-domain",
    "VITE_FIREBASE_PROJECT_ID": "@firebase-project-id",
    "VITE_FIREBASE_STORAGE_BUCKET": "@firebase-storage-bucket",
    "VITE_FIREBASE_MESSAGING_SENDER_ID": "@firebase-messaging-sender-id",
    "VITE_FIREBASE_APP_ID": "@firebase-app-id",
    "VITE_USDA_API_KEY": "@usda-api-key"
  }
}
```

### Option 2: Netlify

#### Setup

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

#### Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: Firebase Hosting

#### Setup

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize: `firebase init hosting`
3. Build: `npm run build`
4. Deploy: `firebase deploy`

#### Configuration

Create `firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

## 🔍 Post-Deployment Checklist

### ✅ Functionality Testing

- [ ] User registration and login
- [ ] Recipe search and display
- [ ] Nutrition tracking
- [ ] Meal planning
- [ ] User profile management
- [ ] Responsive design on all devices

### ✅ Security Verification

- [ ] Firebase security rules working
- [ ] Authentication flows secure
- [ ] Rate limiting active
- [ ] Input validation working
- [ ] Error boundaries functional

### ✅ Performance Testing

- [ ] Page load times under 3 seconds
- [ ] Images optimized
- [ ] Code splitting working
- [ ] Caching configured

### ✅ SEO Verification

- [ ] Meta tags present
- [ ] Structured data working
- [ ] Sitemap generated (if needed)
- [ ] Google Analytics configured

## 📊 Monitoring & Analytics

### 1. Google Analytics

Add to `index.html`:

```html
<!-- Google Analytics -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_MEASUREMENT_ID");
</script>
```

### 2. Firebase Analytics

Already configured in your Firebase setup.

### 3. Error Monitoring

Consider adding Sentry for error tracking:

```bash
npm install @sentry/react @sentry/tracing
```

## 🔧 Maintenance

### Regular Tasks

- [ ] Monitor Firebase usage and costs
- [ ] Update dependencies monthly
- [ ] Review security logs
- [ ] Backup user data
- [ ] Monitor performance metrics

### Updates

- [ ] Keep React and dependencies updated
- [ ] Monitor Firebase service updates
- [ ] Review and update security rules
- [ ] Test new features in staging

## 🆘 Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Firebase Connection Issues

- Verify API keys are correct
- Check Firebase project settings
- Ensure security rules are deployed

#### Routing Issues

- Verify SPA routing configuration
- Check for 404 redirects
- Test all routes after deployment

## 📞 Support

For deployment issues:

- **Email**: begumsabina81193@gmail.com
- **Firebase Support**: Use Firebase console support
- **Hosting Platform Support**: Use platform-specific support

---

## 🎉 Deployment Complete!

Your Culinaria application is now ready for production deployment. Follow this guide step-by-step to ensure a smooth launch.

**Remember**: Always test thoroughly in a staging environment before deploying to production.
