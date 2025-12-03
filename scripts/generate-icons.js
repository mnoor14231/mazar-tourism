const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 167, 180, 192, 384, 512];
const sourceImage = path.join(__dirname, '..', 'public', 'mazar.png');
const outputDir = path.join(__dirname, '..', 'public', 'icons');

console.log('🎨 Generating PWA Icons for Mazar App...\n');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log('📁 Created icons directory\n');
}

// Check if source image exists
if (!fs.existsSync(sourceImage)) {
  console.error('❌ Error: Source image not found at:', sourceImage);
  console.error('Please ensure public/mazar.png exists');
  process.exit(1);
}

console.log('📷 Source image:', sourceImage);
console.log('📂 Output directory:', outputDir);
console.log('\n🔄 Generating icons...\n');

// Generate all icon sizes
Promise.all(
  sizes.map(async (size) => {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    console.log(`   ✓ Generating ${size}x${size}px...`);
    
    try {
      await sharp(sourceImage)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 25, g: 91, b: 74, alpha: 1 } // #195B4A - Mazar Green
        })
        .png({ quality: 90, compressionLevel: 9 })
        .toFile(outputPath);
      
      const stats = fs.statSync(outputPath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`      → Saved (${sizeKB} KB)`);
      
      return { size, path: outputPath, sizeKB };
    } catch (error) {
      console.error(`      ✗ Error generating ${size}x${size}:`, error.message);
      throw error;
    }
  })
)
.then((results) => {
  console.log('\n✅ All icons generated successfully!\n');
  console.log('📊 Summary:');
  console.log(`   Total icons: ${results.length}`);
  
  const totalSize = results.reduce((sum, r) => sum + parseFloat(r.sizeKB), 0);
  console.log(`   Total size: ${totalSize.toFixed(2)} KB`);
  
  console.log('\n📝 Generated files:');
  results.forEach(r => {
    console.log(`   - icon-${r.size}x${r.size}.png (${r.sizeKB} KB)`);
  });
  
  console.log('\n🎯 Next steps:');
  console.log('   1. Check icons in public/icons/ directory');
  console.log('   2. Test locally: npm run dev');
  console.log('   3. Visit http://localhost:3000/manifest.json');
  console.log('   4. Open DevTools > Application > Manifest');
  console.log('   5. Deploy to Vercel!');
  console.log('\n✨ Your PWA is ready!\n');
})
.catch((error) => {
  console.error('\n❌ Error generating icons:', error);
  console.error('\n💡 Make sure you have installed sharp:');
  console.error('   npm install sharp --save-dev');
  process.exit(1);
});

