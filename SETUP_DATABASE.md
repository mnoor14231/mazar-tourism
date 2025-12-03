# 🚀 Database Setup - Quick Start

## Step 1: Create .env File

Create a file named `.env` in the project root (c:\Users\hp\Desktop\tourist\) with this content:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/madinah_tourism?schema=public"
```

**Note**: Replace `postgres:postgres` with your actual PostgreSQL username:password if different.

## Step 2: Start PostgreSQL

### Option A: Using Docker (Easiest):
```bash
docker run --name madinah-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=madinah_tourism -p 5432:5432 -d postgres:15
```

### Option B: Use your existing PostgreSQL installation
Just make sure it's running and you have a database named `madinah_tourism`.

## Step 3: Setup Database

Run this single command:

```bash
npm run db:setup
```

This will:
- Generate Prisma Client
- Push schema to database  
- Seed with all your current data (places, filters, users, etc.)

## Step 4: View Your Database

To see your data in a beautiful UI:

```bash
npm run prisma:studio
```

This opens a web interface at http://localhost:5555 where you can:
- ✅ View all tables
- ✅ See all data
- ✅ Edit records
- ✅ Delete records
- ✅ Add new records

## ✅ Verify Setup

1. Open Prisma Studio: `npm run prisma:studio`
2. Check you have:
   - 2 users (manager, user1)
   - 8 places (المسجد النبوي, مسجد قباء, etc.)
   - 4 filter categories
   - Multiple filter options

## 🎉 Done!

Your database is now setup and the app will use it instead of localStorage!

## 📊 Database Tables

- **users** - manager and user accounts
- **places** - all tourist locations
- **filter_categories** - dynamic filters
- **filter_options** - filter values
- **reservations** - booking records
- **saved_routes** - user's saved routes (NEW!)

## 🔄 Reset Database

If you ever need to reset:

```bash
npm run db:push -- --force-reset
npm run db:seed
```

## 🚫 Troubleshooting

**"Connection refused":**
- PostgreSQL is not running
- Docker: `docker start madinah-postgres`

**"Database does not exist":**
```sql
CREATE DATABASE madinah_tourism;
```

**Can't create .env file:**
- It's blocked by .gitignore (which is good for security)
- Create it manually in the project root
- Copy the DATABASE_URL from above

