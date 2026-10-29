import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Filters from "./components/Filters";
import AccommodationCard from "./components/AccommodationCard";
import DetailModal from "./components/DetailModal";
import AuthModal from "./components/AuthModal";
import MisReservas from "./components/MisReservas";
import AdminComercialDashboard from "./components/AdminComercialDashboard";
import AdminGeneralDashboard from "./components/AdminGeneralDashboard";
import api from "./services/api";
import { Compass, Sparkle, Globe, ShieldCheck, Heart } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState("home"); // "home" | "mis-reservas" | "admin-comercial" | "admin-general"
  const [accommodations, setAccommodations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [maxPrice, setMaxPrice] = useState(600);
  const [loading, setLoading] = useState(true);
  
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [bookingRequestedFor, setBookingRequestedFor] = useState(null); // Retiene qué hotel se quería reservar al pedir login

  // Cargar perfil al montar la app para persistencia de sesión
  useEffect(() => {
    const token = localStorage.getItem("travel_token");
    if (token) {
      api.get("/autenticacion/perfil")
        .then((response) => {
          const loggedInUser = response.data;
          setUser(loggedInUser);
          if (loggedInUser.rol === "comercial") {
            setCurrentView("admin-comercial");
          } else if (loggedInUser.rol === "general") {
            setCurrentView("admin-general");
          }
        })
        .catch(() => {
          localStorage.removeItem("travel_token");
        });
    }
  }, []);

  // Cargar alojamientos filtrados desde la base de datos
  useEffect(() => {
    setLoading(true);
    const params = {};
    if (selectedDestination !== "all") params.destino = selectedDestination;
    if (selectedExperience !== "all") params.tipo = selectedExperience;
    params.precio_maximo = maxPrice;
    if (searchQuery) params.busqueda = searchQuery;

    api.get("/alojamientos", { params })
      .then((response) => {
        setAccommodations(response.data);
      })
      .catch((err) => {
        console.error("Error al cargar alojamientos", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedDestination, selectedExperience, maxPrice, searchQuery]);

  const filteredAccommodations = accommodations;

  const handleLogout = () => {
    localStorage.removeItem("travel_token");
    setUser(null);
    setCurrentView("home");
  };

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    
    // Redirigir al panel correspondiente según el rol del usuario logueado
    if (loggedInUser.rol === "comercial") {
      setCurrentView("admin-comercial");
    } else if (loggedInUser.rol === "general") {
      setCurrentView("admin-general");
    } else {
      setCurrentView("home");
    }
    
    // Si el usuario venía de intentar reservar un hotel específico, reabrimos el modal de ese hotel en el paso de reserva
    if (bookingRequestedFor) {
      setSelectedAccommodation(bookingRequestedFor);
      setBookingRequestedFor(null);
    }
  };

  const handleOpenAuthForAccommodation = (accommodationItem) => {
    setBookingRequestedFor(accommodationItem);
    setIsAuthModalOpen(true);
  };

  const handleNavClick = (target) => {
    if (target === "catalog") {
      const catalogEl = document.getElementById("catalog");
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: "smooth" });
      }
    } else if (target === "experiences") {
      const catalogEl = document.getElementById("catalog");
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: "smooth" });
      }
    } else if (target === "about") {
      const aboutEl = document.getElementById("about");
      if (aboutEl) {
        aboutEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="min-h-[100dvh] bg-bg-dark text-slate-100 font-sans selection:bg-accent-blue/30 selection:text-accent-cyan relative overflow-hidden">
      
      {/* Global animated background nodes */}
      <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-accent-blue/10 blur-[80px] opacity-40 pointer-events-none animate-orb-slow -z-10" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full bg-accent-cyan/10 blur-[80px] opacity-40 pointer-events-none animate-orb-slower -z-10" />
      
      {/* Float Navbar */}
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onOpenAuth={() => setIsAuthModalOpen(true)} 
        onNavClick={handleNavClick}
        onNavView={setCurrentView}
      />

      <AnimatePresence mode="wait">
        {currentView === "home" && (
          <motion.div
            key="home-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10"
          >
            {/* Hero section */}
            <Hero 
              accommodations={accommodations} 
              onSelectAccommodation={(item) => setSelectedAccommodation(item)} 
            />

            {/* Catalog & Filter Section */}
            <section id="catalog" className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-24 scroll-mt-20">
              
              {/* Section title & subtitle */}
              <div className="mb-12 text-left space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20">
                  <Sparkle className="w-3.5 h-3.5 text-accent-cyan" />
                  <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-slate-300">Catálogo Exclusivo</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-none">
                  Encontrá tu próximo destino
                </h2>
                <p className="text-slate-400 text-sm max-w-[55ch]">
                  Filtrá y ordená según tus preferencias. Cada hospedaje está seleccionado para ofrecerte vivencias culturales, gastronómicas y de aventura únicas en el país.
                </p>
              </div>

              {/* Filters Panel */}
              <Filters 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedDestination={selectedDestination}
                setSelectedDestination={setSelectedDestination}
                selectedExperience={selectedExperience}
                setSelectedExperience={setSelectedExperience}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
              />

              {/* Accommodations Grid */}
              <div className="mt-12">
                <AnimatePresence mode="popLayout">
                  {filteredAccommodations.length > 0 ? (
                    <motion.div 
                      layout
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                      {filteredAccommodations.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <AccommodationCard 
                            item={item} 
                            onClick={() => setSelectedAccommodation(item)} 
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    /* Empty state (Rule 5: Beautiful empty state) */
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-20 text-center space-y-4 max-w-md mx-auto"
                    >
                      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 mb-2">
                        <Compass className="w-8 h-8" weight="light" />
                      </div>
                      <h4 className="text-xl font-bold text-white tracking-tight">Sin alojamientos disponibles</h4>
                      <p className="text-sm text-slate-400 leading-relaxed font-sans">
                        No encontramos resultados que coincidan con tu búsqueda actual. Intentá restablecer los filtros o buscar con otros términos de presupuesto y provincia.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedDestination("all");
                          setSelectedExperience("all");
                          setMaxPrice(600);
                        }}
                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full px-5 py-2 text-xs font-semibold transition-colors duration-300 cursor-pointer"
                      >
                        Restablecer Filtros
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </section>

            {/* About & Trust Section (mid-year presentation value add) */}
            <section id="about" className="bg-white/[0.01] border-t border-b border-white/5 py-24 px-4 md:px-8">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-cyan">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Destinos Exclusivos</h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-[34ch]">
                    Curamos minuciosamente cada alojamiento en Mendoza, Patagonia y el resto del país para garantizar estándares internacionales y vivencias inolvidables.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-cyan">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Seguridad & Confianza</h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-[34ch]">
                    Gestión directa con operadores locales, asistencia al viajero 24/7 y políticas de cancelación flexibles para que tu único plan sea disfrutar.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-cyan">
                    <Sparkle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Servicio Personalizado</h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-[34ch]">
                    Al solicitar tu alojamiento, un Experience Manager dedicado coordinará tus traslados, cenas y guías turísticos según tus preferencias personales.
                  </p>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {currentView === "mis-reservas" && (
          <motion.div
            key="mis-reservas-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <MisReservas onBack={() => setCurrentView("home")} />
          </motion.div>
        )}

        {currentView === "admin-comercial" && (
          <motion.div
            key="admin-comercial-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <AdminComercialDashboard onLogout={handleLogout} onBack={() => setCurrentView("home")} />
          </motion.div>
        )}

        {currentView === "admin-general" && (
          <motion.div
            key="admin-general-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <AdminGeneralDashboard onLogout={handleLogout} onBack={() => setCurrentView("home")} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elegant Footer */}
      <footer className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-xs">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-accent-cyan" />
          <span className="font-bold tracking-widest text-slate-300">TRAVEL</span>
          <span>© 2026. Todos los derechos reservados.</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span>Desarrollado para parcial de mitad de año escolar con</span>
          <Heart className="w-3 h-3 text-red-500 fill-red-500" />
        </div>
      </footer>

      {/* Accomodation Details Panel (Drawer) */}
      <DetailModal 
        isOpen={selectedAccommodation !== null}
        onClose={() => setSelectedAccommodation(null)}
        item={selectedAccommodation}
        user={user}
        onOpenAuth={() => handleOpenAuthForAccommodation(selectedAccommodation)}
      />

      {/* User Login/Register Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
