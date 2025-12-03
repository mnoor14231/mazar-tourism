# Quick Start Guide

## 🚀 Deploy to Vercel (Production - No Manual Setup!)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit with database"
   git push
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Click "Deploy"

3. **Add Database (One-time):**
   - Go to your project on Vercel
   - Click "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Click "Continue"
   - **Done!** Database URL is set automatically

4. **Seed Database (One-time):**
   - Install Vercel CLI: `npm i -g vercel`
   - Pull environment variables: `vercel env pull .env.local`
   - Run seed: `npx prisma db seed`

Your app is now live with a fully working database! 🎉

---

## 💻 Local Development

### Quick Setup (Docker - Recommended):

```bash
# 1. Start PostgreSQL with Docker
docker run --name madinah-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=madinah_tourism -p 5432:5432 -d postgres:15

# 2. Setup database
npm run db:setup

# 3. Start development server
npm run dev
```

### Manual Setup:

```bash
# 1. Install PostgreSQL (if not installed)
# Download from: https://www.postgresql.org/download/

# 2. Create .env file
echo 'DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/madinah_tourism?schema=public"' > .env

# 3. Setup database
npm run db:setup

# 4. Start development server
npm run dev
```

---

## 📊 Database Management

```bash
# View database (visual browser)
npm run prisma:studio

# Reset database
npm run db:push -- --force-reset
npm run db:seed

# Update schema
# 1. Edit prisma/schema.prisma
# 2. Run: npm run db:push
```

---

## 🔄 Workflow

### Making Schema Changes:

1. Edit `prisma/schema.prisma`
2. Run `npm run db:push`
3. Commit and push to GitHub
4. Vercel automatically applies changes

### Adding New Data:

1. Edit `prisma/seed.ts`
2. Run `npm run db:seed`
3. For production: Run seed via Vercel CLI

---

## ✅ Verification

After setup, verify everything works:

```bash
# Open Prisma Studio
npm run prisma:studio

# You should see:
# ✓ users (manager, user1)
# ✓ places (8 places)
# ✓ filter_categories (4 categories)
# ✓ filter_options (multiple options)
```

---

## 🆘 Troubleshooting

**"Connection refused":**
- Check PostgreSQL is running
- Docker: `docker start madinah-postgres`

**"Table doesn't exist":**
```bash
npm run db:push
npm run db:seed
```

**Fresh start:**
```bash
npm run db:push -- --force-reset
npm run db:seed
```

---

## 📝 Notes

- **Vercel deployment**: Database setup is automatic!
- **Local development**: Requires PostgreSQL (Docker recommended)
- **No manual migration**: Use `db:push` for development
- **Production changes**: Automatic on each deployment

