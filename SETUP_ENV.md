# Environment Setup

## Create .env File

Since `.env` is ignored by git (for security), you need to create it manually:

### For Local Development:

Create a file named `.env` in the project root with this content:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/madinah_tourism?schema=public"
```

**Note**: Replace `postgres:postgres` with your actual PostgreSQL username and password.

### For Docker:

If using Docker PostgreSQL:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/madinah_tourism?schema=public"
```

### For Vercel:

**No manual setup needed!** Vercel Postgres sets `DATABASE_URL` automatically when you:
1. Go to your project dashboard
2. Click "Storage" tab
3. Click "Create Database"
4. Select "Postgres"

## Quick Commands

After creating `.env`:

```bash
# 1. Generate Prisma Client
npm run prisma:generate

# 2. Push schema to database
npm run db:push

# 3. Seed with initial data
npm run db:seed

# 4. Start development
npm run dev
```

Or use the one-command setup:

```bash
npm run db:setup
```

## Verify Setup

Open Prisma Studio to see your data:

```bash
npm run prisma:studio
```

You should see:
- ✓ 2 users (manager, user1)
- ✓ 8 places (المسجد النبوي, مسجد قباء, etc.)
- ✓ 4 filter categories
- ✓ Multiple filter options

## Troubleshooting

**"Connection refused":**
- Make sure PostgreSQL is running
- Check your DATABASE_URL is correct
- For Docker: `docker start madinah-postgres`

**"P1001: Can't reach database":**
- PostgreSQL service not running
- Wrong credentials in DATABASE_URL
- Database doesn't exist

**Fresh start:**
```bash
npm run db:push -- --force-reset
npm run db:seed
```

