const { execSync } = require('child_process');
const fs = require('fs');

console.log('🗄️  Setting up database...\n');

// Check if .env exists, if not create it
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file...');
  const envContent = 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/madinah_tourism?schema=public"\n';
  fs.writeFileSync('.env', envContent);
  console.log('✓ .env file created\n');
}

try {
  // Generate Prisma Client
  console.log('📦 Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✓ Prisma Client generated\n');

  // Push schema to database
  console.log('🔄 Pushing schema to database...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('✓ Schema pushed\n');

  // Seed database
  console.log('🌱 Seeding database...');
  execSync('npx prisma db seed', { stdio: 'inherit' });
  console.log('✓ Database seeded\n');

  console.log('✅ Database setup complete!');
  console.log('\nYou can now run: npm run dev');
  console.log('Or view your database: npm run prisma:studio\n');
} catch (error) {
  console.error('\n❌ Error setting up database:', error.message);
  console.log('\nMake sure PostgreSQL is running.');
  console.log('Quick start with Docker:');
  console.log('docker run --name madinah-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=madinah_tourism -p 5432:5432 -d postgres:15\n');
  process.exit(1);
}

