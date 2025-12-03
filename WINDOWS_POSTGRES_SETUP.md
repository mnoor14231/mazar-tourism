# 🪟 PostgreSQL Setup for Windows (No Docker Needed)

Since Docker is not installed, we'll use PostgreSQL directly on Windows. This is actually simpler!

## 📥 Step 1: Install PostgreSQL

### Option A: Download Installer (Recommended)

1. **Download PostgreSQL:**
   - Go to: https://www.postgresql.org/download/windows/
   - Click "Download the installer"
   - Download **PostgreSQL 15** (or latest version)
   - File will be something like: `postgresql-15.x-windows-x64.exe`

2. **Run the Installer:**
   - Double-click the downloaded file
   - Click "Next" through the setup wizard
   - **Important:** Remember the password you set for the `postgres` user!
   - Port: Keep default `5432`
   - Locale: Default is fine
   - Click "Next" → "Next" → "Install"
   - Wait for installation to complete
   - **Uncheck** "Launch Stack Builder" (we don't need it)
   - Click "Finish"

3. **Verify Installation:**
   - Open **Command Prompt** or **PowerShell**
   - Type: `psql --version`
   - You should see the version number

---

## 🗄️ Step 2: Create Database

### Method 1: Using pgAdmin (GUI - Easiest)

1. **Open pgAdmin:**
   - Search for "pgAdmin 4" in Windows Start Menu
   - Open it (it may take a minute to load)

2. **Connect to Server:**
   - When it opens, you'll see "Servers" in the left panel
   - Click on "PostgreSQL 15" (or your version)
   - Enter the password you set during installation
   - Click "OK"

3. **Create Database:**
   - Right-click on "Databases"
   - Click "Create" → "Database..."
   - Name: `madinah_tourism`
   - Click "Save"

### Method 2: Using Command Line

1. **Open Command Prompt or PowerShell**

2. **Connect to PostgreSQL:**
   ```bash
   psql -U postgres
   ```
   - Enter your password when prompted

3. **Create Database:**
   ```sql
   CREATE DATABASE madinah_tourism;
   ```

4. **Exit:**
   ```sql
   \q
   ```

---

## ⚙️ Step 3: Update .env File

Open `.env` file in your project and update it with your PostgreSQL password:

```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/madinah_tourism?schema=public"
```

**Replace `YOUR_PASSWORD` with the password you set during PostgreSQL installation!**

---

## 🚀 Step 4: Setup Database

Now run:

```bash
npm run db:setup
```

This will:
- Generate Prisma Client
- Create all tables
- Seed with your data

---

## ✅ Step 5: Verify It Works

```bash
npm run prisma:studio
```

This opens http://localhost:5555 where you can see all your data!

---

## 🆘 Troubleshooting

### "psql: command not found"
**Solution:** PostgreSQL is not in your PATH
- Reinstall PostgreSQL and make sure to check "Add to PATH" option
- Or use pgAdmin instead

### "Password authentication failed"
**Solution:** Wrong password
- Check your `.env` file has the correct password
- Try resetting PostgreSQL password (see below)

### "Database does not exist"
**Solution:** Create it manually
```sql
-- In pgAdmin or psql:
CREATE DATABASE madinah_tourism;
```

### "Connection refused"
**Solution:** PostgreSQL service not running
- Open **Services** (Win+R → `services.msc`)
- Find "postgresql-x64-15" (or your version)
- Right-click → Start

### Reset PostgreSQL Password (if forgotten)
1. Open `C:\Program Files\PostgreSQL\15\data\pg_hba.conf`
2. Find line: `host all all 127.0.0.1/32 scram-sha-256`
3. Change to: `host all all 127.0.0.1/32 trust`
4. Restart PostgreSQL service
5. Connect: `psql -U postgres`
6. Reset password: `ALTER USER postgres WITH PASSWORD 'newpassword';`
7. Change `pg_hba.conf` back to `scram-sha-256`
8. Restart service again

---

## 📊 Alternative: Use SQLite (Even Simpler!)

If PostgreSQL is too complex, we can use SQLite instead (file-based, no installation needed). Let me know if you want this option!

---

## ✅ Quick Checklist

- [ ] PostgreSQL installed
- [ ] Database `madinah_tourism` created
- [ ] `.env` file updated with correct password
- [ ] Ran `npm run db:setup`
- [ ] Ran `npm run prisma:studio` to verify

---

## 🎉 You're Done!

Once you complete these steps, your database will be ready and all your data will be stored there instead of localStorage!

