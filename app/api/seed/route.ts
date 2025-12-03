import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    console.log('[SEED] Starting database seed...');

    // Clear existing data
    await prisma.reservation.deleteMany();
    await prisma.savedRoute.deleteMany();
    await prisma.filterOption.deleteMany();
    await prisma.filterCategory.deleteMany();
    await prisma.place.deleteMany();
    await prisma.user.deleteMany();

    console.log('[SEED] Cleared existing data');

    // Create default users
    const manager = await prisma.user.create({
      data: {
        username: 'manager',
        password: '123',
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

    console.log('[SEED] Created users');

    // Create filter categories
    await prisma.filterCategory.create({
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

    await prisma.filterCategory.create({
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

    await prisma.filterCategory.create({
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

    await prisma.filterCategory.create({
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

    console.log('[SEED] Created filter categories');

    // Create 8 places
    const places = await Promise.all([
      prisma.place.create({
        data: {
          name: 'المسجد النبوي',
          description: 'أحد أعظم المساجد في الإسلام، يضم قبر النبي محمد ﷺ وصاحبيه أبو بكر وعمر رضي الله عنهما.',
          type: 'religious',
          audience: JSON.stringify(['family', 'seniors', 'friends']),
          environment: 'mixed',
          requiresBooking: false,
          bookingsCount: 5000000,
          openingHours: '24 ساعة',
          crowdLevel: 'high',
          currentEvents: JSON.stringify(['صلاة التراويح', 'دروس دينية']),
          images: JSON.stringify(['https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=800']),
          latitude: 24.4672,
          longitude: 39.6111,
        },
      }),
      prisma.place.create({
        data: {
          name: 'مسجد قباء',
          description: 'أول مسجد بني في الإسلام، ويُستحب زيارته والصلاة فيه.',
          type: 'religious',
          audience: JSON.stringify(['family', 'seniors']),
          environment: 'outdoor',
          requiresBooking: false,
          bookingsCount: 2000000,
          openingHours: '24 ساعة',
          crowdLevel: 'medium',
          currentEvents: JSON.stringify(['درس بعد الفجر']),
          images: JSON.stringify(['https://images.unsplash.com/photo-1564769610854-034c0e4f41f5?w=800']),
          latitude: 24.4393,
          longitude: 39.6206,
        },
      }),
      prisma.place.create({
        data: {
          name: 'جبل أحد',
          description: 'موقع غزوة أحد التاريخية، من أهم المعالم الإسلامية في المدينة.',
          type: 'historical',
          audience: JSON.stringify(['family', 'friends']),
          environment: 'outdoor',
          requiresBooking: false,
          bookingsCount: 800000,
          openingHours: 'طوال اليوم',
          crowdLevel: 'low',
          currentEvents: JSON.stringify([]),
          images: JSON.stringify(['https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=800']),
          latitude: 24.5109,
          longitude: 39.6217,
        },
      }),
      prisma.place.create({
        data: {
          name: 'متحف دار المدينة',
          description: 'متحف يعرض تاريخ المدينة المنورة وتراثها الإسلامي عبر مجموعة من المقتنيات النادرة.',
          type: 'historical',
          audience: JSON.stringify(['family', 'kids', 'friends']),
          environment: 'indoor',
          requiresBooking: true,
          reservationPrice: 50,
          bookingsCount: 450000,
          openingHours: '9 صباحاً - 12 منتصف الليل (ماعدا الجمعة 4 - 12)',
          crowdLevel: 'low',
          currentEvents: JSON.stringify(['معرض خاص عن السيرة النبوية']),
          images: JSON.stringify(['https://images.unsplash.com/photo-1565789433644-46c5b4411f9f?w=800']),
          latitude: 24.4747,
          longitude: 39.5834,
        },
      }),
      prisma.place.create({
        data: {
          name: 'النخيل مول',
          description: 'مركز تسوق حديث يضم العديد من المتاجر العالمية والمحلية، مطاعم متنوعة، ومناطق سينما.',
          type: 'entertainment',
          audience: JSON.stringify(['family', 'kids', 'friends']),
          environment: 'indoor',
          requiresBooking: false,
          bookingsCount: 1500000,
          openingHours: '9 صباحاً - 12 منتصف الليل',
          crowdLevel: 'high',
          currentEvents: JSON.stringify(['عروض نهاية الموسم']),
          images: JSON.stringify(['https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800']),
          latitude: 24.4531,
          longitude: 39.5742,
        },
      }),
      prisma.place.create({
        data: {
          name: 'متحف السيرة النبوية',
          description: 'متحف متخصص في عرض السيرة النبوية من خلال مجسمات ووسائل تقنية حديثة.',
          type: 'historical',
          audience: JSON.stringify(['family', 'kids', 'seniors']),
          environment: 'indoor',
          requiresBooking: true,
          reservationPrice: 30,
          bookingsCount: 300000,
          openingHours: '8 صباحاً - 10 مساءً',
          crowdLevel: 'medium',
          currentEvents: JSON.stringify([]),
          images: JSON.stringify(['https://images.unsplash.com/photo-1553177607-4e3c55c12dae?w=800']),
          latitude: 24.4589,
          longitude: 39.6091,
        },
      }),
      prisma.place.create({
        data: {
          name: 'حديقة الملك فهد',
          description: 'حديقة كبيرة تضم مساحات خضراء واسعة، ملاعب للأطفال، ومسارات للمشي.',
          type: 'entertainment',
          audience: JSON.stringify(['family', 'kids']),
          environment: 'outdoor',
          requiresBooking: false,
          bookingsCount: 650000,
          openingHours: '4 مساءً - 12 منتصف الليل',
          crowdLevel: 'medium',
          currentEvents: JSON.stringify(['مهرجان الربيع']),
          images: JSON.stringify(['https://images.unsplash.com/photo-1571655790646-5fccf0f1d78d?w=800']),
          latitude: 24.4912,
          longitude: 39.5586,
        },
      }),
      prisma.place.create({
        data: {
          name: 'مجمع الملك فهد لطباعة المصحف الشريف',
          description: 'مجمع متخصص في طباعة المصحف الشريف وترجمته. يمكن زيارته والتعرف على مراحل الطباعة.',
          type: 'religious',
          audience: JSON.stringify(['family', 'seniors', 'friends']),
          environment: 'indoor',
          requiresBooking: true,
          reservationPrice: 25,
          bookingsCount: 500000,
          openingHours: '8 صباحاً - 3 مساءً (ماعدا الجمعة والسبت)',
          crowdLevel: 'low',
          currentEvents: JSON.stringify([]),
          images: JSON.stringify(['https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800']),
          latitude: 24.4456,
          longitude: 39.5836,
        },
      }),
    ]);

    console.log(`[SEED] Created ${places.length} places`);
    console.log('[SEED] Database seeded successfully!');

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        users: 2,
        filterCategories: 4,
        places: places.length,
      },
    });
  } catch (error: any) {
    console.error('[SEED] Error seeding database:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

