// Cloudinary serves the exact original file by default -- a 5MB upload stays 5MB
// even when it's rendered as a 300px grid thumbnail. Cloudinary can resize/compress
// on the fly for free just by adding transformation parameters into the URL path
// (it generates and caches the transformed version on first request), so this needs
// no re-upload and no backend changes.
//
// Docs: https://cloudinary.com/documentation/image_transformations

interface OptimizeOptions {
  /** Target display width in px. Cloudinary will not upscale past the original. */
  width?: number;
  /** Target display height in px (used together with width + crop for fixed aspect tiles). */
  height?: number;
  /** "fill" crops to exactly fill width x height; "limit" just caps the largest dimension. */
  crop?: "fill" | "limit";
}

/**
 * Rewrites a Cloudinary delivery URL to request an optimized (resized, compressed,
 * auto-format) version instead of the original file. Non-Cloudinary URLs (e.g. legacy
 * /uploads/ local files, or base64 data URLs) are returned unchanged.
 */
export function optimizeCloudinaryUrl(url: string, options: OptimizeOptions = {}): string {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  const { width, height, crop = "fill" } = options;

  const parts: string[] = [
    "f_auto", // serve WebP/AVIF automatically when the browser supports it
    "q_auto", // automatic quality/compression tuning
  ];
  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);
  if (width || height) parts.push(`c_${crop}`);

  const transformation = parts.join(",");

  // Insert the transformation right after "/upload/" (works for both image/ and video/ delivery URLs)
  return url.replace("/upload/", `/upload/${transformation}/`);
}
