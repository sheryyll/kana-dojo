'use client';

import { useEffect } from 'react';

/**
 * Registers the audio caching service worker
 * This component should be included in the root layout
 */
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // TEMPORARY: Aggressively clear all service workers and caches
      // to resolve /kanji routing issues caused by stale cache
      window.addEventListener('load', () => {
        const cleanupAndRegister = async () => {
          try {
            // Step 1: Unregister ALL service workers (not just ours)
            const registrations =
              await navigator.serviceWorker.getRegistrations();
            console.log(
              `Found ${registrations.length} service worker(s) to unregister`
            );

            await Promise.all(
              registrations.map(reg => {
                console.log(`Unregistering SW: ${reg.scope}`);
                return reg.unregister();
              })
            );

            // Step 2: Clear ALL caches
            const cacheNames = await caches.keys();
            console.log(
              `Found ${cacheNames.length} cache(s) to clear:`,
              cacheNames
            );

            await Promise.all(
              cacheNames.map(cacheName => {
                console.log(`Deleting cache: ${cacheName}`);
                return caches.delete(cacheName);
              })
            );

            console.log(
              '✅ All service workers unregistered and caches cleared'
            );

            // Re-register the audio SW after cache is cleared
            const registration = await navigator.serviceWorker.register(
              '/sw.js',
              {
                scope: '/sounds/'
              }
            );

            console.warn('Audio SW registered:', registration.scope);

            setInterval(
              () => {
                registration.update();
              },
              60 * 60 * 1000
            );
          } catch (error) {
            console.warn('SW cleanup failed:', error);
          }
        };

        void cleanupAndRegister();
      });
    }
  }, []);

  return null;
}

/**
 * Utility to manually cache an audio file
 */
export const cacheAudioFile = (url: string) => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_AUDIO',
      url
    });
  }
};

/**
 * Utility to clear the audio cache
 */
export const clearAudioCache = () => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CLEAR_AUDIO_CACHE'
    });
  }
};
