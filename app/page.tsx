'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="relative w-full min-h-screen flex flex-col">
      {/* Hero Section - Flexible and responsive */}
      <section className="relative flex-1 min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/landingpage.jpg"
            alt="المدينة المنورة"
            fill
            className="object-cover"
            style={{ objectPosition: 'center center' }}
            priority
            quality={95}
            sizes="100vw"
          />
          {/* Gradient Overlay - lighter overlay to show image better */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B2F29]/40 via-[#0D3B2F]/20 to-[#195B4A]/50" />
        </div>

        {/* Hero Content - Flexible and responsive */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8">
            {/* Main Heading - Responsive sizing */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight max-w-5xl px-4">
              اكتشف جمال المدينة المنورة
            </h1>

            {/* Subtitle - Responsive sizing */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-4xl leading-relaxed px-4">
              منصتك الشاملة لاستكشاف المعالم الدينية والأماكن الترفيهية وتخطيط مسارات ذكية تناسب وقتك واهتماماتك
            </p>

            {/* CTA Buttons - Flexible layout */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4 sm:mt-6 w-full sm:w-auto px-4">
              {/* Primary Button - استكشف الأماكن */}
              <Link
                href="/reference"
                className="group inline-flex items-center justify-center gap-2 sm:gap-3 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 w-full sm:w-auto"
                style={{ backgroundColor: 'var(--color-button-normal)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-button-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-button-normal)'}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>استكشف الأماكن</span>
              </Link>

              {/* Secondary Button - خطط رحلتك */}
              <Link
                href="/routes"
                className="group inline-flex items-center justify-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md border-2 hover:bg-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all active:scale-95 w-full sm:w-auto"
                style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>خطط رحلتك</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sections - Flexible layout */}
      <div className="relative z-10 w-full" style={{ backgroundColor: 'var(--color-background)' }}>
        {/* المرجع Section */}
        <section id="reference" className="w-full py-12 sm:py-16 md:py-20 lg:py-24" style={{ backgroundColor: '#FAF8F3' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
              <div className="order-1 md:order-1">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-lg mb-6" style={{ backgroundColor: '#C38822' }}>
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#1A1A1A' }}>
                  المرجع
                </h2>
                <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                  دليلك الشامل لأهم المعالم والأماكن المقدسة
                </p>
                <div className="w-12 h-0.5 mb-6" style={{ backgroundColor: '#C38822' }}></div>
                <Link
                  href="/reference"
                  className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-[10px] font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: '#2D4A3E' }}
                >
                  <span>اعرف المزيد</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
              </div>
              <div className="order-2 md:order-2">
                <div className="relative h-64 md:h-80 rounded-[10px] overflow-hidden shadow-lg">
                  <Image
                    src="/landingpage.jpg"
                    alt="المرجع"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* المسار Section */}
        <section id="planner" className="w-full py-12 sm:py-16 md:py-20 lg:py-24" style={{ backgroundColor: '#FAF8F3' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
              <div className="order-2 md:order-2">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-lg mb-6" style={{ backgroundColor: '#C38822' }}>
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#1A1A1A' }}>
                  المسار
                </h2>
                <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                  خطط رحلتك بمساعدة الذكاء الاصطناعي أو يدوياً
                </p>
                <div className="w-12 h-0.5 mb-6" style={{ backgroundColor: '#C38822' }}></div>
                <Link
                  href="/routes"
                  className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-[10px] font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: '#2D4A3E' }}
                >
                  <span>اعرف المزيد</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
              </div>
              <div className="order-1 md:order-1">
                <div className="relative h-64 md:h-80 rounded-[10px] overflow-hidden shadow-lg">
                  <Image
                    src="/second.jpg"
                    alt="المسار"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* التجارب Section */}
        <section id="experiences" className="w-full py-12 sm:py-16 md:py-20 lg:py-24" style={{ backgroundColor: '#FAF8F3' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
              <div className="order-1 md:order-1">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-lg mb-6" style={{ backgroundColor: '#C38822' }}>
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#1A1A1A' }}>
                  التجارب
                </h2>
                <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                  جولات مدفوعة لتجربة استكشافية مميزة
                </p>
                <div className="w-12 h-0.5 mb-6" style={{ backgroundColor: '#C38822' }}></div>
                <Link
                  href="/experiences"
                  className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-[10px] font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: '#2D4A3E' }}
                >
                  <span>اعرف المزيد</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
              </div>
              <div className="order-2 md:order-2">
                <div className="relative h-64 md:h-80 rounded-[10px] overflow-hidden shadow-lg">
                  <Image
                    src="/third.jpg"
                    alt="التجارب"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
