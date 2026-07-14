import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { Camera, Heart, Sparkles, Shield, Users, Award } from "lucide-react";
import SlowRevealParagraph from "./SlowRevealParagraph";
import ScrollReveal from "./ScrollReveal";

interface StatsProps {
  stats?: {
    weddings?: number;
    couples?: number;
    events?: number;
    backgroundUrl?: string;
    polaroid1Url?: string;
    polaroid2Url?: string;
    filmFrame1Url?: string;
    filmFrame2Url?: string;
    filmFrame3Url?: string;
  };
}

interface CounterProps {
  value: number;
}

// Custom decelerating counter hook for a beautiful slow counting effect
function Counter({ value }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });

  useEffect(() => {
    if (!isInView) {
      setCount(0);
      return;
    }

    let start = 0;
    const end = value;
    if (start === end) return;

    const duration = 1200; // Smoother and slightly slower count animation
    const startTime = performance.now();

    const updateCount = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);

      const currentCount = Math.floor(easedProgress * end);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCount);
  }, [value, isInView]);

  return <span ref={ref}>{count}</span>;
}

export default function Stats({ stats }: StatsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const weddingsVal = stats?.weddings ?? 100;
  const couplesVal = stats?.couples ?? 150;
  const eventsVal = stats?.events ?? 200;

  const polaroid1 = stats?.polaroid1Url || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600";
  const polaroid2 = stats?.polaroid2Url || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600";
  const filmFrame1 = stats?.filmFrame1Url || "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&q=80&w=400";
  const filmFrame2 = stats?.filmFrame2Url || "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=400";
  const filmFrame3 = stats?.filmFrame3Url || "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=400";
  const legacyBgUrl = stats?.backgroundUrl || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1400";

  const milestones = [
    { 
      value: weddingsVal, 
      label: "WEDDINGS DOCUMENTED", 
      sub: "Archiving grand rituals and intimate moments",
      icon: <Camera className="w-5 h-5 text-luxury-gold" />
    },
    { 
      value: couplesVal, 
      label: "SMILING COUPLES", 
      sub: "Boundless love stories told beautifully",
      icon: <Heart className="w-5 h-5 text-luxury-gold" />
    },
    { 
      value: eventsVal, 
      label: "EVENTS CELEBRATED", 
      sub: "Candid smiles captured across every occasion",
      icon: <Sparkles className="w-5 h-5 text-luxury-gold" />
    },
  ];

  const valueProps = [
    {
      title: "Authentic Storytelling",
      desc: "We capture real emotions and unscripted moments that reflect your true story.",
      icon: <Camera className="w-6 h-6 text-luxury-gold" />
    },
    {
      title: "Timeless Editing",
      desc: "Elegant, natural edits that stand the test of time and trends.",
      icon: <Sparkles className="w-6 h-6 text-luxury-gold" />
    },
    {
      title: "Personalized Experience",
      desc: "A seamless, personalized journey tailored to your comfort.",
      icon: <Users className="w-6 h-6 text-luxury-gold" />
    },
    {
      title: "Trusted By Many",
      desc: "Hundreds of families who trust us to document their most important days.",
      icon: <Shield className="w-6 h-6 text-luxury-gold" />
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="experience" 
      className="relative py-14 md:py-20 bg-luxury-ivory overflow-hidden border-b border-luxury-gold/20"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header Block exactly like the uploaded image */}
        <div className="max-w-3xl mx-auto mb-10 md:mb-14 text-center">
          <span className="font-sans text-[11px] md:text-xs uppercase tracking-[0.45em] text-luxury-blush mb-4 block font-semibold">
            OUR LEGACY
          </span>
          
          {/* Delicate Divider Line with Central Ornament (No Brown) */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-[1.5px] bg-gradient-to-r from-luxury-blush to-luxury-gold relative overflow-hidden">
              <div className="absolute inset-0 bg-white/40 translate-x-[-100%] animate-[shimmer_3s_infinite]" />
            </div>
            <span className="text-luxury-gold text-xs select-none animate-pulse">✦</span>
            <div className="w-16 h-[1.5px] bg-gradient-to-r from-luxury-gold to-luxury-coral relative overflow-hidden">
              <div className="absolute inset-0 bg-white/40 translate-x-[-100%] animate-[shimmer_3s_infinite]" />
            </div>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-luxury-espresso tracking-tight font-light leading-tight">
            The milestones of <span className="italic font-light text-luxury-gold">storytelling</span>
          </h2>
          
          <SlowRevealParagraph className="max-w-2xl mx-auto text-luxury-charcoal font-sans text-sm sm:text-base font-light leading-relaxed mt-6" delay={0.25}>
            Every frame we capture becomes a timeless memory. Over the years, we've documented love stories, celebrated moments, and built bonds that last far beyond the last shutter.
          </SlowRevealParagraph>
        </div>

        {/* Stats Columns - Redesigned as Bold Contrast Blocks from the uploaded image */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {milestones.map((mil, idx) => (
            <ScrollReveal
              key={idx}
              delay={idx * 0.15}
              y={30}
              className="w-full h-full"
            >
              <div
                className="relative flex flex-col items-center justify-center p-10 md:p-12 text-center bg-gradient-to-b from-luxury-plum to-[#382338] rounded-[28px] shadow-[0_20px_50px_rgba(92,58,92,0.15)] border border-luxury-gold/25 group hover:scale-[1.02] hover:shadow-[0_24px_60px_rgba(92,58,92,0.25)] hover:border-luxury-gold/45 transition-all duration-500 h-full"
              >
                {/* Icon slot */}
                <div className="mb-6 p-2 rounded-full bg-luxury-espresso border border-luxury-gold/20">
                  {mil.icon}
                </div>

                {/* White Numerals */}
                <div className="font-serif text-4xl sm:text-5xl md:text-6xl text-luxury-ivory font-light tracking-tight select-none flex items-baseline justify-center">
                  <Counter value={mil.value} />
                  <span className="text-luxury-gold text-2xl md:text-3xl font-light ml-0.5">+</span>
                </div>
                
                {/* Divider exactly matching the visual spacing */}
                <div className="w-10 h-[1px] bg-luxury-gold/20 my-5 group-hover:bg-luxury-gold/40 transition-colors duration-500" />

                {/* White uppercase title */}
                <h3 className="font-sans text-[10px] sm:text-xs text-luxury-ivory tracking-[0.2em] uppercase font-bold mb-2">
                  {mil.label}
                </h3>
                
                {/* Muted description */}
                <SlowRevealParagraph className="text-luxury-ivory/70 font-sans text-xs font-light tracking-wide max-w-[200px] mx-auto" delay={0.35}>
                  {mil.sub}
                </SlowRevealParagraph>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Memories Section: Left Story Content, Right Overlapping Polaroid & Film Strip collage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-5xl mx-auto mt-16 md:mt-20 items-center">
          
          {/* Left Text Block */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="font-serif text-2xl sm:text-3xl text-luxury-espresso font-light leading-tight tracking-tight uppercase">
              More than moments,<br />we create <span className="italic lowercase tracking-normal font-normal text-luxury-gold">memories.</span>
            </h3>
            <SlowRevealParagraph className="text-luxury-charcoal font-sans text-sm sm:text-base font-light leading-relaxed" delay={0.2}>
              We believe photography is not just about pictures, it's about emotions, connections, and the little details that make your story unique.
            </SlowRevealParagraph>
            
            {/* Divider Line & DTSTUDIO Team Signature (No Brown) */}
            <div className="flex flex-col gap-1.5 mt-8 pt-6 border-t border-luxury-gold/20">
              <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-luxury-blush font-bold">
                Handcrafted Artistry
              </span>
              <span className="font-signature text-3.5xl text-luxury-espresso select-none">
                The DTSTUDIO Team
              </span>
            </div>
          </div>

          {/* Right Collage Block (Polaroids + Cinematic CSS Film Strip) */}
          <div className="lg:col-span-6 relative h-[340px] sm:h-[380px] w-full flex items-center justify-center select-none pt-4">
            
            {/* Polaroid 1 (Left tilted, grayscale) */}
            <div className="absolute left-[6%] top-[8%] w-[42%] aspect-[3/4.2] bg-luxury-ivory border border-luxury-gold/20 p-2.5 pb-8 shadow-[0_15px_35px_rgba(43,36,32,0.08)] rounded-sm -rotate-[4deg] transition-all duration-500 hover:rotate-0 hover:scale-105 hover:z-30 z-20">
              <div className="w-full h-full overflow-hidden bg-luxury-ivory rounded-xs">
                <img 
                  src={polaroid1} 
                  alt="Bride portrait" 
                  loading="lazy"
                  className="w-full h-full object-cover grayscale contrast-115 brightness-95"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Polaroid 2 (Right tilted, overlapping) */}
            <div className="absolute right-[6%] top-[2%] w-[44%] aspect-[3/4.2] bg-luxury-ivory border border-luxury-gold/20 p-2.5 pb-8 shadow-[0_15px_35px_rgba(43,36,32,0.08)] rounded-sm rotate-[3deg] transition-all duration-500 hover:rotate-0 hover:scale-105 hover:z-30 z-10">
              <div className="w-full h-full overflow-hidden bg-luxury-ivory rounded-xs">
                <img 
                  src={polaroid2} 
                  alt="Wedding couple" 
                  loading="lazy"
                  className="w-full h-full object-cover grayscale contrast-115"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Overlapping Cinematic Film Strip (Grayscale, Sprocket holes look) */}
            <div className="absolute -bottom-4 left-[2%] right-[2%] bg-luxury-espresso rounded-lg p-1.5 py-3 shadow-[0_20px_45px_rgba(43,36,32,0.15)] -rotate-[2.5deg] z-25 border border-luxury-gold/20">
              {/* Top Sprocket Holes */}
              <div className="flex justify-between px-3 mb-2.5 select-none opacity-80">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-luxury-espresso/80 rounded-xs border border-luxury-espresso" />
                ))}
              </div>

              {/* Film Frames (Horizontal grayscale frames) */}
              <div className="grid grid-cols-3 gap-1.5 px-1.5">
                <div className="aspect-[3/2] overflow-hidden border border-luxury-espresso bg-luxury-espresso rounded-xs">
                  <img 
                    src={filmFrame1} 
                    alt="Ritual frame" 
                    loading="lazy"
                    className="w-full h-full object-cover grayscale contrast-125 saturate-0"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="aspect-[3/2] overflow-hidden border border-luxury-espresso bg-luxury-espresso rounded-xs">
                  <img 
                    src={filmFrame2} 
                    alt="Temple scenery" 
                    loading="lazy"
                    className="w-full h-full object-cover grayscale contrast-125 saturate-0"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="aspect-[3/2] overflow-hidden border border-luxury-espresso bg-luxury-espresso rounded-xs">
                  <img 
                    src={filmFrame3} 
                    alt="Candid emotions" 
                    loading="lazy"
                    className="w-full h-full object-cover grayscale contrast-125 saturate-0"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Bottom Sprocket Holes */}
              <div className="flex justify-between px-3 mt-2.5 select-none opacity-80">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-luxury-espresso/80 rounded-xs border border-luxury-espresso" />
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Value Props Grid (Pristine Black & White block matching the bottom row of image) */}
        <ScrollReveal delay={0.15} y={30} className="w-full">
          <div className="bg-luxury-ivory border border-luxury-gold/15 rounded-[28px] p-6 md:p-8 max-w-4xl mx-auto mt-16 md:mt-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
              {valueProps.map((prop, index) => (
                <div key={index} className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-luxury-ivory border border-luxury-gold/20 shadow-xs">
                    {prop.icon}
                  </div>
                  <h4 className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-luxury-espresso">
                    {prop.title}
                  </h4>
                  <SlowRevealParagraph className="text-luxury-charcoal font-sans text-xs font-light leading-relaxed max-w-[210px]" delay={0.25 + index * 0.1}>
                    {prop.desc}
                  </SlowRevealParagraph>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Closing Manifesto (Landscape couple background banner styled like final row) */}
        <ScrollReveal delay={0.2} y={40} className="w-full">
          <div className="max-w-4xl mx-auto mt-16 md:mt-20 relative rounded-[32px] overflow-hidden group border border-luxury-gold/20 shadow-xl">
            <div className="absolute inset-0 bg-luxury-espresso/70 z-10 transition-colors duration-500 group-hover:bg-luxury-espresso/65" />
            <img 
              src={legacyBgUrl}
              alt="Palace backdrop wedding"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover grayscale contrast-115 transition-transform duration-[4s] group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            
            <div className="relative z-20 py-12 px-6 sm:px-8 md:px-10 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
              <div className="max-w-xl">
                <span className="text-luxury-ivory/40 font-serif text-7xl leading-none select-none h-6 block mb-2 font-light">“</span>
                <h4 className="font-serif text-xl sm:text-2xl md:text-3xl text-luxury-ivory font-light tracking-wide leading-tight">
                  We don't just take photos,<br className="hidden sm:inline" /> we preserve your <span className="italic text-luxury-gold">legacy</span>.
                </h4>
                <SlowRevealParagraph className="text-luxury-ivory/80 font-sans text-xs sm:text-sm font-light leading-relaxed mt-4" delay={0.35}>
                  Your love story deserves to be told beautifully, honestly, and forever.
                </SlowRevealParagraph>
              </div>
              
              <button 
                onClick={() => {
                  const contactSection = document.getElementById("contact");
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="px-8 py-3.5 btn-dreamy btn-dreamy-pulse text-[10px] sm:text-xs font-bold tracking-widest uppercase rounded shrink-0 self-start md:self-center cursor-pointer"
              >
                Let's Tell Your Story →
              </button>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
