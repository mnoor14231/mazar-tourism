import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Providers from './providers'
import PWAInstallPrompt from '@/components/PWAInstall'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'مزار | اكتشف المدينة المنورة',
  description: 'منصتك الشاملة لاستكشاف المعالم التاريخية والأماكن الروحانية وتخطيط مسارات ذكية في المدينة المنورة',
  manifest: '/manifest.json',
  themeColor: '#195B4A',
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
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-167x167.png" />
      </head>
      <body className="antialiased">
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
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
