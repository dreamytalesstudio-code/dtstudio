/**
 * Utility to preload and cache images in the browser
 */

// In-memory cache to prevent duplicate preload requests
const preloadedCache = new Set<string>();

/**
 * Optimizes an image URL (specifically Unsplash) to load a responsive size
 * and compressed quality, saving substantial bandwidth and memory.
 */
export function getOptimizedImageUrl(url: string, targetWidth: number): string {
  if (!url) return "";
  if (url.includes("unsplash.com")) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set("w", targetWidth.toString());
      urlObj.searchParams.set("q", "75");
      urlObj.searchParams.set("auto", "format");
      urlObj.searchParams.set("fit", "crop");
      return urlObj.toString();
    } catch (e) {
      // Fallback if URL parsing fails
      if (url.includes("?")) {
        return url.replace(/w=\d+/, `w=${targetWidth}`).replace(/q=\d+/, "q=75");
      }
      return `${url}?auto=format&fit=crop&q=75&w=${targetWidth}`;
    }
  }
  return url;
}

/**
 * Preloads a single image URL and returns a Promise.
 * It uses the browser's native image loading and caching mechanisms.
 */
export function preloadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    if (!url) {
      resolve(new Image());
      return;
    }

    if (preloadedCache.has(url)) {
      const img = new Image();
      img.src = url;
      resolve(img);
      return;
    }

    const img = new Image();
    img.onload = () => {
      preloadedCache.add(url);
      resolve(img);
    };
    img.onerror = () => {
      // Resolve anyway to prevent blocking other preloads
      resolve(img);
    };
    img.referrerPolicy = "no-referrer";
    img.src = url;
  });
}

/**
 * Preloads a list of image URLs in the background.
 */
export function preloadImages(urls: string[]): void {
  urls.forEach((url) => {
    if (url) {
      preloadImage(url);
    }
  });
}
