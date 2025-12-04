# Database Seeding for Production

## Important: Database Data Preservation

The seed script has been updated to **preserve existing data**. It will only seed if the database is empty.

## First-Time Setup

After deploying to Vercel, you need to seed the database **once**:

### Option 1: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Pull environment variables
vercel env pull .env.local

# Run seed (one time only)
npx prisma db seed
```

### Option 2: Using Vercel Dashboard

1. Go to your Vercel project
2. Go to Settings → Environment Variables
3. Make sure `database_POSTGRES_PRISMA_URL` and `database_POSTGRES_URL_NON_POOLING` are set
4. Go to Deployments
5. Click on the latest deployment
6. Go to "Functions" tab
7. You can run a one-time seed via Vercel's function logs or use Vercel CLI

### Option 3: Manual API Call

You can also use the `/api/seed` endpoint (if available) through the admin page at `/admin`.

## Important Notes

- **Seed runs only once**: The seed script checks if data exists and skips if found
- **Build process**: Vercel build no longer runs seed automatically (to preserve data)
- **Schema changes**: Use `prisma db push` or migrations for schema updates
- **Data safety**: Your data will NOT be deleted on redeploy

## Troubleshooting

If you need to reseed (clear and reseed):

1. **Warning**: This will delete all existing data!
2. Temporarily modify `prisma/seed.ts` to remove the data check
3. Run seed once
4. Restore the data check in `prisma/seed.ts`

## Adding New Places

Use the admin interface at `/admin` or add places through the reference page (if logged in as manager).

