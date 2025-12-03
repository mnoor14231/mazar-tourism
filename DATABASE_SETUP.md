# Database Setup Guide

This project uses **Prisma + PostgreSQL** for database management, which works perfectly with Vercel deployment.

## Option 1: Vercel Postgres (Recommended for Production)

### Automatic Setup on Vercel:

1. **Deploy to Vercel:**
   ```bash
   git add .
   git commit -m "Add database"
   git push
   ```

2. **Add Vercel Postgres:**
   - Go to your project dashboard on Vercel
   - Click "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Click "Continue"
   - Vercel will automatically set the `DATABASE_URL` environment variable

3. **Run migrations:**
   ```bash
   # After database is created, Vercel will run migrations automatically
   # Or manually via Vercel CLI:
   vercel env pull .env.local
   npx prisma migrate deploy
   npx prisma db seed
   ```

## Option 2: Local Development

### Using Docker (Easiest):

1. **Install Docker Desktop**

2. **Run PostgreSQL:**
   ```bash
   docker run --name madinah-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=madinah_tourism -p 5432:5432 -d postgres:15
   ```

3. **Setup database:**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Push schema to database
   npm run db:push

   # Seed with initial data
   npm run db:seed
   ```

### Manual PostgreSQL Installation:

1. **Install PostgreSQL** from https://www.postgresql.org/download/

2. **Create database:**
   ```sql
   CREATE DATABASE madinah_tourism;
   ```

3. **Update .env** file:
   ```
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/madinah_tourism?schema=public"
   ```

4. **Setup database:**
   ```bash
   npm run prisma:generate
   npm run db:push
   npm run db:seed
   ```

## Database Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create migration (when schema changes)
npm run prisma:migrate

# Push schema without migration (development)
npm run db:push

# Seed database with initial data
npm run db:seed

# Open Prisma Studio (visual database browser)
npm run prisma:studio
```

## Environment Variables

### Local (.env):
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/madinah_tourism?schema=public"
```

### Vercel (automatic):
- `DATABASE_URL` is set automatically when you add Vercel Postgres

## Troubleshooting

### "Connection refused":
- Make sure PostgreSQL is running
- Check the DATABASE_URL is correct
- For Docker: `docker start madinah-postgres`

### "Table does not exist":
- Run: `npm run db:push`
- Then: `npm run db:seed`

### Fresh start:
```bash
# Delete and recreate database
npm run db:push -- --force-reset
npm run db:seed
```

## Production Deployment

1. **Push to GitHub**
2. **Deploy to Vercel**
3. **Add Vercel Postgres** in Storage tab
4. Database migrations run automatically on build
5. Seed data: Run seed command once via Vercel CLI or add to build process

The database will work automatically with no manual intervention!

