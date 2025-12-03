'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [browser, setBrowser] = useState<'chrome' | 'safari-ios' | 'safari-mac' | 'firefox' | 'other'>('other');
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isInStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');
    
    setIsStandalone(isInStandalone);

    if (isInStandalone) {
      console.log('[PWA] App is already installed');
      return;
    }

    // Track user interaction for faster prompt
    let hasInteracted = false;
    const markInteraction = () => {
      hasInteracted = true;
    };

    // Listen for user interaction (once per event type)
    document.addEventListener('click', markInteraction, { once: true });
    document.addEventListener('scroll', markInteraction, { once: true });
    document.addEventListener('touchstart', markInteraction, { once: true });

    // Detect browser and device - improved Safari detection
    const detectBrowser = () => {
      const ua = navigator.userAgent;
      const isIOS = /iPhone|iPad|iPod/.test(ua);
      const isAndroid = /Android/.test(ua);
      // Better Safari detection - check for Safari but not Chrome/Edge/Firefox
      const isSafari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS/.test(ua);
      const isChrome = /Chrome/.test(ua) && !/ Edge/.test(ua);
      const isFirefox = /Firefox/.test(ua);
      const isMac = /Mac/.test(ua);

      // Prioritize iOS Safari detection
      if (isIOS) {
        // On iOS, if it's Safari (not Chrome/Firefox), it's Safari iOS
        if (isSafari || (!isChrome && !isFirefox)) {
          return 'safari-ios';
        }
      }
      
      if (isMac && isSafari) {
        return 'safari-mac';
      } else if (isChrome || isAndroid) {
        return 'chrome'; // Android Chrome or any Chrome
      } else if (isFirefox) {
        return 'firefox';
      }
      return 'other';
    };

    const detectedBrowser = detectBrowser();
    setBrowser(detectedBrowser);
    console.log('[PWA] Browser detected:', detectedBrowser, 'User Agent:', navigator.userAgent);

    // Listen for beforeinstallprompt (Chrome, Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      console.log('[PWA] Install prompt captured');
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after 30 seconds of engagement or after interaction
      const hasSeenPrompt = localStorage.getItem('pwa-prompt-dismissed');
      const lastDismissed = localStorage.getItem('pwa-prompt-dismissed-time');
      
      // Don't show if dismissed in last 7 days
      if (hasSeenPrompt && lastDismissed) {
        const daysSinceDismiss = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24);
        if (daysSinceDismiss < 7) {
          console.log('[PWA] Prompt dismissed recently, waiting...');
          return;
        }
      }

      // Show much faster for mobile devices, even faster after interaction
      const isMobile = /iPhone|iPad|iPod|Android/.test(navigator.userAgent);
      const checkAndShow = () => {
        let delay = hasInteracted 
          ? (isMobile ? 1000 : 2000) // 1 second for mobile after interaction, 2 for desktop
          : (isMobile ? 2000 : 3000); // 2 seconds for mobile, 3 for desktop
        
        setTimeout(() => {
          setShowPrompt(true);
        }, delay);
      };
      
      // Check immediately and show
      checkAndShow();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For Safari and other browsers, show custom prompt after engagement
    const hasSeenPrompt = localStorage.getItem('pwa-prompt-dismissed');
    const lastDismissed = localStorage.getItem('pwa-prompt-dismissed-time');
    
    // Don't show if dismissed in last 7 days
    let shouldShow = true;
    if (hasSeenPrompt && lastDismissed) {
      const daysSinceDismiss = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismiss < 7) {
        shouldShow = false;
        console.log('[PWA] Prompt dismissed recently, waiting...');
      }
    }

    // For Safari and other browsers, show custom prompt
    // Safari iOS: Show immediately on page load (2-3 seconds), no interaction needed
    if (shouldShow && (detectedBrowser === 'safari-ios' || detectedBrowser === 'safari-mac' || detectedBrowser === 'firefox' || detectedBrowser === 'other')) {
      const isMobile = /iPhone|iPad|iPod|Android/.test(navigator.userAgent);
      
      // Safari iOS: Show faster (2-3 seconds) without requiring interaction
      if (detectedBrowser === 'safari-ios') {
        const delay = isMobile ? 2000 : 3000; // 2 seconds for iOS, 3 for iPad
        console.log('[PWA] Scheduling Safari iOS prompt in', delay, 'ms');
        setTimeout(() => {
          setShowPrompt(true);
          console.log('[PWA] Showing install prompt for Safari iOS');
        }, delay);
      } else {
        // Safari Mac and others: Show after interaction or with longer delay
        const checkAndShow = () => {
          const delay = hasInteracted
            ? (isMobile ? 2000 : 4000) // 2 seconds for mobile after interaction, 4 for desktop
            : (isMobile ? 3000 : 5000); // 3 seconds for mobile, 5 for desktop
          
          setTimeout(() => {
            setShowPrompt(true);
            console.log('[PWA] Showing install prompt for', detectedBrowser);
          }, delay);
        };
        
        // Check interaction after a short delay, then show
        setTimeout(() => {
          checkAndShow();
        }, 500);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      document.removeEventListener('click', markInteraction);
      document.removeEventListener('scroll', markInteraction);
      document.removeEventListener('touchstart', markInteraction);
    };
  }, []); // Remove browser from dependencies - use detectedBrowser directly

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // For browsers without native prompt, just show instructions
      return;
    }

    // Show native install prompt
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`[PWA] User choice: ${outcome}`);
    
    if (outcome === 'accepted') {
      console.log('[PWA] App installed');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
    localStorage.setItem('pwa-prompt-dismissed-time', Date.now().toString());
  };

  if (!showPrompt || isStandalone) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-bounce-in overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#195B4A] to-[#307C5F] p-6 text-white relative">
          <button
            onClick={handleDismiss}
            className="absolute top-4 left-4 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex items-center gap-4">
            <img src="/mazar.png" alt="مزار" className="w-16 h-16 rounded-xl bg-white p-2" />
            <div>
              <h3 className="text-xl font-bold">ثبت تطبيق مزار</h3>
              <p className="text-white/90 text-sm mt-1">للوصول السريع والاستخدام بلا إنترنت</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Chrome/Edge Instructions */}
          {browser === 'chrome' && deferredPrompt && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="font-bold text-gray-800">الوصول السريع</h4>
                  <p className="text-sm text-gray-600">افتح التطبيق مباشرة من شاشتك الرئيسية</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📱</span>
                <div>
                  <h4 className="font-bold text-gray-800">تجربة أفضل</h4>
                  <p className="text-sm text-gray-600">واجهة كاملة بدون شريط المتصفح</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🚀</span>
                <div>
                  <h4 className="font-bold text-gray-800">استخدام بلا إنترنت</h4>
                  <p className="text-sm text-gray-600">تصفح بعض المحتوى حتى بدون اتصال</p>
                </div>
              </div>
            </div>
          )}

          {/* Safari iOS Instructions */}
          {browser === 'safari-ios' && (
            <div className="space-y-4">
              <p className="text-gray-700 font-medium mb-4">لتثبيت التطبيق:</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                  <span className="text-2xl flex-shrink-0">1️⃣</span>
                  <p className="text-sm text-gray-700">
                    اضغط على زر <strong>المشاركة</strong> 
                    <svg className="inline w-5 h-5 mx-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z"/>
                    </svg>
                    في الأسفل
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                  <span className="text-2xl flex-shrink-0">2️⃣</span>
                  <p className="text-sm text-gray-700">
                    مرر للأسفل واختر <strong>&quot;إضافة إلى الشاشة الرئيسية&quot;</strong>
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                  <span className="text-2xl flex-shrink-0">3️⃣</span>
                  <p className="text-sm text-gray-700">اضغط <strong>&quot;إضافة&quot;</strong></p>
                </div>
              </div>
            </div>
          )}

          {/* Safari macOS Instructions */}
          {browser === 'safari-mac' && (
            <div className="space-y-4">
              <p className="text-gray-700 font-medium mb-4">لتثبيت التطبيق على Mac:</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                  <span className="text-2xl flex-shrink-0">1️⃣</span>
                  <p className="text-sm text-gray-700">
                    من قائمة <strong>File</strong> اختر <strong>Add to Dock</strong>
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                  <span className="text-2xl flex-shrink-0">2️⃣</span>
                  <p className="text-sm text-gray-700">أو اضغط على أيقونة المشاركة في شريط الأدوات</p>
                </div>
              </div>
            </div>
          )}

          {/* Firefox Instructions */}
          {browser === 'firefox' && (
            <div className="space-y-4">
              <p className="text-gray-700 font-medium mb-4">المزايا عند التثبيت:</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <p className="text-sm text-gray-700">الوصول السريع من سطح المكتب</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📱</span>
                  <p className="text-sm text-gray-700">تجربة تطبيق كاملة</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                ملاحظة: Firefox لا يدعم التثبيت التلقائي، لكن يمكنك إضافة الموقع للمفضلة للوصول السريع
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            {browser === 'chrome' && deferredPrompt && (
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-gradient-to-r from-[#195B4A] to-[#307C5F] hover:from-[#307C5F] hover:to-[#195B4A] text-white py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-lg"
              >
                ثبت الآن
              </button>
            )}
            <button
              onClick={handleDismiss}
              className={`${browser === 'chrome' && deferredPrompt ? 'flex-1' : 'w-full'} bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-medium transition-all`}
            >
              {browser === 'safari-ios' || browser === 'safari-mac' ? 'فهمت' : 'لاحقاً'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

