# رحلتي في المدينة (Madinah Tourism App)

A comprehensive tourism application for Madinah featuring places directory, AI-powered route planning, and reservation management.

## 🚀 Quick Deploy to Vercel (No Manual Setup!)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. **Deploy to Vercel:**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Click "Deploy"

3. **Add Vercel Postgres (One-time):**
   - Go to your project on Vercel dashboard
   - Click "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Click "Continue"
   - **Done!** Vercel automatically sets `DATABASE_URL`

4. **Seed Database (One-time via Vercel CLI):**
   ```bash
   npm i -g vercel
   vercel link
   vercel env pull .env.local
   npx prisma db seed
   ```

Your app is now live with a fully working database! 🎉

---

## 💻 Local Development Setup

### Prerequisites:
- Node.js 18+ installed
- PostgreSQL (or Docker)

### Option 1: Docker (Easiest)

```bash
# 1. Start PostgreSQL
docker run --name madinah-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=madinah_tourism \
  -p 5432:5432 \
  -d postgres:15

# 2. Create .env file
echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/madinah_tourism?schema=public"' > .env

# 3. Setup database
npm run db:setup

# 4. Start development server
npm run dev
```

### Option 2: Manual PostgreSQL

1. **Install PostgreSQL:**
   - Download from https://www.postgresql.org/download/
   - Install and remember your password

2. **Create Database:**
   ```sql
   CREATE DATABASE madinah_tourism;
   ```

3. **Create .env file:**
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/madinah_tourism?schema=public"
   ```

4. **Setup:**
   ```bash
   npm install
   npm run db:setup
   npm run dev
   ```

---

## 📦 Project Structure

```
├── app/                    # Next.js App Router
│   ├── reference/         # Places directory
│   ├── routes/            # Route planning with AI
│   ├── experiences/       # Experiences (coming soon)
│   └── login/             # Authentication
├── components/            # React components
│   ├── routes/           # Route planning components
│   └── ...               # Shared components
├── lib/                   # Utilities
│   ├── store.ts          # Zustand state management
│   ├── prisma.ts         # Database client
│   └── routeUtils.ts     # Route calculation
├── prisma/                # Database
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Initial data
└── types/                 # TypeScript types
```

---

## 🗄️ Database

### Schema:
- **Users** - Authentication (user/manager roles)
- **Places** - Tourist locations with images, filters, coordinates
- **FilterCategories** - Dynamic filter system
- **FilterOptions** - Filter values
- **Reservations** - Booking management with QR codes

### Commands:
```bash
# View database (visual browser)
npm run prisma:studio

# Reset and reseed
npm run db:push -- --force-reset
npm run db:seed

# Update schema (after editing schema.prisma)
npm run db:push
```

---

## 🔐 Test Accounts

```
Manager: manager / 123
User: user1 / 123
```

---

## 🌟 Features

### 1. Reference (مرجع)
- Browse all tourist places
- Dynamic filter system (type, audience, environment, booking)
- Place details with images, hours, crowd levels
- Reservation system with QR codes
- Map integration

### 2. Routes (مسار)
- **Manual Selection**: Choose 1-3 places, automatic route optimization
- **Ibn Al-Madinah AI**: Chat-based route planning
  - Analyzes trip duration, type, age, preferences
  - Suggests personalized routes
  - Smart scoring based on user profile
- Interactive route map with markers
- Google Maps integration
- Distance and time estimation

### 3. Manager Features
- Add/edit/delete places
- Upload images (base64)
- Google Maps link parsing
- Dynamic filter management
- Reservation management

---

## 🔧 Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:setup         # One-command setup
npm run db:push          # Push schema changes
npm run db:seed          # Seed with data
npm run prisma:studio    # Visual database browser
npm run prisma:generate  # Generate Prisma Client

# Deployment
git push                 # Auto-deploys on Vercel
```

---

## 🚢 Deployment

### Vercel (Recommended):
1. Connect GitHub repository
2. Add Vercel Postgres database
3. Push code → Auto-deploys!

### Environment Variables:
- `DATABASE_URL` - Set automatically by Vercel Postgres
- No manual configuration needed!

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Database**: PostgreSQL + Prisma ORM
- **Maps**: React Leaflet + OpenStreetMap
- **Deployment**: Vercel
- **Authentication**: Custom (username/password)

---

## 📱 Responsive Design

- Mobile-first approach
- RTL (Right-to-Left) support for Arabic
- Touch-friendly interfaces
- Adaptive layouts

---

## 🔮 Future Enhancements

- [ ] Real AI integration (OpenAI/Claude)
- [ ] Social features (reviews, ratings)
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] Real-time notifications

---

## 📄 License

Private project for Madinah tourism.

---

## 🤝 Support

For issues or questions, see:
- `QUICK_START.md` - Quick setup guide
- `DATABASE_SETUP.md` - Detailed database guide
- Prisma docs: https://www.prisma.io/docs

---

**Built with ❤️ for Madinah tourism**
