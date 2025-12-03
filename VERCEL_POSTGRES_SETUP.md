# Vercel Postgres Setup Instructions

## Problem
The app is using SQLite (local database) but Vercel needs PostgreSQL.

## Solution: Set up Vercel Postgres

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/muneers-projects-276a49f7/tourist
2. Click on your project: **tourist**

### Step 2: Add Postgres Database
1. Click on **"Storage"** tab
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Choose region: **Washington, D.C., USA (iad1)** (closest to Madinah)
5. Database name: `mazar-db`
6. Click **"Create"**

### Step 3: Connect Database to Project
1. Vercel will automatically add `DATABASE_URL` environment variable
2. Click **"Connect"** to link the database to your project

### Step 4: Trigger Deployment
After database is connected, redeploy:
```bash
git commit --allow-empty -m "Trigger deployment with Postgres"
git push
```

### Step 5: Seed the Database
After deployment, call the seed API:

**Option A: Browser Console**
1. Open: https://tourist-cyan.vercel.app
2. Press F12 (DevTools)
3. Console tab, paste:
```javascript
fetch('/api/seed', {method: 'POST'}).then(r=>r.json()).then(console.log)
```

**Option B: PowerShell**
```powershell
Invoke-WebRequest -Uri "https://tourist-cyan.vercel.app/api/seed" -Method POST
```

### Step 6: Verify
Visit: https://tourist-cyan.vercel.app/reference

Should show 8 places!

---

## Current Status

- ✅ Prisma schema updated to use PostgreSQL
- ✅ Seed API endpoint created
- ⏳ Waiting for you to add Vercel Postgres in dashboard
- ⏳ Then seed database manually

---

## Important Notes

1. **Local Development**: After adding Postgres, local dev won't work with SQLite anymore
   - Either install PostgreSQL locally
   - Or create a separate branch for local dev

2. **Free Tier**: Vercel Postgres free tier includes:
   - 256 MB storage
   - 60 hours compute time/month
   - Should be enough for this project

3. **Migration**: Once Postgres is set up, all data will be in the cloud

---

## Quick Summary

1. Vercel Dashboard → Storage → Create Postgres Database
2. Wait for connection
3. Redeploy (or wait for auto-deploy)
4. Call `/api/seed` endpoint
5. Database populated with 8 places!

