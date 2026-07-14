import React, { useState, useEffect, useRef } from "react";

interface LazyMediaProps {
  mediaType: "image" | "video";
  src: string;
  poster?: string;
  alt?: string;
  className?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
}

export default function LazyMedia({
  mediaType,
  src,
  poster,
  alt = "",
  className = "",
  referrerPolicy
}: LazyMediaProps) {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "350px 0px", // Load slightly before coming into view
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative bg-zinc-950/5 overflow-hidden flex items-center justify-center"
    >
      {/* Premium subtle pulsing background/shimmer when loading or offscreen */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-zinc-900/10 animate-pulse flex items-center justify-center">
          {poster && (
            <img
              src={poster}
              alt="placeholder"
              className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm grayscale"
              referrerPolicy={referrerPolicy}
              loading="lazy"
            />
          )}
        </div>
      )}

      {isInView && (
        <>
          {mediaType === "video" ? (
            <video
              src={src}
              poster={poster}
              className={`w-full h-full object-cover transition-opacity duration-700 ease-out ${
                isLoaded ? "opacity-100" : "opacity-0"
              } ${className}`}
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={() => setIsLoaded(true)}
            />
          ) : (
            <img
              src={src}
              alt={alt}
              className={`w-full h-full object-cover transition-opacity duration-700 ease-out ${
                isLoaded ? "opacity-100" : "opacity-0"
              } ${className}`}
              referrerPolicy={referrerPolicy}
              onLoad={() => setIsLoaded(true)}
              loading="lazy"
            />
          )}
        </>
      )}
    </div>
  );
}
