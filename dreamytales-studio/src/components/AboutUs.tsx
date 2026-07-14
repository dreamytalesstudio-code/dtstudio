import React, { useState } from "react";
import { motion } from "motion/react";
import { Instagram, Star, Heart } from "lucide-react";
import { AboutSection, StudioDetails } from "../types";
import SlowRevealParagraph from "./SlowRevealParagraph";

interface AboutUsProps {
  about?: AboutSection;
  details?: StudioDetails;
}

export default function AboutUs({ about, details }: AboutUsProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const photoUrl = about?.photoUrl || "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200";
  const name = details?.name || "DTSTUDIO";
  const msme = details?.msme || "MSME";
  const experience = details?.experience || "5+ Years";
  const storyHeadline = about?.storyHeadline || "";
  const storyDescription = about?.storyDescription || "";
  const owner = details?.owner || "Gyanu Verma";

  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 15,
      },
    },
  };

  return (
    <section id="about-us" className="relative py-14 md:py-20 bg-luxury-ivory overflow-hidden border-b border-luxury-gold/20">
      {/* Background Architectural Watermarks & Subtle Luxury Ornaments */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-2xl pointer-events-none" />

      {/* Subtle layout gridlines */}
      <div className="absolute top-0 left-1/3 w-[1px] h-full bg-luxury-gold/10 pointer-events-none hidden lg:block" />
      <div className="absolute top-0 right-1/3 w-[1px] h-full bg-luxury-gold/10 pointer-events-none hidden lg:block" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Massive Editorial Portrait Image Showcase */}
          <div className="lg:col-span-5 relative flex justify-center w-full">
            
            {/* Elegant outer frame shadow border */}
            <div className="absolute -inset-4 border border-luxury-gold/20 rounded-[36px] pointer-events-none translate-x-2 translate-y-2 z-0 hidden sm:block" />

            {/* Huge high-fashion vertical image block */}
            <div className="relative w-full aspect-[2/3] max-h-[480px] lg:max-h-[520px] overflow-hidden rounded-[32px] bg-luxury-ivory shadow-[0_24px_50px_rgba(43,36,32,0.06)] border border-luxury-gold/15 z-10 group">
              <img
                src={photoUrl}
                alt={name}
                referrerPolicy="no-referrer"
                loading="lazy"
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-[2.5s] ease-out group-hover:scale-105 ${
                  imgLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
              
              {/* Shimmer glaze */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
            </div>

            {/* Premium boutique floating label */}
            <div className="absolute -bottom-6 -left-4 sm:-left-8 bg-luxury-espresso border border-luxury-gold/35 text-luxury-ivory py-4 px-6 rounded-md shadow-2xl flex flex-col justify-center items-center z-20 select-none">
              <span className="font-mono text-[9px] tracking-[0.3em] text-luxury-blush uppercase font-semibold">
                {msme}
              </span>
              <span className="font-serif text-lg md:text-xl font-light tracking-widest mt-1 text-luxury-ivory">
                {experience}
              </span>
            </div>
          </div>

          {/* Right Column: Narrative Block */}
          <div className="lg:col-span-7 space-y-10">
            {/* Elegant section tag */}
            <div className="flex items-center gap-3">
              <span className="h-[1px] w-8 bg-luxury-gold" />
              <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.5em] text-luxury-espresso font-semibold">
                Creative Vision
              </span>
            </div>

            {/* Redesigned Minimalist Serif Heading */}
            <h2 className="font-serif text-2xl sm:text-3xl md:text-3.5xl lg:text-4xl text-luxury-espresso tracking-wide leading-tight font-light uppercase">
              About the <br />
              <span className="text-luxury-gold italic font-normal font-serif lowercase tracking-normal">studio</span>
            </h2>

            <div className="w-16 h-[1px] bg-luxury-gold/30" />

            {/* Custom Narrative Body */}
            <div className="space-y-6">
              <SlowRevealParagraph className="text-luxury-espresso font-sans text-sm sm:text-base md:text-lg font-normal tracking-wide leading-relaxed" delay={0.1}>
                {storyHeadline} — {name} is a high-fashion, boutique photography &amp; film studio crafted for couples who cherish absolute visual poetry.
              </SlowRevealParagraph>
              
              <SlowRevealParagraph className="text-luxury-charcoal font-sans text-xs sm:text-sm font-light leading-relaxed whitespace-pre-line" delay={0.25}>
                {storyDescription} Under the creative direction of Gyanu Verma and backed by {experience} of excellence, we specialize in luxury wedding storytelling that feels deeply intimate, authentic, and cinematic. We bypass forced poses to preserve the raw, unscripted chemistry that makes your tale unique.
              </SlowRevealParagraph>

              <SlowRevealParagraph className="text-luxury-charcoal/80 font-sans text-xs sm:text-sm font-light leading-relaxed" delay={0.4}>
                Every frame we capture is treated as a unique canvas of light and shadows, combining architectural discipline with raw human sentiment. We believe that true wedding luxury lies in the details—the soft rustle of silk, the quiet exchange of a glance before the crowd gathers, and the unfiltered emotional depth of your closest relationships. By maintaining a quiet, non-obtrusive presence, we allow your day to unfold organically while crafting a high-end visual legacy that will be treasured for generations.
              </SlowRevealParagraph>
            </div>

              {/* Founder approval & stamp of luxury */}
            <div className="flex items-center gap-6 pt-2 border-t border-luxury-gold/20 max-w-md">
              <div>
                <span className="block font-serif text-lg tracking-wide text-luxury-espresso font-medium uppercase">
                  {owner}
                </span>
                <span className="block text-[9px] font-mono uppercase tracking-[0.3em] text-luxury-blush font-bold mt-0.5">
                  Founder &amp; Lead Curator
                </span>
              </div>
              <div className="w-12 h-12 rounded-full border border-luxury-gold/20 flex items-center justify-center p-2 bg-luxury-ivory select-none ml-auto">
                <Heart className="w-4 h-4 text-luxury-gold fill-luxury-gold/5 animate-dreamy-sparkle" />
              </div>
            </div>

            {/* Instagram Link Button */}
            <div className="pt-2">
              <a
                href="https://www.instagram.com/dreamytalesstudio?igsh=bTA2NjRnZXdzMWMy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 px-8 py-4 btn-dreamy btn-dreamy-pulse rounded-sm text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-500 cursor-pointer"
                id="about-us-instagram-btn"
              >
                <Instagram className="w-4 h-4 text-luxury-espresso" />
                <span>Explore Our Instagram</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
