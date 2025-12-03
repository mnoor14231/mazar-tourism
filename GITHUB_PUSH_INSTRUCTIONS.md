# 📤 Push to GitHub - Quick Guide

## Option 1: Create New Repository on GitHub (Recommended)

### A. Create Repository

1. **Go to**: https://github.com/new
2. **Repository name**: `mazar-tourism` (or your preferred name)
3. **Description**: "Mazar - Tourism platform for exploring Madinah"
4. **Visibility**: Public or Private (your choice)
5. **DON'T** initialize with README (we already have files)
6. **Click**: "Create repository"

### B. Push Your Code

GitHub will show you commands. Use these:

```bash
cd c:\Users\hp\Desktop\tourist

# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/mazar-tourism.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME`** with your GitHub username!

---

## Option 2: Push to Existing Repository

If you want to use an existing repo (like tahcom-portal):

```bash
cd c:\Users\hp\Desktop\tourist

# Add existing repository as remote
git remote add origin https://github.com/mnoor14231/tahcom-portal.git

# Push
git branch -M main
git push -u origin main --force
```

⚠️ **Warning**: This will overwrite the existing repository!

---

## ✅ Verify Push

After pushing, visit your GitHub repository URL:
- You should see all 114 files
- Including the new PWA files
- Icons in `public/icons/` folder

---

## 🚀 Next: Deploy to Vercel

Once pushed to GitHub:

1. **Go to**: https://vercel.com/new
2. **Click**: "Import" next to your repository
3. **Configure**:
   - Framework: Next.js ✅
   - Environment Variable: `DATABASE_URL=file:./prisma/dev.db`
4. **Deploy!**

**Your app will be live in 2-3 minutes!** 🎉

---

## 🔐 Authentication

If Git asks for authentication:

**Personal Access Token (Recommended):**
1. Go to https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: `repo`
4. Copy token
5. Use token as password when pushing

---

## ❓ Need Help?

**Error: "remote origin already exists"**
```bash
git remote remove origin
# Then add again
```

**Error: "rejected - non-fast-forward"**
```bash
git pull origin main --allow-unrelated-histories
git push origin main
```

---

**Ready?** Choose Option 1 or 2 above and push to GitHub!

**Then go to Vercel to deploy!** 🚀

