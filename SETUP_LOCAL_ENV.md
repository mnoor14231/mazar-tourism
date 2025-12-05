# Setup Local Environment to Connect to Supabase

## Quick Setup

To connect your localhost to the same Supabase database as Vercel, create a `.env.local` file in the project root.

## Step 1: Create .env.local File

Create a file named `.env.local` in the project root (`c:\Users\hp\Desktop\tourist\.env.local`) with this content:

```env
# Supabase PostgreSQL Connection (from Vercel)
# These variables connect localhost to the same database as Vercel production

database_POSTGRES_PRISMA_URL="postgres://postgres.pzothjsygicyndokrgbd:ugF2XUwD5w5sSzha@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
database_POSTGRES_URL_NON_POOLING="postgres://postgres.pzothjsygicyndokrgbd:ugF2XUwD5w5sSzha@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
```

## Step 2: Regenerate Prisma Client

After creating the `.env.local` file, run:

```bash
npx prisma generate
```

## Step 3: Test Connection

Test the connection by running:

```bash
npm run prisma:studio
```

This should open Prisma Studio and show your database tables. If it works, you're connected!

## Step 4: Start Development Server

```bash
npm run dev
```

Now your localhost will use the same database as Vercel!

## Troubleshooting

**Error: "Can't reach database server"**
- Make sure `.env.local` file exists and has the correct values
- Check that the file is in the project root (same folder as `package.json`)

**Error: "Prisma Client not generated"**
- Run `npx prisma generate` again
- Make sure you're in the project root directory

**Still seeing old data?**
- Restart your dev server: Stop it (Ctrl+C) and run `npm run dev` again
- Clear browser cache

## Important Notes

- `.env.local` is git-ignored (won't be committed to GitHub)
- This connects to your production Supabase database
- Changes made locally will appear on Vercel too
- Be careful when testing - you're working with production data!

