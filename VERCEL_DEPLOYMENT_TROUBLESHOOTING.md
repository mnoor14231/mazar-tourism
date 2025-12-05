# Vercel Deployment Troubleshooting

## Current Status

**Latest Commits Pushed:**
- `79df94b` - Force Next.js rebuild with new build ID
- `05dac96` - Update admin page - force Vercel rebuild
- `487762b` - Final force: Ensure bulk import UI deploys

**What Should Be Deployed:**
- Bulk import feature with Excel/CSV support
- Updated admin page with two buttons (Template + Guide)
- Arabic instructions and template

## If Deployment Still Shows Old Version

### Step 1: Check Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your "tourist" project
3. Go to "Deployments" tab
4. Check if there's a NEW deployment (should show latest commit `79df94b`)
5. If you see an old deployment, click "Redeploy" button

### Step 2: Manual Redeploy
1. In Vercel Dashboard → Deployments
2. Click on the latest deployment
3. Click the three dots (⋯) menu
4. Select "Redeploy"
5. Wait for it to complete

### Step 3: Check Build Logs
1. In Vercel Dashboard → Deployments
2. Click on the latest deployment
3. Go to "Logs" tab
4. Check for any build errors
5. Look for errors related to:
   - `app/admin/page.tsx`
   - `app/api/places/bulk-import/route.ts`
   - Missing dependencies (xlsx package)

### Step 4: Clear Browser Cache
1. Open your Vercel site in incognito/private window
2. Or hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
3. Visit: `https://tourist-cyan.vercel.app/admin`

### Step 5: Verify Files Are in Repository
Check GitHub to confirm files exist:
- https://github.com/mnoor14231/mazar-tourism/blob/main/app/admin/page.tsx
- https://github.com/mnoor14231/mazar-tourism/blob/main/app/api/places/bulk-import/route.ts

### Step 6: Check Vercel Build Settings
1. Vercel Dashboard → Settings → General
2. Verify:
   - Framework: Next.js
   - Build Command: `prisma generate && prisma db push && next build`
   - Install Command: `npm install`
   - Root Directory: `./`

### Step 7: Force Rebuild via Vercel CLI
If you have Vercel CLI installed:
```bash
vercel --prod --force
```

## Expected Result

After successful deployment, `/admin` page should show:
- ✅ "استيراد جماعي للأماكن (Bulk Import)" section
- ✅ Two buttons: "📖 دليل الاستخدام" and "📥 تحميل القالب"
- ✅ Upload button: "📤 رفع ملف Excel أو CSV واستيراد الأماكن"

## Common Issues

**Issue: Deployment shows old commit**
- Solution: Manually trigger redeploy in Vercel dashboard

**Issue: Build fails**
- Check logs for missing dependencies
- Verify `xlsx` package is in `package.json`
- Check for TypeScript errors

**Issue: Page shows old version (caching)**
- Clear browser cache
- Use incognito mode
- Check Vercel cache settings

**Issue: Files not found**
- Verify files are committed to GitHub
- Check branch is `main`
- Verify file paths are correct

## Next Steps

1. Check Vercel dashboard for new deployment
2. If no new deployment, manually trigger redeploy
3. Check build logs for errors
4. Test in incognito window
5. Verify all files are in GitHub repository

