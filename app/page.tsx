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
        <div className="inline-flex items-center gap-3 rounded-full px-6 py-3 mb-8" style={{ backgroundColor: 'var(--color-accent)' }}>
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
            className="group inline-flex items-center justify-center gap-3 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
            style={{ backgroundColor: 'var(--color-button-normal)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-button-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-button-normal)'}
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
            className="group inline-flex items-center justify-center gap-3 bg-transparent border-2 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all backdrop-blur-sm"
            style={{ borderColor: 'var(--color-accent)' }}
          >
            <span style={{ color: 'var(--color-accent)' }}>✦</span>
            أنشئ مسارًا ذكيًا
          </Link>
        </div>
      </div>
    </div>
  );
}
