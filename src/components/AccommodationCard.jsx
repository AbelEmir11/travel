import React, { useState } from "react";
import { Star, MapPin, CaretLeft, CaretRight, ArrowUpRight, Tag } from "@phosphor-icons/react";

export default function AccommodationCard({ item, onClick }) {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev + 1) % item.images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev - 1 + item.images.length) % item.images.length);
  };

  const hasDiscount = item.discount && item.discount > 0;
  const finalPrice = hasDiscount ? Math.round(item.price * (1 - item.discount / 100)) : item.price;

  return (
    <div 
      onClick={onClick}
      className={`group p-1 bg-white/80 hover:bg-white border rounded-[2rem] hover:scale-[1.01] transition-all duration-300 cursor-pointer shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] ${
        hasDiscount ? "border-accent-blue/40 hover:border-accent-blue" : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="bg-white border border-slate-100 rounded-[calc(2rem-0.25rem)] p-4 flex flex-col h-full">
        
        {/* Photo Gallery Container */}
        <div className="relative h-56 w-full rounded-2xl overflow-hidden mb-5 group/gallery">
          <img 
            src={item.images[currentImgIdx]} 
            alt={`${item.title} - imagen ${currentImgIdx + 1}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Dark Overlay gradient for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Navigation Arrows (Visible on Hover) */}
          <button
            onClick={prevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-300 hover:bg-black/80"
          >
            <CaretLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-300 hover:bg-black/80"
          >
            <CaretRight className="w-4 h-4" />
          </button>

          {/* Top Info Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-accent-cyan" weight="fill" />
              <span className="text-[11px] font-bold text-white">{item.rating}</span>
            </div>
            
            {hasDiscount && (
              <div className="bg-accent-blue/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-accent-blue/30 shadow-[0_2px_10px_rgba(37,99,235,0.3)] flex items-center gap-1 animate-pulse">
                <Tag className="w-3 h-3 text-white" weight="fill" />
                <span className="text-[9px] font-extrabold text-white uppercase tracking-wider">{item.discount}% OFF</span>
              </div>
            )}
          </div>

          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <span className="text-[9px] uppercase tracking-widest font-bold text-slate-300">
              {item.experienceLabel}
            </span>
          </div>

          {/* Dot Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {item.images.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentImgIdx ? "w-4 bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Location & Meta */}
        <div className="flex items-center gap-1 text-slate-400 text-xs mb-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{item.location}, {item.province}</span>
        </div>

        {/* Title */}
        <h3 className="font-sans font-bold text-xl text-white tracking-tight leading-snug mb-3 group-hover:text-accent-cyan transition-colors duration-300">
          {item.title}
        </h3>

        {/* Description Snippet */}
        <p className="font-sans text-xs text-slate-400 leading-relaxed mb-5 line-clamp-2">
          {item.description}
        </p>

        {/* Spacer to push pricing and button to the bottom */}
        <div className="mt-auto pt-4 border-t border-white/[0.04] flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Precio por Noche</span>
            <div className="flex items-baseline gap-1">
              {hasDiscount ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-accent-cyan font-mono">USD {finalPrice}</span>
                  <span className="text-xs text-slate-500 line-through font-mono">USD {item.price}</span>
                </div>
              ) : (
                <span className="text-xl font-bold text-white">USD {item.price}</span>
              )}
            </div>
          </div>

          {/* Button-in-Button Style Link */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 group-hover:bg-white group-hover:text-black hover:scale-[1.03] transition-all duration-300 font-sans text-xs font-semibold rounded-full pl-4 pr-1 py-1">
            <span className="text-white group-hover:text-black transition-colors duration-300">Detalles</span>
            <div className="w-6 h-6 rounded-full bg-white/10 dark:bg-white/10 flex items-center justify-center group-hover:bg-black/5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300">
              <ArrowUpRight className="w-3.5 h-3.5 text-white group-hover:text-black" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
