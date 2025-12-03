# 🚀 Quick Test Guide

## Database is Ready!

Your database has been successfully set up and seeded with initial data.

## Step 1: Start the App

```bash
npm run dev
```

The app will run at http://localhost:3000

## Step 2: View Your Database

**In a NEW terminal window**, run:

```bash
npm run prisma:studio
```

This opens Prisma Studio at http://localhost:5555

> ⚠️ **Important**: Run this in a **different** terminal window while your dev server is running!

## Step 3: Test the Features

### Test 1: Login with Existing User
1. Go to http://localhost:3000
2. Click "تسجيل الدخول" (Login)
3. Use these credentials:
   - **Manager**: Username: `admin`, Password: `admin123`
   - **Regular User**: Username: `user1`, Password: `pass123`

### Test 2: Create New User
1. Login with any new username/password
2. The account will be automatically created and saved to database
3. Check Prisma Studio → `User` table to see the new user!

### Test 3: View Places
1. Go to "مرجع" (Reference) page
2. You should see 8 places (mosques, museums, parks, etc.)
3. All data is loaded from the database!

### Test 4: Make a Reservation (as regular user)
1. Click on any place that requires booking
2. Click "احجز الآن" (Book Now)
3. Complete the fake payment process
4. Check Prisma Studio → `Reservation` table to see your reservation!

### Test 5: Create a Route
1. Go to "مسار" (Routes) page
2. Select "اختيار يدوي" (Manual Selection)
3. Choose 1-3 places
4. Click "إنشاء المسار" (Create Route)
5. Optionally save the route
6. Check Prisma Studio → `SavedRoute` table!

### Test 6: Add New Place (as manager)
1. Login as admin (username: `admin`, password: `admin123`)
2. Go to "مرجع" page
3. Click "إضافة مكان" (Add Place)
4. Fill in details and paste a Google Maps link
5. Save the place
6. Check Prisma Studio → `Place` table!

## Watching Data Changes in Real-Time

Keep Prisma Studio open while using the app. Every time you:
- Create a place
- Make a reservation  
- Save a route
- Register a new user

You'll see the data appear in Prisma Studio immediately!

## Troubleshooting

### Issue: Can't run `prisma generate`
**Solution**: This happens if the dev server is running. The Prisma Client is already generated and working. No action needed!

### Issue: "Failed to fetch"
**Solution**: Make sure the dev server is running on port 3000

### Issue: Database not showing data
**Solution**: 
```bash
npm run db:seed
```

### Issue: Need fresh start
```bash
# Stop dev server (Ctrl+C)
# Remove database
Remove-Item prisma\dev.db -Force
# Recreate and seed
npm run db:setup
# Start dev server
npm run dev
```

## What's Working

✅ SQLite database in `prisma/dev.db`
✅ 8 places seeded  
✅ 2 users seeded (admin & user1)
✅ Dynamic filters
✅ User registration saves to database
✅ Reservations save to database
✅ Routes can be saved to database
✅ Prisma Studio for viewing data
✅ All CRUD operations working

## Next: Deploy to Production

See `DATABASE_SETUP_COMPLETE.md` for deployment instructions!

---

**Ready to test!** Open two terminals:
1. `npm run dev`
2. `npm run prisma:studio`

Then start exploring! 🎉

