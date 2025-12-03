'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/landingpage.jpg"
          alt="المدينة المنورة"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay - using exact colors from palette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B2F29]/70 via-[#0D3B2F]/50 to-[#195B4A]/80" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-3 bg-[#B69D6D] rounded-full px-6 py-3 mb-8">
          <span className="text-white text-lg">✦</span>
          <span className="text-white font-medium text-lg">منصة استكشاف المدينة المنورة</span>
          <span className="text-white text-lg">✦</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
          اكتشف المدينة المنورة
        </h1>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-[#DBC8A8]">
          بسهولة... <span className="text-[#DBC8A8]">مع مزار </span>
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/85 max-w-3xl mb-12 leading-relaxed">
          منصتك الشاملة لاستكشاف المعالم التاريخية والأماكن الروحانية وتخطيط مسارات
          <br className="hidden md:block" />
          ذكية تناسب وقتك واهتماماتك
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Primary Button - استكشف الأماكن */}
          <Link
            href="/reference"
            className="group inline-flex items-center justify-center gap-3 bg-[#195B4A] hover:bg-[#307C5F] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            استكشف الأماكن
          </Link>

          {/* Secondary Button - أنشئ مسارًا ذكيًا */}
          <Link
            href="/routes"
            className="group inline-flex items-center justify-center gap-3 bg-transparent border-2 border-white/50 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all backdrop-blur-sm"
          >
            <span className="text-[#DBC8A8]">✦</span>
            أنشئ مسارًا ذكيًا
          </Link>
        </div>
      </div>

      {/* Mobile Navigation - Bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0B2F29]/95 backdrop-blur-md border-t border-white/10">
        <div className="flex justify-around py-3">
          <Link href="/reference" className="flex flex-col items-center gap-1 text-white/70 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-xs">المرجع</span>
          </Link>
          <Link href="/routes" className="flex flex-col items-center gap-1 text-white/70 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="text-xs">المسار</span>
          </Link>
          <Link href="/experiences" className="flex flex-col items-center gap-1 text-white/70 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs">التجارب</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
