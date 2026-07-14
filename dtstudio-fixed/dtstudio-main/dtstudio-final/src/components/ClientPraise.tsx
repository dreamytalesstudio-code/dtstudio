import React from "react";
import { motion } from "motion/react";
import { ClientReview } from "../types";
import SlowRevealParagraph from "./SlowRevealParagraph";

interface ClientPraiseProps {
  reviews?: ClientReview[];
}

export default function ClientPraise({ reviews = [] }: ClientPraiseProps) {
  if (!reviews || reviews.length === 0) return null;

  const handleBookClick = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      id="praise" 
      className="relative py-20 bg-white overflow-hidden border-t border-zinc-100 select-none"
    >
      {/* Clean elegant pure white background */}
      <div className="max-w-[1140px] mx-auto px-6 relative z-10">
        
        {/* Editorial Section Heading */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-neutral-900 tracking-wide font-normal">
            Client Reviews
          </h2>

          {/* Decorative Divider matching the uploaded image */}
          <div className="flex items-center justify-center gap-4 mt-5 mb-5 select-none">
            <div className="w-10 h-[1px] bg-neutral-300"></div>
            <span className="text-neutral-900 text-sm">♥</span>
            <div className="w-10 h-[1px] bg-neutral-300"></div>
          </div>

          <p className="text-neutral-600 font-sans text-xs sm:text-sm md:text-base font-light tracking-wide max-w-xl mx-auto leading-relaxed">
            Real stories from our amazing couples.<br />
            Your love and trust inspire us every day.
          </p>
        </div>

        {/* Responsive Reviews Grid / List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {reviews.map((review, index) => {
            const reviewImages = review.images && review.images.length > 0 
              ? review.images 
              : [
                  "https://images.unsplash.com/photo-1621616875450-79f22448040e?auto=format&fit=crop&q=80&w=800"
                ];
            const primaryImage = reviewImages[0];

            return (
              <motion.div
                key={review.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-row md:flex-col gap-5 p-5 bg-white border border-neutral-100 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.015)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.04)] transition-all duration-500 group"
              >
                {/* Image Container */}
                <div className="w-[32%] md:w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-xl bg-neutral-50 shrink-0 relative">
                  <img
                    src={primaryImage}
                    alt={`${review.clientName} portrait`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-103"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/[0.01] mix-blend-multiply pointer-events-none" />
                </div>

                {/* Content Container */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    {/* Couple's Name */}
                    <h3 className="font-serif text-[16px] md:text-[18px] lg:text-[20px] font-bold text-neutral-900 tracking-wide mb-1 md:mb-1.5 leading-snug">
                      {review.clientName}
                    </h3>

                    {/* Star Rating (5 Stars) */}
                    <div className="flex text-neutral-900 gap-0.5 text-[10px] md:text-xs mb-2 md:mb-3 select-none">
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                    </div>

                    {/* Review Text */}
                    <SlowRevealParagraph 
                      className="text-neutral-600 font-sans text-[11px] md:text-xs lg:text-[13px] font-light leading-relaxed mb-3 md:mb-4 text-justify"
                      delay={0.1}
                    >
                      {review.text}
                    </SlowRevealParagraph>
                  </div>

                  {/* Elegant Quote Icon/Character */}
                  <div className="flex justify-end text-neutral-900 font-serif text-[24px] md:text-[28px] font-bold leading-none select-none mt-auto">
                    ”
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA section matching the uploaded image */}
        <div className="text-center pt-8 border-t border-neutral-100">
          <h3 className="font-serif text-xl sm:text-2xl text-neutral-900 font-light tracking-wide mb-6">
            We'd love to capture your story!
          </h3>
          <button
            onClick={handleBookClick}
            className="px-8 py-3.5 bg-white hover:bg-neutral-900 hover:text-white border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-[12px] font-sans tracking-[0.2em] font-medium transition-all duration-300 uppercase rounded-[4px] cursor-pointer shadow-sm"
          >
            BOOK YOUR DATE
          </button>
        </div>

      </div>
    </section>
  );
}
