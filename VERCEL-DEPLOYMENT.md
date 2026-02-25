# 🚀 Vercel Deployment Guide - Delowar Hossain Portfolio

This guide will walk you through deploying your portfolio to Vercel with custom domains and all necessary configurations.

## 📋 Prerequisites

Before deploying, make sure you have:

1. ✅ A Vercel account ([sign up here](https://vercel.com/signup))
2. ✅ GitHub repository connected
3. ✅ Custom domains purchased (delowarhossain.dev & delowarhossain.me)
4. ✅ Resend API key for email functionality ([get one here](https://resend.com))
5. ✅ All environment variables ready

---

## 🔐 Required Environment Variables

Set these in your Vercel project settings under **Settings → Environment Variables**:

### Essential Variables

```bash
# Email Configuration (REQUIRED for contact form)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
CONTACT_INBOX_EMAIL=contact@delowarhossain.dev
MAIL_FROM=Delowar Hossain Portfolio <noreply@delowarhossain.dev>

# Site Configuration
PUBLIC_SITE_URL=https://delowarhossain.dev
NODE_ENV=production

# Portfolio Information
PORTFOLIO_NAME=Delowar Hossain
PORTFOLIO_TITLE=Full-Stack Developer & AI Explorer
PORTFOLIO_LOCATION=Dhaka, Bangladesh
PORTFOLIO_TIMEZONE=GMT+6
PORTFOLIO_BIO=Building modern web applications with cutting-edge technologies
PORTFOLIO_AVAILABILITY=Available for freelance & consulting
PORTFOLIO_AVATAR=https://avatars.githubusercontent.com/u/97281919?v=4

# Social Links
GITHUB_USERNAME=mdhossain-2437

# Firebase Admin (if using authentication features)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----
FIREBASE_ADMIN_EMAILS=contact@delowarhossain.dev

# Database (if using)
DATABASE_URL=your_database_connection_string

# Optional
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_secret
OPENWEATHER_API_KEY=your_weather_api_key
```

---

## 📧 Setting Up Email with Resend

### Step 1: Create Resend Account

1. Go to [resend.com](https://resend.com) and sign up
2. Navigate to **API Keys** in dashboard
3. Create a new API key and copy it

### Step 2: Configure Domain for Sending Emails

1. In Resend dashboard, go to **Domains**
2. Add domain: `delowarhossain.dev`
3. Add the DNS records Resend provides to your domain registrar:
   - SPF record
   - DKIM records
   - DMARC record
4. Verify domain ownership

### Step 3: Test Email Configuration

After deployment, test the contact form to ensure emails are being sent to `contact@delowarhossain.dev`

---

## 🌐 Domain Configuration

### Step 1: Configure delowarhossain.dev (Primary Domain)

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Domains**
3. Add domain: `delowarhossain.dev`
4. Add the DNS records to your domain registrar:

   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

5. Wait for DNS propagation (can take up to 48 hours, usually faster)

### Step 2: Configure delowarhossain.me (Redirect Domain)

1. In Vercel dashboard, add: `delowarhossain.me`
2. Add DNS records:

   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. The `vercel.json` configuration will automatically redirect all traffic from `.me` to `.dev`

### Redirect Configuration (Already Set in vercel.json)

The following redirects are configured:

- `delowarhossain.me/*` → `delowarhossain.dev/*` (301 permanent)
- `www.delowarhossain.me/*` → `delowarhossain.dev/*` (301 permanent)
- `www.delowarhossain.dev/*` → `delowarhossain.dev/*` (301 permanent)

---

## 📦 Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. Install Vercel CLI:

   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:

   ```bash
   vercel login
   ```

3. Deploy from project root:

   ```bash
   vercel
   ```

4. Follow prompts to link project
5. For production deployment:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub Integration

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository: `mdhossain-2437/delowar-portfolio`
3. Configure project:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`
   - **Root Directory**: `./`
4. Add all environment variables (see above)
5. Click **Deploy**

---

## 🎵 Music Files Setup

After deployment, add your background music files:

1. Create folder: `client/public/audio/`
2. Add numbered MP3 files: `1.mp3`, `2.mp3`, `3.mp3`, etc.
3. The system automatically detects files 1-100
4. Commit and push to trigger redeployment

---

## ✅ Post-Deployment Checklist

After deployment, verify:

- [ ] Website loads at `https://delowarhossain.dev`
- [ ] `delowarhossain.me` redirects to `delowarhossain.dev`
- [ ] SSL certificate is active (https://)
- [ ] Contact form sends emails to `contact@delowarhossain.dev`
- [ ] All routes work correctly (no 404 on refresh)
- [ ] Background music plays (after adding files)
- [ ] 404 page displays correctly for invalid routes
- [ ] All images and assets load
- [ ] Mobile responsive design works
- [ ] Performance score is good (test with Lighthouse)

---

## 🐛 Troubleshooting

### Issue: 404 on Page Refresh

**Solution**: Ensure `vercel.json` has proper rewrites configuration (already included)

### Issue: Email Not Sending

**Solutions**:

- Verify RESEND_API_KEY is set correctly
- Check domain verification in Resend dashboard
- Ensure DNS records are properly configured
- Check Vercel function logs for errors

### Issue: Domain Not Connecting

**Solutions**:

- Wait for DNS propagation (up to 48 hours)
- Verify DNS records match Vercel's requirements
- Use [DNS Checker](https://dnschecker.org) to verify propagation
- Remove any existing DNS records that might conflict

### Issue: Music Not Playing

**Solutions**:

- Ensure audio files are in `client/public/audio/` folder
- Files must be named: `1.mp3`, `2.mp3`, `3.mp3`, etc.
- Check browser console for loading errors
- Verify files are committed to repository

### Issue: Build Failures

**Solutions**:

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript has no errors: `npm run check`
- Clear Vercel cache and redeploy

---

## 📊 Performance Optimization

The deployment is optimized with:

✅ **SPA Routing** - Instant navigation, no page reloads
✅ **Lazy Loading** - Routes load on demand
✅ **Code Splitting** - Optimized bundle sizes
✅ **Asset Caching** - Static assets cached for 1 year
✅ **Terser Minification** - Smaller JavaScript bundles
✅ **Security Headers** - HSTS, CSP, X-Frame-Options
✅ **GSAP Animations** - Smooth, hardware-accelerated animations

---

## 🔄 Continuous Deployment

Once connected to GitHub:

1. Push to `main` branch → Automatic production deployment
2. Push to other branches → Preview deployments
3. Pull requests → Automatic preview URLs
4. Rollback anytime from Vercel dashboard

---

## 📞 Support

If you encounter issues:

1. Check Vercel function logs: **Project → Deployments → [deployment] → Functions**
2. Review build logs: **Project → Deployments → [deployment] → Build Logs**
3. Contact Vercel support: [vercel.com/support](https://vercel.com/support)
4. Check documentation: [vercel.com/docs](https://vercel.com/docs)

---

## 🎉 Success!

Your portfolio should now be live at **https://delowarhossain.dev** with automatic redirects from **delowarhossain.me**!

**Next Steps:**

- Add music files to `/audio/` folder
- Test contact form functionality
- Monitor performance with Vercel Analytics
- Set up custom error tracking (optional)
- Configure Google Analytics (optional)

---

**Deployment Date**: Ready to deploy
**Last Updated**: 2025-01-22
**Version**: 1.0.0
