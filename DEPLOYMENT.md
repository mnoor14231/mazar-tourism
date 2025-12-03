# Deployment Guide - Mazar Tourism App

## Prerequisites

1. **Vercel Account**: Create an account at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Code should be pushed to GitHub
3. **Database**: SQLite for development, Vercel Postgres for production (recommended)

## Quick Deploy to Vercel

### Option 1: Using Vercel Dashboard (Recommended)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select "Import Git Repository"
   - Choose your repository (`mnoor14231/tahcom-portal` or your repo name)
   - Click "Import"

3. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `prisma generate && prisma migrate deploy && next build`
   - Output Directory: `.next` (default)

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   DATABASE_URL=file:./prisma/dev.db
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```
   
   **For Production Database** (recommended):
   - Use Vercel Postgres or another hosted database
   - Update `DATABASE_URL` to point to production database

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy: `Y`
   - Link to existing project or create new: Choose as needed
   - Settings: Accept defaults or customize

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Environment Variables

### Required Variables

- `DATABASE_URL`: Database connection string
  - Development: `file:./prisma/dev.db`
  - Production: Your database URL (Vercel Postgres, PlanetScale, etc.)

- `NEXT_PUBLIC_APP_URL`: Your app's public URL
  - Development: `http://localhost:3000`
  - Production: `https://your-domain.vercel.app`

### Setting Environment Variables

**Via Vercel Dashboard:**
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable
4. Redeploy

**Via CLI:**
```bash
vercel env add DATABASE_URL
vercel env add NEXT_PUBLIC_APP_URL
```

## Database Setup for Production

### Option 1: Vercel Postgres (Recommended)

1. **Create Vercel Postgres Database**
   - In your Vercel project, go to "Storage"
   - Click "Create Database"
   - Select "Postgres"
   - Follow setup instructions

2. **Update Environment Variable**
   - Vercel will automatically add `POSTGRES_URL` and other variables
   - Update your `DATABASE_URL` to use the Postgres URL

3. **Run Migrations**
   ```bash
   vercel env pull .env.production
   npx prisma migrate deploy
   ```

### Option 2: Other Database Providers

- **PlanetScale**: MySQL-compatible, generous free tier
- **Railway**: Postgres, easy setup
- **Supabase**: Postgres with extra features

## PWA Icons Setup

### Generate Icons

1. **Use Mazar Logo**
   - Source: `public/mazar.png`
   - Should be at least 512x512px

2. **Generate All Sizes**
   We need these sizes:
   - 72x72, 96x96, 128x128, 144x144, 152x152, 167x167, 180x180, 192x192, 384x384, 512x512

3. **Using Online Tools**
   - Visit [realfavicongenerator.net](https://realfavicongenerator.net/)
   - Upload your Mazar logo
   - Generate and download all sizes
   - Place in `public/icons/` directory

4. **Manual Generation (ImageMagick)**
   ```bash
   # Install ImageMagick first
   convert mazar.png -resize 72x72 public/icons/icon-72x72.png
   convert mazar.png -resize 96x96 public/icons/icon-96x96.png
   convert mazar.png -resize 128x128 public/icons/icon-128x128.png
   # ... repeat for all sizes
   ```

## Post-Deployment Checklist

### Testing

- [ ] Visit your production URL
- [ ] Test all pages load correctly
- [ ] Test login/register
- [ ] Test route creation
- [ ] Test reservations
- [ ] Test PWA installation (see PWA_INSTALL_GUIDE.md)

### PWA Verification

1. **Open Chrome DevTools**
   - Go to Application tab
   - Check "Manifest" - should show no errors
   - Check "Service Workers" - should be registered
   - Run Lighthouse audit (aim for 100/100 PWA score)

2. **Test Installation**
   - Chrome Android: Should show install banner
   - Safari iOS: Follow custom instructions
   - Desktop: Should show install icon in address bar

### Performance

1. **Run Lighthouse Audit**
   - Open Chrome DevTools
   - Go to Lighthouse tab
   - Run audit
   - Aim for:
     - Performance: 90+
     - PWA: 100
     - Accessibility: 90+

2. **Check Load Times**
   - Initial load: < 3 seconds
   - Page transitions: < 1 second

## Troubleshooting

### Build Fails

**Error: Prisma generate fails**
- Solution: Ensure `prisma generate` is in build command
- Check `DATABASE_URL` is set

**Error: Module not found**
- Solution: Run `npm install` locally and commit `package-lock.json`

### PWA Not Working

**Service Worker Not Registering**
- Solution: Ensure site is on HTTPS (Vercel provides this automatically)
- Check browser console for errors

**Install Prompt Not Showing**
- Solution: PWA criteria must be met:
  - Valid manifest.json
  - Service worker registered
  - Served over HTTPS
  - User has engaged with site

### Database Issues

**Connection Failed**
- Check `DATABASE_URL` is correct
- Ensure database is accessible from Vercel
- Run migrations: `npx prisma migrate deploy`

## Custom Domain Setup

1. **Add Domain in Vercel**
   - Go to project settings
   - Click "Domains"
   - Add your domain

2. **Update DNS**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or use Vercel nameservers

3. **Update Environment Variables**
   - Update `NEXT_PUBLIC_APP_URL` to your custom domain

## Monitoring & Analytics

### Vercel Analytics

Enable in project settings for:
- Page views
- Performance metrics
- User geography

### Error Tracking

Consider adding:
- Sentry for error tracking
- LogRocket for session replay

## Support

For issues:
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs

