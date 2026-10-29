import React from "react";
import { ArrowRight, MapPin, Star } from "@phosphor-icons/react";
import { motion } from "framer-motion";
export default function Hero({ accommodations = [], onSelectAccommodation }) {
  const featuredItems = accommodations.filter((item) => item.featured);

  const handleExploreClick = () => {
    const catalogElement = document.getElementById("catalog");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[100dvh] flex items-center pt-28 pb-16 overflow-hidden px-4 md:px-8">
      {/* Background Glowing Mesh Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-accent-blue/10 blur-[120px] animate-orb-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-accent-cyan/10 blur-[130px] animate-orb-slower pointer-events-none" />

      {/* Grid Layout (Asymmetric Split Screen) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full z-10">
        
        {/* Left Side: Headline & Copy */}
        <div className="lg:col-span-5 flex flex-col items-start text-left">
          {/* Eyebrow badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-slate-300">
              Temporada Alta Abierta
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-sans font-bold text-4xl md:text-6xl tracking-tighter leading-none text-white mb-6"
          >
            Viajá por <br />
            <span className="bg-gradient-to-r from-accent-blue via-accent-cyan to-white bg-clip-text text-transparent">
              Argentina
            </span> <br />
            como nunca antes.
          </motion.h1>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-base text-slate-400 leading-relaxed max-w-[45ch] mb-8"
          >
            Descubrí la majestuosidad de Mendoza, la magia de la Patagonia y el esplendor porteño a través de una selección de alojamientos y experiencias exclusivas con curaduría de lujo.
          </motion.p>

          {/* Magnetic CTA Button with Button-in-Button Trailing Icon */}
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            onClick={handleExploreClick}
            className="group flex items-center bg-white text-black hover:bg-slate-100 font-sans font-semibold rounded-full pl-6 pr-2 py-2 transition-all duration-300 active:scale-[0.98] shadow-[0_10px_25px_rgba(255,255,255,0.1)]"
          >
            Explorar Destinos
            <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center ml-4 group-hover:translate-x-1 group-hover:-translate-y-[1px] transition-transform duration-300">
              <ArrowRight className="w-4 h-4 text-black" />
            </div>
          </motion.button>
        </div>

        {/* Right Side: Horizontal Interactive Slide Carousel */}
        <div className="lg:col-span-7 w-full overflow-visible">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory px-2"
          >
            {featuredItems.map((item, index) => (
              <div 
                key={item.id}
                onClick={() => onSelectAccommodation(item)}
                className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start p-1 bg-white/80 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-[2rem] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] cursor-pointer transform hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="bg-white rounded-[calc(2rem-0.25rem)] overflow-hidden p-3 border border-slate-100">
                  {/* Image wrapper */}
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4">
                    <img 
                      src={item.images[0]} 
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-accent-cyan" weight="fill" />
                      <span className="text-[11px] font-bold text-white">{item.rating}</span>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-accent-blue/80 backdrop-blur-md px-3 py-1 rounded-full border border-accent-blue/20">
                      <span className="text-[10px] uppercase font-bold text-white tracking-wider">
                        {item.experienceLabel.split(" ")[0]}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="px-1 pb-1">
                    <div className="flex items-center gap-1 text-slate-400 text-xs mb-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{item.location}, {item.province}</span>
                    </div>
                    <h3 className="font-sans font-bold text-lg text-white leading-tight mb-2 truncate">
                      {item.title}
                    </h3>
                    <div className="flex items-baseline justify-between mt-3">
                      <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Precio por Noche</span>
                      <span className="text-lg font-bold text-white">
                        USD {item.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
