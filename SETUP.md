# 🚀 Quick Setup Guide

## Step-by-Step Installation

### 1. Install Dependencies
Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages including:
- Next.js
- React
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Leaflet (maps)

### 2. Start the Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to: **http://localhost:3000**

### 4. Login
Use one of these demo accounts:

**Manager Account** (Full Access):
- Username: `manager`
- Password: `123`

**User Account** (View Only):
- Username: `user1`
- Password: `123`

## 🎯 What You'll See

1. **Login Page** - Start here with the credentials above
2. **Reference Page** (مرجع) - Browse and filter Madinah places
   - View all places as cards
   - Filter by type, audience, environment, booking
   - Click "تفاصيل" to see full details
   - Toggle map view to see locations
   - As manager: Add/Edit/Delete places
3. **Routes Page** (مسار) - Placeholder for future features
4. **Experiences Page** (تجربة) - Placeholder for future features

## 📱 Testing the App

### As a Regular User (user1)
1. Login with `user1` / `123`
2. Browse the places
3. Apply different filters
4. Click on "تفاصيل" to see place details
5. Toggle the map view
6. Click map markers to see place info

### As a Manager (manager)
1. Login with `manager` / `123`
2. Click "إضافة مكان جديد" to add a place
3. Fill in the form and save
4. Edit an existing place using the "تعديل" button
5. Delete a place using the "حذف" button (with confirmation)
6. All changes persist in localStorage

## 🔧 Troubleshooting

### Port Already in Use
If port 3000 is busy, Next.js will suggest another port, or you can specify one:
```bash
npm run dev -- -p 3001
```

### Module Not Found Errors
Make sure you've run:
```bash
npm install
```

### Map Not Loading
The map requires internet connection to load tiles from OpenStreetMap.

### Changes Not Reflecting
Try:
1. Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Restart the dev server

## 📦 Building for Production

```bash
npm run build
npm start
```

## 🎨 Customization Tips

### Adding More Places
As a manager, use the "إضافة مكان جديد" button in the Reference page.

### Modifying Styles
Edit `app/globals.css` or Tailwind classes in components.

### Changing Initial Data
Edit `lib/mockData.ts` to modify the default places.

## 🆘 Need Help?

Check the main `README.md` for:
- Full feature documentation
- Project structure
- Technical details
- Future roadmap

---

Enjoy exploring Madinah! 🕌

