import React, { useState, useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import { AboutSection, StudioDetails } from "../types";
import SlowRevealParagraph from "./SlowRevealParagraph";
import { preloadImages, getOptimizedImageUrl } from "../utils/preload";

interface AboutProps {
  about?: AboutSection;
  details?: StudioDetails;
}

const defaultSlides = [
  {
    id: "fs-1",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
    title: "THE RAJPUTANA GLORY"
  },
  {
    id: "fs-2",
    imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200",
    title: "GOLDEN HOUR WHISPERS"
  },
  {
    id: "fs-3",
    imageUrl: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&q=80&w=1200",
    title: "CANDID EMOTIONS"
  },
  {
    id: "fs-4",
    imageUrl: "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=1200",
    title: "THE ROYAL CANVAS"
  }
];

export default function About({ about }: AboutProps) {
  const safePhilosophySlides = about?.philosophySlides;
  const slides = safePhilosophySlides && safePhilosophySlides.length > 0 
    ? safePhilosophySlides 
    : defaultSlides;

  useEffect(() => {
    if (slides && slides.length > 0) {
      console.log("Display side About (Our Philosophy) rendering slide image URLs:");
      slides.forEach(slide => {
        if (slide.imageUrl) {
          console.log(`- Philosophy Slide [${slide.title || "Untitled"}]: Rendering URL -> ${slide.imageUrl}`);
        }
      });
    }
  }, [slides]);

  const N = slides.length;

  // Duplicate slides list to implement seamless infinite looping
  const extendedSlides = [...slides, ...slides, ...slides];

  // Start at the middle set
  const [extendedIndex, setExtendedIndex] = useState(N);
  const targetIndexRef = useRef(N);
  const loopTimeoutRef = useRef<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [isRevealed, setIsRevealed] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const trackDivRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  // Drag tracking refs
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const currentXRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const trackXRef = useRef(0);
  const isHorizontalSwipe = useRef<boolean | null>(null);

  // Pre-cached DOM elements for maximum rendering/animating speed (60fps) during swipe
  const imgContainersRef = useRef<HTMLDivElement[]>([]);
  const slideElementsRef = useRef<HTMLDivElement[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);

  // Responsive sizes
  let slideWidth = windowWidth * 0.82; // Center image width on mobile
  let gap = 12;

  if (windowWidth >= 1024) {
    slideWidth = Math.min(windowWidth * 0.42, 600);
    gap = 20;
  } else if (windowWidth >= 768) {
    slideWidth = Math.min(windowWidth * 0.60, 480);
    gap = 16;
  }

  const centerOffset = (windowWidth / 2) - (slideWidth / 2);
  const slideHeight = slideWidth * 1.35; // Portrait orientation
  const targetX = centerOffset - extendedIndex * (slideWidth + gap);

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Intersection observer for viewport reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Preload ALL slides on mount so they come very quickly with zero latency
  useEffect(() => {
    if (!slides || slides.length === 0) return;
    
    // Choose optimal width based on current viewport
    const targetWidth = window.innerWidth >= 1024 ? 1200 : window.innerWidth >= 768 ? 800 : 600;
    
    // Eagerly preload ALL slide images immediately so they are cached in the browser
    slides.forEach((slide) => {
      if (slide.imageUrl) {
        const optimizedUrl = getOptimizedImageUrl(slide.imageUrl, targetWidth);
        const img = new Image();
        img.onload = () => {
          setLoadedImages((prev) => ({ ...prev, [slide.imageUrl]: true }));
        };
        img.onerror = () => {
          setLoadedImages((prev) => ({ ...prev, [slide.imageUrl]: true }));
        };
        img.referrerPolicy = "no-referrer";
        img.src = optimizedUrl;
      }
    });
  }, [slides]);

  // Preload adjacent slides dynamically when the user swipes/navigates
  useEffect(() => {
    if (!slides || slides.length === 0) return;
    
    // Compute indices to preload: current, previous 2, and next 2 slides relative to extendedIndex
    const indicesToPreload = [
      extendedIndex - 2,
      extendedIndex - 1,
      extendedIndex,
      extendedIndex + 1,
      extendedIndex + 2
    ];
    
    const targetWidth = windowWidth >= 1024 ? 1200 : windowWidth >= 768 ? 800 : 600;
    const urlsToPreload: string[] = [];
    indicesToPreload.forEach((idx) => {
      const slideIdx = (idx + extendedSlides.length) % extendedSlides.length;
      const slide = extendedSlides[slideIdx];
      if (slide && slide.imageUrl) {
        urlsToPreload.push(getOptimizedImageUrl(slide.imageUrl, targetWidth));
      }
    });
    
    if (urlsToPreload.length > 0) {
      preloadImages(urlsToPreload);
    }
  }, [extendedIndex, slides, extendedSlides, windowWidth]);

  // Clean up any pending loop timeouts
  useEffect(() => {
    return () => {
      if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
    };
  }, []);

  const scrollToIndex = (index: number, animate = true) => {
    if (isDraggingRef.current) return;
    isAnimatingRef.current = true;
    targetIndexRef.current = index;
    setExtendedIndex(index);

    if (trackDivRef.current) {
      if (animate) {
        trackDivRef.current.style.transition = "transform 320ms cubic-bezier(0.16, 1, 0.3, 1)";
      } else {
        trackDivRef.current.style.transition = "none";
      }
      const newX = centerOffset - index * (slideWidth + gap);
      trackDivRef.current.style.transform = `translate3d(${newX}px, 0, 0)`;

      // If transition is instant, update slide transforms directly
      if (!animate) {
        updateSlideTransforms(newX);
      }
    }

    if (animate) {
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
      }
      loopTimeoutRef.current = setTimeout(() => {
        isAnimatingRef.current = false;
        handleLoopBoundaries(index);
      }, 320);
    } else {
      isAnimatingRef.current = false;
      handleLoopBoundaries(index);
    }
  };

  const handleLoopBoundaries = (index: number) => {
    if (index < N) {
      targetIndexRef.current = index + N;
      scrollToIndex(index + N, false);
    } else if (index >= 2 * N) {
      targetIndexRef.current = index - N;
      scrollToIndex(index - N, false);
    }
  };

  const nextSlide = () => {
    if (isDraggingRef.current) return;
    const nextIdx = targetIndexRef.current + 1;
    scrollToIndex(nextIdx);
  };

  const prevSlide = () => {
    if (isDraggingRef.current) return;
    const prevIdx = targetIndexRef.current - 1;
    scrollToIndex(prevIdx);
  };

  const nextSlideRef = useRef(nextSlide);
  const prevSlideRef = useRef(prevSlide);

  useEffect(() => {
    nextSlideRef.current = nextSlide;
    prevSlideRef.current = prevSlide;
  });

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlideRef.current();
      } else if (e.key === "ArrowRight") {
        nextSlideRef.current();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleImageLoad = (url: string) => {
    setLoadedImages((prev) => ({ ...prev, [url]: true }));
  };

  // High performance touch/drag mechanics using direct DOM transform writes
  const handleTouchStart = (e: TouchEvent | MouseEvent) => {
    if (isAnimatingRef.current) return;
    isDraggingRef.current = true;
    setIsDragging(true);

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    startXRef.current = clientX;
    startYRef.current = clientY;
    currentXRef.current = clientX;
    dragOffsetRef.current = 0;
    trackXRef.current = centerOffset - extendedIndex * (slideWidth + gap);
    isHorizontalSwipe.current = null;

    if (trackDivRef.current) {
      trackDivRef.current.style.transition = "none";
      
      // Cache references to children to completely avoid querySelector layout bottlenecks during touchmove
      const children = Array.from(trackDivRef.current.children) as HTMLDivElement[];
      slideElementsRef.current = children;
      imgContainersRef.current = children.map(el => el.querySelector(".img-container") as HTMLDivElement);
    }
  };

  const updateDragVisuals = () => {
    animationFrameIdRef.current = null;
    if (!isDraggingRef.current) return;

    const deltaX = dragOffsetRef.current;
    const newX = trackXRef.current + deltaX;

    if (trackDivRef.current) {
      trackDivRef.current.style.transform = `translate3d(${newX}px, 0, 0)`;
    }

    // High performance direct DOM updates of slide transforms & opacities
    updateSlideTransforms(newX);
  };

  const handleTouchMove = (e: TouchEvent | MouseEvent) => {
    if (!isDraggingRef.current) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    if (isHorizontalSwipe.current === null) {
      const dx = Math.abs(clientX - startXRef.current);
      const dy = Math.abs(clientY - startYRef.current);
      if (dx > 5 || dy > 5) {
        isHorizontalSwipe.current = dx > dy;
      }
    }

    if (isHorizontalSwipe.current === false) {
      return;
    }

    if (e.cancelable) {
      e.preventDefault();
    }

    currentXRef.current = clientX;
    const deltaX = clientX - startXRef.current;
    dragOffsetRef.current = deltaX;

    // Use requestAnimationFrame to throttle and batch DOM updates to target a locked 60fps/120fps refresh rate
    if (animationFrameIdRef.current === null) {
      animationFrameIdRef.current = requestAnimationFrame(updateDragVisuals);
    }
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    // Clean up any pending animation frames
    if (animationFrameIdRef.current !== null) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }

    const dragOffset = dragOffsetRef.current;
    const swipeThreshold = 15; // Ultra-responsive flick threshold

    let newIndex = extendedIndex;
    if (dragOffset < -swipeThreshold) {
      newIndex = extendedIndex + 1;
    } else if (dragOffset > swipeThreshold) {
      newIndex = extendedIndex - 1;
    }

    targetIndexRef.current = newIndex;
    scrollToIndex(newIndex);
  };

  const updateSlideTransforms = (currentTrackX: number) => {
    const slidesElements = slideElementsRef.current;
    const imgContainers = imgContainersRef.current;
    if (slidesElements.length === 0) return;

    for (let i = 0; i < slidesElements.length; i++) {
      const el = slidesElements[i];
      if (!el) continue;

      const slideCenter = currentTrackX + i * (slideWidth + gap) + slideWidth / 2;
      const distance = Math.abs(slideCenter - windowWidth / 2);
      const normalizedDistance = Math.min(2, distance / (slideWidth + gap));

      let scale = 1;
      let opacity = 1;

      if (normalizedDistance <= 1) {
        scale = 1 - normalizedDistance * (1 - 0.92);
        opacity = 1 - normalizedDistance * (1 - 0.55);
      } else {
        const t = normalizedDistance - 1;
        scale = 0.92 - t * (0.92 - 0.85);
        opacity = 0.55 - t * (0.55 - 0.35);
      }

      el.style.opacity = opacity.toString();
      el.style.setProperty("--slide-scale", scale.toString());

      const imgContainer = imgContainers[i];
      if (imgContainer) {
        // Trigger GPU composition for absolute fluidity
        imgContainer.style.transform = `translate3d(0, 0, 0) scale(${scale})`;
      }
    }
  };

  // Bind mouse/touch events to the track
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onTouchStart = (e: TouchEvent) => handleTouchStart(e);
    const onMouseDown = (e: MouseEvent) => handleTouchStart(e);

    track.addEventListener("touchstart", onTouchStart, { passive: true });
    track.addEventListener("mousedown", onMouseDown);

    return () => {
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("mousedown", onMouseDown);
    };
  }, [extendedIndex, windowWidth, slideWidth, gap]);

  // Bind drag events globally while active
  useEffect(() => {
    if (!isDragging) return;

    const onTouchMove = (e: TouchEvent) => handleTouchMove(e);
    const onMouseMove = (e: MouseEvent) => handleTouchMove(e);
    const onTouchEnd = () => handleTouchEnd();
    const onMouseUp = () => handleTouchEnd();

    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, extendedIndex, windowWidth, slideWidth, gap]);

  const normalizedIndex = extendedIndex % N;

  return (
    <section 
      ref={sectionRef}
      id="story" 
      className="w-full bg-luxury-ivory py-14 md:py-20 overflow-hidden select-none relative"
    >
      <style>{`
        @keyframes activeFloat {
          0%, 100% { transform: translateY(-4px); }
          50% { transform: translateY(4px); }
        }
        .active-floating {
          animation: activeFloat 8s ease-in-out infinite;
        }
        .carousel-slide {
          transition: opacity 320ms cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .img-container {
          transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }
        .is-dragging .carousel-slide,
        .is-dragging .img-container {
          transition: none !important;
        }
      `}</style>

      {/* Full-width carousel container */}
      <div className="w-full relative mt-10">
        <div 
          ref={trackRef}
          className="w-full overflow-hidden relative cursor-grab active:cursor-grabbing"
          style={{ height: slideHeight + 16 }}
        >
          <div
            ref={trackDivRef}
            className={`flex items-center ${isDragging ? "is-dragging" : ""}`}
            style={{
              gap: `${gap}px`,
              transform: `translate3d(${targetX}px, 0, 0)`,
              transition: isDragging ? "none" : "transform 320ms cubic-bezier(0.16, 1, 0.3, 1)",
              willChange: "transform",
            }}
          >
            {extendedSlides.map((slide, idx) => {
              if (!slide) return null;
              const isActive = idx === extendedIndex;
              const slideScale = isActive ? 1 : idx === extendedIndex - 1 || idx === extendedIndex + 1 ? 0.92 : 0.85;
              const slideOpacity = isActive ? 1 : idx === extendedIndex - 1 || idx === extendedIndex + 1 ? 0.55 : 0.35;

              // Only render full image nodes for adjacent slides (active center, 2 to the left, 2 to the right)
              const isNearViewport = Math.abs(idx - extendedIndex) <= 2;

              return (
                <div
                  key={`${slide.id || idx}-${idx}`}
                  className={`flex-shrink-0 relative overflow-hidden select-none rounded-[8px] border border-luxury-gold/10 bg-luxury-ivory carousel-slide ${
                    isActive ? "active-floating" : ""
                  }`}
                  style={{
                    width: slideWidth,
                    height: slideHeight,
                    opacity: slideOpacity,
                    transform: "translate3d(0, 0, 0)",
                    backfaceVisibility: "hidden",
                    transformStyle: "flat",
                  }}
                >
                  {isNearViewport ? (
                    <div 
                      className="w-full h-full relative overflow-hidden img-container"
                      style={{
                        transform: `translate3d(0, 0, 0) scale(${slideScale})`,
                        transformStyle: "flat",
                      }}
                    >
                      <img
                        src={getOptimizedImageUrl(slide.imageUrl, windowWidth >= 1024 ? 1200 : windowWidth >= 768 ? 800 : 600)}
                        alt={slide.title}
                        loading="eager"
                        decoding="async"
                        onLoad={() => handleImageLoad(slide.imageUrl)}
                        className={`w-full h-full object-cover transition-opacity duration-300 md:hover:scale-[1.03] ${
                          loadedImages[slide.imageUrl] ? "opacity-100" : "opacity-0"
                        }`}
                        draggable={false}
                        referrerPolicy="no-referrer"
                      />

                      {/* Smooth, subtle ambient overlay shadow only */}
                      <div className="absolute inset-0 bg-black/15 pointer-events-none transition-all duration-300" />
                    </div>
                  ) : (
                    // Lightweight elegant placeholder frame for off-screen slides to optimize memory
                    <div className="w-full h-full bg-luxury-cream/20 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full border-2 border-luxury-gold/20 border-t-luxury-gold animate-spin" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>



      {/* Structured Text & Controls */}
      <div className="w-full max-w-[1100px] mx-auto px-6 md:px-8 mt-16 md:mt-24 relative pt-12">
        <div className="absolute top-0 left-6 right-6 md:left-8 md:right-8 divider-shimmer" style={{ position: "absolute" }} />
        
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 md:gap-16">
          {/* Left Column - Heading */}
          <div className="w-full md:w-2/5">
            <h3 
              className={`font-serif font-light text-luxury-espresso tracking-[-0.04em] leading-[0.95] uppercase transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
              }`}
              style={{
                fontSize: windowWidth >= 1024 ? "56px" : windowWidth >= 768 ? "48px" : "36px",
                transitionDelay: isRevealed ? "450ms" : "0ms",
              }}
            >
              SIGNATURE<br className="hidden md:inline" /> WORK
            </h3>
          </div>
          
          {/* Right Column - Text Paragraph and Accent */}
          <div className="w-full md:w-3/5">
            <SlowRevealParagraph 
              className="text-luxury-charcoal text-sm md:text-base leading-relaxed font-light font-sans max-w-xl md:mt-2"
              delay={0.4}
            >
              Every wedding is a live canvas of light, shadow, and unscripted sentiment. Our signature work showcases a curated collection of cinematic storytelling where raw human emotion meets architectural composition. We do not merely capture events; we immortalize the subtle, fleeting glances, the delicate textures, and the silent chemistry that make your love story an enduring work of art.
            </SlowRevealParagraph>

            <div 
              className={`mt-8 text-[13px] md:text-[14px] tracking-[8px] uppercase font-light text-luxury-blush select-none transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{
                transitionDelay: isRevealed ? "750ms" : "0ms",
              }}
            >
              HERE'S A GLIMPSE INTO THE
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
