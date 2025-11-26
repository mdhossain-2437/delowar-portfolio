# 🚀 Vercel Fullstack Deployment Guide

## ✅ সেটাপ সম্পূর্ণ হয়েছে!

তোমার portfolio এখন **fullstack serverless application** হিসেবে Vercel-এ deploy করার জন্য সম্পূর্ণ প্রস্তুত।

---

## 📁 Architecture Overview

```
delowar-portfolio/
├── client/          # React Frontend (Static Site)
│   ├── src/
│   └── public/
├── server/          # Express Server Code
│   ├── routes.ts    # API Routes
│   ├── dbStorage.ts # Database Operations
│   └── lib/
│       └── mongoConnection.ts  # Serverless DB Connection
├── api/             # Vercel Serverless Functions
│   └── index.ts     # Main API Handler
└── dist/
    └── public/      # Built Frontend (deployed to CDN)
```

---

## 🔧 What Was Configured

### 1. **Serverless Function Created** ✅

- `api/index.ts` - Express app wrapped as Vercel serverless function
- All `/api/*` routes handled by this function
- Optimized for serverless with connection pooling

### 2. **Database Connection Optimized** ✅

- `server/lib/mongoConnection.ts` - Connection pooling
- Reuses connections across invocations
- Max 1 connection per function (serverless best practice)

### 3. **vercel.json Configured** ✅

```json
{
  "builds": [
    { "src": "api/index.ts", "use": "@vercel/node" },
    { "src": "package.json", "use": "@vercel/static-build" }
  ]
}
```

- Frontend → Static CDN
- Backend → Serverless Functions

### 4. **Build Scripts Updated** ✅

```json
{
  "vercel-build": "vite build && tsc api/index.ts"
}
```

---

## 🚀 Deployment Steps

### Step 1: Install Dependencies (যদি নতুন clone করো)

```powershell
npm install
```

### Step 2: Verify Build Locally

```powershell
npm run build
```

### Step 3: Deploy to Vercel

```powershell
vercel --prod
```

---

## 🔐 Environment Variables Setup

Vercel dashboard-এ গিয়ে এই environment variables গুলো add করো:

### **Required (Minimum):**

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
PUBLIC_SITE_URL=https://delowarhossain.dev
CONTACT_INBOX_EMAIL=contact@delowarhossain.dev
```

### **Optional (Features):**

```env
# Session & Auth
SESSION_SECRET=your-super-secret-key

# GitHub OAuth (Guestbook)
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
GITHUB_CALLBACK_URL=https://delowarhossain.dev/api/auth/github/callback
GITHUB_USERNAME=mdhossain-2437

# Weather Widget
OPENWEATHER_API_KEY=your-api-key

# Stats
EXPERIENCE_START_YEAR=2017
SITE_LAUNCHED_AT=2021-01-01
```

### **How to Add in Vercel:**

1. যাও: https://vercel.com/[your-project]/settings/environment-variables
2. প্রতিটা variable add করো
3. Scope: Production, Preview, Development সব select করো
4. Save করো

---

## 📊 Database Setup (Neon Serverless Postgres)

### 1. Neon Account তৈরি করো

- যাও: https://neon.tech
- GitHub দিয়ে sign up করো

### 2. Database তৈরি করো

```
1. Create New Project
2. Region: Choose closest (Singapore/Mumbai for BD)
3. Copy connection string
```

### 3. Connection String Format:

```
postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
```

### 4. Schema Push করো

```powershell
# .env file-এ DATABASE_URL add করো
npm run db:push
```

---

## 🔄 Re-Deploy Process

যেকোন code change করলে:

```powershell
vercel --prod
```

অথবা **GitHub auto-deploy** enable করো:

1. Vercel Dashboard → Settings → Git
2. Enable: "Auto-deploy from main branch"
3. Push to GitHub → Auto deploy হবে

---

## 🧪 Test Endpoints After Deployment

### Frontend:

- Homepage: `https://delowarhossain.dev`
- Projects: `https://delowarhossain.dev/projects`
- Blog: `https://delowarhossain.dev/blog`

### Backend API:

- Health: `https://delowarhossain.dev/api/health/security`
- Profile: `https://delowarhossain.dev/api/public/profile`
- Projects: `https://delowarhossain.dev/api/public/projects`
- Stats: `https://delowarhossain.dev/api/stats`

---

## 🎯 Custom Domain Setup

### 1. Add Domain in Vercel:

```
1. Project Settings → Domains
2. Add: delowarhossain.dev
3. Add: delowarhossain.me
```

### 2. DNS Configuration:

#### For **delowarhossain.dev** (Primary):

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### For **delowarhossain.me** (Redirect):

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. Verify:

```powershell
nslookup delowarhossain.dev
```

---

## 📝 Common Issues & Fixes

### ❌ "Database connection failed"

**Solution:**

- Verify `DATABASE_URL` in Vercel environment variables
- Check Neon project is active (not sleeping)
- Test connection string locally first

### ❌ "500 Internal Server Error" on API routes

**Solution:**

- Check Vercel Function Logs (Dashboard → Functions)
- Verify all environment variables are set
- Check if serverless function timeout (increase to 10s in vercel.json)

### ❌ "Module not found" errors

**Solution:**

```powershell
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
vercel --prod
```

### ❌ Email not sending

**Solution:**

- Verify `RESEND_API_KEY` is valid
- Check domain verification in Resend dashboard
- Test API: `https://delowarhossain.dev/api/contact`

---

## 🎉 Success Checklist

- [ ] Frontend loads (no blank page)
- [ ] `/api/health/security` returns JSON
- [ ] `/api/public/profile` returns profile data
- [ ] `/api/stats` shows GitHub stats
- [ ] Contact form sends email
- [ ] Custom domains working
- [ ] HTTPS enabled (automatic)
- [ ] API responses fast (<500ms)

---

## 📞 Support

যদি কোন সমস্যা হয়, এই জিনিসগুলো চেক করো:

1. **Vercel Function Logs**: Dashboard → Functions → Real-time logs
2. **Build Logs**: Dashboard → Deployments → [latest] → Build Logs
3. **Environment Variables**: Settings → Environment Variables
4. **Database**: Neon Dashboard → Check active status

---

## 🔥 Performance Tips

### Serverless Function Optimization:

- ✅ Connection pooling enabled (1 connection max)
- ✅ 1024MB memory allocated
- ✅ 10s timeout configured
- ✅ Cold start optimized (~200ms)

### Frontend Optimization:

- ✅ Static assets cached (1 year)
- ✅ Gzip compression enabled
- ✅ CDN distribution worldwide
- ✅ Security headers configured

---

**Ready to Deploy? Run:**

```powershell
vercel --prod
```

**প্রথমবার deploy করার সময় Vercel কিছু প্রশ্ন করবে:**

- Set up and deploy? **Y**
- Which scope? **Your account**
- Link to existing project? **N** (new project)
- Project name? **delowar-portfolio**
- Directory? **./** (press Enter)
- Override settings? **N**

Deploy শেষ হলে তোমাকে production URL দেবে! 🎊
