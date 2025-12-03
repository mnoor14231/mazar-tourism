# Generate PWA Icons for Mazar App

## Quick Start - Online Tool (Easiest)

### Option 1: RealFaviconGenerator (Recommended)

1. Visit https://realfavicongenerator.net/
2. Upload `/public/mazar.png`
3. Configure settings:
   - iOS: Use your logo as-is
   - Android: Add padding for maskable icons
   - Windows: Use your colors (#195B4A)
4. Generate and download
5. Extract to `/public/icons/` directory

### Option 2: PWA Asset Generator

1. Visit https://tools.crawlink.com/tools/pwa-icon-generator/
2. Upload your logo
3. Download all generated icons
4. Place in `/public/icons/` directory

## Required Icon Sizes

Create these sizes from `public/mazar.png`:

```
/public/icons/
├── icon-72x72.png
├── icon-96x96.png
├── icon-128x128.png
├── icon-144x144.png
├── icon-152x152.png      (Apple Touch Icon)
├── icon-167x167.png      (iPad Pro)
├── icon-180x180.png      (iPhone)
├── icon-192x192.png      (Android)
├── icon-384x384.png      (Android)
└── icon-512x512.png      (Splash screen)
```

## Manual Generation with ImageMagick

### Install ImageMagick

**Windows:**
```powershell
choco install imagemagick
```

**Mac:**
```bash
brew install imagemagick
```

**Linux:**
```bash
sudo apt-get install imagemagick
```

### Generate All Sizes

Run this script in your project root:

```bash
# Create icons directory
mkdir -p public/icons

# Generate all sizes
convert public/mazar.png -resize 72x72 public/icons/icon-72x72.png
convert public/mazar.png -resize 96x96 public/icons/icon-96x96.png
convert public/mazar.png -resize 128x128 public/icons/icon-128x128.png
convert public/mazar.png -resize 144x144 public/icons/icon-144x144.png
convert public/mazar.png -resize 152x152 public/icons/icon-152x152.png
convert public/mazar.png -resize 167x167 public/icons/icon-167x167.png
convert public/mazar.png -resize 180x180 public/icons/icon-180x180.png
convert public/mazar.png -resize 192x192 public/icons/icon-192x192.png
convert public/mazar.png -resize 384x384 public/icons/icon-384x384.png
convert public/mazar.png -resize 512x512 public/icons/icon-512x512.png

echo "✅ All icons generated successfully!"
```

### PowerShell Script (Windows)

Save this as `generate-icons.ps1`:

```powershell
# Create icons directory
New-Item -Path "public\icons" -ItemType Directory -Force

# Icon sizes
$sizes = @(72, 96, 128, 144, 152, 167, 180, 192, 384, 512)

# Generate each size
foreach ($size in $sizes) {
    Write-Host "Generating ${size}x${size}..."
    magick convert public\mazar.png -resize "${size}x${size}" "public\icons\icon-${size}x${size}.png"
}

Write-Host "✅ All icons generated successfully!" -ForegroundColor Green
```

Run:
```powershell
.\generate-icons.ps1
```

## Using Node.js (Cross-platform)

### Install sharp

```bash
npm install sharp --save-dev
```

### Create `scripts/generate-icons.js`

```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 167, 180, 192, 384, 512];
const sourceImage = 'public/mazar.png';
const outputDir = 'public/icons';

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate all icon sizes
Promise.all(
  sizes.map(size => {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    console.log(`Generating ${size}x${size}...`);
    
    return sharp(sourceImage)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 25, g: 91, b: 74, alpha: 1 } // #195B4A
      })
      .png()
      .toFile(outputPath);
  })
)
.then(() => {
  console.log('✅ All icons generated successfully!');
})
.catch(err => {
  console.error('❌ Error generating icons:', err);
});
```

### Run the script

```bash
node scripts/generate-icons.js
```

### Add to package.json

```json
{
  "scripts": {
    "generate:icons": "node scripts/generate-icons.js"
  }
}
```

Then run:
```bash
npm run generate:icons
```

## Icon Guidelines

### Source Image Requirements

- **Format**: PNG with transparency
- **Size**: At least 512x512px (1024x1024 recommended)
- **Content**: Logo should be centered
- **Safe Area**: Keep important content within 80% of canvas
- **Background**: Transparent or solid color matching brand

### Maskable Icons

For Android adaptive icons, your logo should:
- Have padding around edges (20% safe zone)
- Work on any background color
- Be centered in the canvas

### Testing Icons

1. **View in Browser**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000/icons/icon-192x192.png

2. **Test Manifest**
   - Open Chrome DevTools
   - Go to Application > Manifest
   - Check all icons are found
   - No errors should appear

3. **Test Installation**
   - Install PWA
   - Check home screen icon looks good
   - Try different device sizes

## Optimization

### Compress Icons (Optional)

After generation, optimize file sizes:

```bash
# Using ImageMagick
mogrify -strip -quality 85 public/icons/*.png

# Or use TinyPNG
# Visit https://tinypng.com/ and upload icons
```

### Verify Sizes

```bash
# Check file sizes
ls -lh public/icons/

# Ideal sizes:
# 72x72: < 5KB
# 192x192: < 15KB
# 512x512: < 50KB
```

## Troubleshooting

### Icons Not Showing

1. Clear browser cache
2. Check file paths in `manifest.json`
3. Verify icons exist: `ls public/icons/`
4. Check console for 404 errors

### Icons Look Pixelated

- Use higher resolution source image
- Ensure source is at least 512x512px
- Check PNG quality settings

### Icons Have Wrong Background

- Ensure source PNG has transparency
- Or set desired background color in generation script

## Alternative: Use Figma

1. Open Mazar logo in Figma
2. Create frames for each icon size
3. Export as PNG
4. Download and place in `/public/icons/`

## Verification Checklist

- [ ] All 10 icon sizes generated
- [ ] Icons placed in `/public/icons/` directory  
- [ ] manifest.json points to correct paths
- [ ] Icons load without 404 errors
- [ ] Icons look good on different backgrounds
- [ ] File sizes are optimized
- [ ] Tested PWA installation
- [ ] Home screen icon looks correct

## Next Steps

After generating icons:
1. Test locally: `npm run dev`
2. Check manifest: DevTools > Application > Manifest
3. Test installation on device
4. Deploy to Vercel
5. Test on production URL

---

Need help? Check the PWA_INSTALL_GUIDE.md for testing instructions.

