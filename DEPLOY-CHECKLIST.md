# Quick Deployment Checklist

## ✅ Pre-Deployment (Completed)

- [x] Enhanced 404 page with GSAP animations
- [x] Created `vercel.json` with SPA routing & domain redirects
- [x] Updated all emails to `contact@delowarhossain.dev`
- [x] Music system configured for `/audio/` folder
- [x] Added GSAP animation hooks
- [x] Security headers configured
- [x] Email service setup with Resend

## 📝 Manual Steps Required

### 1. Get Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Create API key
3. Add domain: `delowarhossain.dev`
4. Configure DNS records from Resend dashboard

### 2. Deploy to Vercel

```bash
# Option A: CLI Deployment
npm install -g vercel
vercel login
vercel --prod

# Option B: GitHub Integration
# Go to vercel.com/new and import repository
```

### 3. Add Environment Variables in Vercel

Go to Project Settings → Environment Variables and add:

**Required:**

- `RESEND_API_KEY` - From Resend dashboard
- `CONTACT_INBOX_EMAIL` - contact@delowarhossain.dev
- `MAIL_FROM` - Delowar Hossain Portfolio <noreply@delowarhossain.dev>
- `PUBLIC_SITE_URL` - https://delowarhossain.dev

**Optional but Recommended:**

- `PORTFOLIO_NAME` - Delowar Hossain
- `PORTFOLIO_TITLE` - Full-Stack Developer & AI Explorer
- `GITHUB_USERNAME` - mdhossain-2437

See `.env.example` for complete list.

### 4. Configure Custom Domains in Vercel

**Primary Domain (delowarhossain.dev):**

1. Go to Project → Settings → Domains
2. Add: `delowarhossain.dev`
3. Add DNS records from your registrar:
   ```
   Type: A, Name: @, Value: 76.76.21.21
   Type: CNAME, Name: www, Value: cname.vercel-dns.com
   ```

**Redirect Domain (delowarhossain.me):**

1. Add: `delowarhossain.me`
2. Add same DNS records
3. Automatic redirect configured in `vercel.json`

### 5. Add Music Files

After deployment:

1. Add MP3 files to `client/public/audio/`
2. Name them: `1.mp3`, `2.mp3`, `3.mp3`, etc.
3. Commit and push to trigger redeployment

### 6. Test Everything

- [ ] Site loads at https://delowarhossain.dev
- [ ] delowarhossain.me redirects to .dev
- [ ] Contact form sends emails
- [ ] All routes work (no 404 on refresh)
- [ ] Music plays (after adding files)
- [ ] Mobile responsive
- [ ] SSL certificate active

## 🚀 Deploy Command

```bash
# Build and deploy
npm run build
vercel --prod
```

## 📚 Full Documentation

See `VERCEL-DEPLOYMENT.md` for complete deployment guide.
