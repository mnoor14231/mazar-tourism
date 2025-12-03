/**
 * Service Worker Registration for Mazar PWA
 * Handles registration, updates, and lifecycle events
 */

export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('[PWA] Service Worker not supported');
    return;
  }

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('[PWA] Service Worker registered successfully:', registration.scope);

      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000); // Check every hour

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            console.log('[PWA] New version available');
            
            // Notify user about update
            if (confirm('نسخة جديدة من التطبيق متوفرة. هل تريد التحديث؟')) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
            }
          }
        });
      });

      // Handle controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[PWA] Controller changed, reloading page');
        window.location.reload();
      });

    } catch (error) {
      console.error('[PWA] Service Worker registration failed:', error);
    }
  });
}

// Unregister service worker (for development/debugging)
export async function unregisterServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.unregister();
      console.log('[PWA] Service Worker unregistered');
    }
  } catch (error) {
    console.error('[PWA] Failed to unregister service worker:', error);
  }
}

