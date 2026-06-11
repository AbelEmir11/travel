import React from "react";
import { MagnifyingGlass, Funnel, CurrencyDollar } from "@phosphor-icons/react";
import { DESTINATIONS, EXPERIENCE_TYPES } from "../data/mockData";

export default function Filters({
  searchQuery,
  setSearchQuery,
  selectedDestination,
  setSelectedDestination,
  selectedExperience,
  setSelectedExperience,
  maxPrice,
  setMaxPrice
}) {
  return (
    <div className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
      
      {/* Search & Price Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end mb-8">
        
        {/* Search Input */}
        <div className="md:col-span-7 space-y-2">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Buscá tu próxima aventura
          </label>
          <div className="relative">
            <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ej. Cavas Wine Lodge o Mendoza..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/50 transition-colors duration-300 font-sans"
            />
          </div>
        </div>

        {/* Budget / Price Range Slider */}
        <div className="md:col-span-5 space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <CurrencyDollar className="w-4 h-4 text-accent-cyan" />
              Presupuesto Máximo
            </label>
            <span className="text-sm font-bold text-white bg-accent-blue/20 border border-accent-blue/30 rounded-lg px-2.5 py-0.5">
              USD {maxPrice}
            </span>
          </div>
          <div className="flex items-center gap-4 py-2">
            <span className="text-xs text-slate-500">USD 100</span>
            <input
              type="range"
              min="100"
              max="600"
              step="20"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-blue focus:outline-none"
            />
            <span className="text-xs text-slate-500">USD 600</span>
          </div>
        </div>

      </div>

      <hr className="border-white/5 mb-6" />

      {/* Destinations Filter Tabs */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-3">
            <Funnel className="w-4 h-4 text-accent-cyan" />
            Filtrar por Destino
          </span>
          <div className="flex flex-wrap gap-2.5">
            {DESTINATIONS.map((dest) => {
              const isSelected = selectedDestination === dest.id;
              return (
                <button
                  key={dest.id}
                  onClick={() => setSelectedDestination(dest.id)}
                  className={`px-4 py-2 rounded-full font-sans text-xs font-semibold transition-all duration-300 border ${
                    isSelected
                      ? "bg-white text-black border-white shadow-[0_4px_12px_rgba(255,255,255,0.15)]"
                      : "bg-white/5 text-slate-400 border-white/5 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {dest.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Experience Types Filter Tabs */}
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3 mt-4">
            Tipo de Experiencia
          </span>
          <div className="flex flex-wrap gap-2.5">
            {EXPERIENCE_TYPES.map((exp) => {
              const isSelected = selectedExperience === exp.id;
              return (
                <button
                  key={exp.id}
                  onClick={() => setSelectedExperience(exp.id)}
                  className={`px-4 py-2 rounded-full font-sans text-xs font-semibold transition-all duration-300 border ${
                    isSelected
                      ? "bg-accent-blue text-white border-accent-blue shadow-[0_4px_14px_rgba(37,99,235,0.4)]"
                      : "bg-white/5 text-slate-400 border-white/5 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {exp.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
