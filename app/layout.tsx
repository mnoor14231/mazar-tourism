import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Providers from './providers'
import PWAInstallPrompt from '@/components/PWAInstall'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'مزار | اكتشف المدينة المنورة',
  description: 'منصتك الشاملة لاستكشاف المعالم التاريخية والأماكن الروحانية وتخطيط مسارات ذكية في المدينة المنورة',
  keywords: ['مزار', 'المدينة المنورة', 'السياحة', 'المسجد النبوي', 'الأماكن الدينية', 'الأماكن التاريخية', 'حجز', 'مسار سياحي', 'Madinah', 'Tourism', 'Saudi Arabia', 'Mazar'],
  authors: [{ name: 'Mazar Tourism' }],
  creator: 'Mazar',
  publisher: 'Mazar Tourism Platform',
  manifest: '/manifest.json',
  themeColor: '#195B4A', // Button Normal from Visual Identity
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'مزار',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://tourist-cyan.vercel.app',
    title: 'مزار | اكتشف المدينة المنورة',
    description: 'منصتك الشاملة لاستكشاف المعالم التاريخية والأماكن الروحانية وتخطيط مسارات ذكية في المدينة المنورة',
    siteName: 'مزار - Mazar',
    images: [
      {
        url: 'https://tourist-cyan.vercel.app/mazar.png',
        width: 1200,
        height: 630,
        alt: 'مزار - استكشاف المدينة المنورة',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مزار | اكتشف المدينة المنورة',
    description: 'منصتك الشاملة لاستكشاف المعالم التاريخية والأماكن الروحانية وتخطيط مسارات ذكية في المدينة المنورة',
    images: ['/mazar.png'],
  },
  alternates: {
    canonical: 'https://tourist-cyan.vercel.app',
    languages: {
      'ar-SA': 'https://tourist-cyan.vercel.app',
    },
  },
  other: {
    'google-site-verification': 'M9hrLiKbOLSBpCvTm95a_oe3FwfAH4pfVNQ9rkcfG60',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Leaflet CSS */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="M9hrLiKbOLSBpCvTm95a_oe3FwfAH4pfVNQ9rkcfG60" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-167x167.png" />
        
        {/* Structured Data for Google - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'مزار',
              alternateName: 'Mazar',
              url: 'https://tourist-cyan.vercel.app',
              logo: 'https://tourist-cyan.vercel.app/mazar.png',
              description: 'منصتك الشاملة لاستكشاف المعالم التاريخية والأماكن الروحانية وتخطيط مسارات ذكية في المدينة المنورة',
              sameAs: [],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                areaServed: 'SA',
                availableLanguage: 'Arabic',
              },
            }),
          }}
        />
        
        {/* Structured Data for Google - Tourist Attraction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'TouristAttraction',
              name: 'مزار - استكشاف المدينة المنورة',
              alternateName: 'Mazar - Discover Madinah',
              description: 'منصتك الشاملة لاستكشاف المعالم التاريخية والأماكن الروحانية وتخطيط مسارات ذكية في المدينة المنورة',
              url: 'https://tourist-cyan.vercel.app',
              image: 'https://tourist-cyan.vercel.app/mazar.png',
              brand: {
                '@type': 'Brand',
                name: 'مزار',
                logo: 'https://tourist-cyan.vercel.app/mazar.png',
              },
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'المدينة المنورة',
                addressRegion: 'المدينة المنورة',
                addressCountry: 'SA',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 24.4672,
                longitude: 39.6111,
              },
              inLanguage: 'ar',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://tourist-cyan.vercel.app/reference?search={search_term}',
                'query-input': 'required name=search_term',
              },
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <PWAInstallPrompt />
        </Providers>
        
        {/* Service Worker Registration */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                  .then(reg => console.log('[PWA] Service Worker registered'))
                  .catch(err => console.error('[PWA] Service Worker registration failed:', err));
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
}
