import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Check if data already exists
  const existingPlacesCount = await prisma.place.count();
  const existingUsersCount = await prisma.user.count();
  
  // Only clear data if database is empty (first time seeding)
  if (existingPlacesCount > 0 || existingUsersCount > 0) {
    console.log('Database already contains data. Skipping seed to preserve existing data.');
    console.log(`Found ${existingPlacesCount} places and ${existingUsersCount} users.`);
    return;
  }

  console.log('Database is empty. Proceeding with initial seed...');

  // Clear existing data (should be empty anyway, but just in case)
  await prisma.reservation.deleteMany();
  await prisma.filterOption.deleteMany();
  await prisma.filterCategory.deleteMany();
  await prisma.place.deleteMany();
  await prisma.user.deleteMany();

  // Create default users
  const manager = await prisma.user.create({
    data: {
      username: 'manager',
      password: '123', // In production, use hashed passwords
      role: 'manager',
    },
  });

  const user1 = await prisma.user.create({
    data: {
      username: 'user1',
      password: '123',
      role: 'user',
    },
  });

  console.log('✓ Created users');

  // Create filter categories
  const typeCategory = await prisma.filterCategory.create({
    data: {
      name: 'type',
      nameAr: 'نوع المكان',
      type: 'single',
      options: {
        create: [
          { value: 'religious', label: 'ديني', order: 1 },
          { value: 'historical', label: 'تاريخي', order: 2 },
          { value: 'entertainment', label: 'ترفيهي', order: 3 },
        ],
      },
    },
  });

  const audienceCategory = await prisma.filterCategory.create({
    data: {
      name: 'audience',
      nameAr: 'الفئة',
      type: 'multi',
      options: {
        create: [
          { value: 'family', label: 'عائلي', order: 1 },
          { value: 'kids', label: 'أطفال', order: 2 },
          { value: 'seniors', label: 'كبار سن', order: 3 },
          { value: 'friends', label: 'أصدقاء', order: 4 },
        ],
      },
    },
  });

  const environmentCategory = await prisma.filterCategory.create({
    data: {
      name: 'environment',
      nameAr: 'البيئة',
      type: 'single',
      options: {
        create: [
          { value: 'indoor', label: 'داخلي', order: 1 },
          { value: 'outdoor', label: 'خارجي', order: 2 },
          { value: 'mixed', label: 'مختلط', order: 3 },
        ],
      },
    },
  });

  const bookingCategory = await prisma.filterCategory.create({
    data: {
      name: 'requiresBooking',
      nameAr: 'الحجز',
      type: 'single',
      options: {
        create: [
          { value: 'yes', label: 'يتطلب حجز', order: 1 },
          { value: 'no', label: 'بدون حجز', order: 2 },
        ],
      },
    },
  });

  console.log('✓ Created filter categories');

  // Create places
  const places = await Promise.all([
    prisma.place.create({
      data: {
        name: 'المسجد النبوي',
        description: 'أحد أعظم المساجد في الإسلام، يضم قبر النبي محمد ﷺ وصاحبيه أبو بكر وعمر رضي الله عنهما.',
        type: 'religious',
        audience: JSON.stringify(['family', 'seniors', 'friends']) as string,
        environment: 'mixed',
        requiresBooking: false,
        bookingsCount: 5000000,
        openingHours: '24 ساعة',
        crowdLevel: 'high',
        currentEvents: JSON.stringify(['صلاة التراويح', 'دروس دينية']) as string,
          images: JSON.stringify(['https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=800&q=80']) as string,
        latitude: 24.4672,
        longitude: 39.6111,
      },
    }),
    prisma.place.create({
      data: {
        name: 'مسجد قباء',
        description: 'أول مسجد بني في الإسلام، ويُستحب زيارته والصلاة فيه.',
        type: 'religious',
        audience: JSON.stringify(['family', 'seniors']) as string,
        environment: 'outdoor',
        requiresBooking: false,
        bookingsCount: 2000000,
        openingHours: '24 ساعة',
        crowdLevel: 'medium',
        currentEvents: JSON.stringify(['درس بعد الفجر']) as string,
        images: JSON.stringify(['https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=80']) as string,
        latitude: 24.4393,
        longitude: 39.6206,
      },
    }),
    prisma.place.create({
      data: {
        name: 'جبل أحد',
        description: 'موقع غزوة أحد التاريخية، من أهم المعالم الإسلامية في المدينة.',
        type: 'historical',
        audience: JSON.stringify(['family', 'friends']) as string,
        environment: 'outdoor',
        requiresBooking: false,
        bookingsCount: 800000,
        openingHours: 'طوال اليوم',
        crowdLevel: 'low',
        currentEvents: JSON.stringify([]) as string,
        images: JSON.stringify(['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80']) as string,
        latitude: 24.5109,
        longitude: 39.6217,
      },
    }),
    prisma.place.create({
      data: {
        name: 'متحف دار المدينة',
        description: 'متحف يعرض تاريخ المدينة المنورة وتراثها الإسلامي عبر مجموعة من المقتنيات النادرة.',
        type: 'historical',
        audience: JSON.stringify(['family', 'kids', 'friends']) as string,
        environment: 'indoor',
        requiresBooking: true,
        reservationPrice: 50,
        bookingsCount: 450000,
        openingHours: '9 صباحاً - 12 منتصف الليل (ماعدا الجمعة 4 - 12)',
        crowdLevel: 'low',
        currentEvents: JSON.stringify(['معرض خاص عن السيرة النبوية']) as string,
        images: JSON.stringify(['https://images.unsplash.com/photo-1565099824688-e93eb20fe622?w=800&q=80']) as string,
        latitude: 24.4747,
        longitude: 39.5834,
      },
    }),
    prisma.place.create({
      data: {
        name: 'النخيل مول',
        description: 'مركز تسوق حديث يضم العديد من المتاجر العالمية والمحلية، مطاعم متنوعة، ومناطق سينما.',
        type: 'entertainment',
        audience: JSON.stringify(['family', 'kids', 'friends']) as string,
        environment: 'indoor',
        requiresBooking: false,
        bookingsCount: 1500000,
        openingHours: '9 صباحاً - 12 منتصف الليل',
        crowdLevel: 'high',
        currentEvents: JSON.stringify(['عروض نهاية الموسم']) as string,
        images: JSON.stringify(['https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800']) as string,
        latitude: 24.4531,
        longitude: 39.5742,
      },
    }),
    prisma.place.create({
      data: {
        name: 'متحف السيرة النبوية',
        description: 'متحف متخصص في عرض السيرة النبوية من خلال مجسمات ووسائل تقنية حديثة.',
        type: 'historical',
        audience: JSON.stringify(['family', 'kids', 'seniors']) as string,
        environment: 'indoor',
        requiresBooking: true,
        reservationPrice: 30,
        bookingsCount: 300000,
        openingHours: '8 صباحاً - 10 مساءً',
        crowdLevel: 'medium',
        currentEvents: JSON.stringify([]) as string,
        images: JSON.stringify(['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80&auto=format&fit=crop']) as string,
        latitude: 24.4589,
        longitude: 39.6091,
      },
    }),
    prisma.place.create({
      data: {
        name: 'حديقة الملك فهد',
        description: 'حديقة كبيرة تضم مساحات خضراء واسعة، ملاعب للأطفال، ومسارات للمشي.',
        type: 'entertainment',
        audience: JSON.stringify(['family', 'kids']) as string,
        environment: 'outdoor',
        requiresBooking: false,
        bookingsCount: 650000,
        openingHours: '4 مساءً - 12 منتصف الليل',
        crowdLevel: 'medium',
        currentEvents: JSON.stringify(['مهرجان الربيع']) as string,
        images: JSON.stringify(['https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=800&q=80']) as string,
        latitude: 24.4912,
        longitude: 39.5586,
      },
    }),
    prisma.place.create({
      data: {
        name: 'مجمع الملك فهد لطباعة المصحف الشريف',
        description: 'مجمع متخصص في طباعة المصحف الشريف وترجمته. يمكن زيارته والتعرف على مراحل الطباعة.',
        type: 'religious',
        audience: JSON.stringify(['family', 'seniors', 'friends']) as string,
        environment: 'indoor',
        requiresBooking: true,
        reservationPrice: 25,
        bookingsCount: 500000,
        openingHours: '8 صباحاً - 3 مساءً (ماعدا الجمعة والسبت)',
        crowdLevel: 'low',
        currentEvents: JSON.stringify([]) as string,
        images: JSON.stringify(['https://images.unsplash.com/photo-1604881991720-f91add269bed?w=800&q=80']) as string,
        latitude: 24.4456,
        longitude: 39.5836,
      },
    }),
  ]);

  console.log(`✓ Created ${places.length} places`);

  console.log('✓ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

