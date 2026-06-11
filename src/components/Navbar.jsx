import React, { useState } from "react";
import { Compass, User, SignOut, List, X } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ user, onLogout, onOpenAuth, onNavClick, onNavView }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Alojamientos", target: "catalog" },
    { label: "Experiencias", target: "experiences" },
    { label: "Nosotros", target: "about" }
  ];

  const handleLinkClick = (e, target) => {
    e.preventDefault();
    if (onNavView) {
      onNavView("home"); // Asegura que vuelva a home al filtrar
    }
    setTimeout(() => {
      if (onNavClick) {
        onNavClick(target);
      }
    }, 100);
  };

  return (
    <>
      {/* Floating Island Navbar */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40 px-4 md:px-6 pt-6 pointer-events-none"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between pointer-events-auto backdrop-blur-xl bg-black/40 border border-white/10 rounded-full px-6 py-3 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.6)]">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (onNavView) onNavView("home");
            }}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-accent-blue/20 border border-accent-blue/40 flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
              <Compass className="w-5 h-5 text-accent-cyan" weight="light" />
            </div>
            <span className="font-sans font-bold text-lg tracking-wider bg-gradient-to-r from-white via-slate-200 to-accent-cyan bg-clip-text text-transparent">
              TRAVEL
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={(e) => handleLinkClick(e, link.target)}
                className="font-sans text-sm text-slate-300 hover:text-white transition-colors duration-300 relative group py-1 cursor-pointer bg-transparent border-none"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent-cyan group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          {/* User Auth Action (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full pl-3 pr-2 py-1">
                {/* Botón dinámico según el rol */}
                {user.rol === "cliente" && (
                  <button
                    onClick={() => onNavView("mis-reservas")}
                    className="text-xs font-semibold text-accent-cyan hover:text-white transition-colors py-1 px-2.5 rounded-full hover:bg-white/5 cursor-pointer bg-transparent border-none"
                  >
                    Mis Reservas
                  </button>
                )}
                {user.rol === "comercial" && (
                  <button
                    onClick={() => onNavView("admin-comercial")}
                    className="text-xs font-semibold text-indigo-300 hover:text-white transition-colors py-1 px-2.5 rounded-full hover:bg-white/5 cursor-pointer bg-transparent border-none"
                  >
                    Panel Comercial
                  </button>
                )}
                {user.rol === "general" && (
                  <button
                    onClick={() => onNavView("admin-general")}
                    className="text-xs font-semibold text-emerald-400 hover:text-white transition-colors py-1 px-2.5 rounded-full hover:bg-white/5 cursor-pointer bg-transparent border-none"
                  >
                    Panel General
                  </button>
                )}

                <span className="text-xs font-medium text-slate-300 border-l border-white/10 pl-2">{user.name.split(" ")[0]}</span>
                <button
                  onClick={onLogout}
                  className="w-7 h-7 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center text-red-400 transition-colors duration-300 cursor-pointer"
                  title="Cerrar sesión"
                >
                  <SignOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 bg-accent-blue hover:bg-accent-blue/90 text-white font-sans text-xs font-semibold rounded-full px-5 py-2.5 shadow-[0_4px_14px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
              >
                Ingresar
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden w-9 h-9 rounded-full bg-white/5 border border-white/10 items-center justify-center text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <List className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/95 backdrop-blur-2xl flex flex-col justify-center items-center md:hidden"
          >
            {/* Background glowing orb in drawer */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-accent-blue/20 blur-[100px] pointer-events-none" />

            <div className="flex flex-col items-center gap-8 z-10">
              {navLinks.map((link, idx) => (
                <motion.button
                  key={link.label}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  onClick={(e) => {
                    handleLinkClick(e, link.target);
                    setMobileMenuOpen(false);
                  }}
                  className="font-sans text-2xl font-semibold text-slate-300 hover:text-white transition-colors duration-300 cursor-pointer bg-transparent border-none"
                >
                  {link.label}
                </motion.button>
              ))}

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: navLinks.length * 0.1, duration: 0.5 }}
                className="mt-6"
              >
                {user ? (
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-sm font-medium text-slate-300">Hola, {user.name}</span>
                    
                    {user.rol === "cliente" && (
                      <button
                        onClick={() => {
                          onNavView("mis-reservas");
                          setMobileMenuOpen(false);
                        }}
                        className="text-sm font-semibold text-accent-cyan hover:underline cursor-pointer bg-transparent border-none"
                      >
                        Mis Reservas
                      </button>
                    )}
                    {user.rol === "comercial" && (
                      <button
                        onClick={() => {
                          onNavView("admin-comercial");
                          setMobileMenuOpen(false);
                        }}
                        className="text-sm font-semibold text-indigo-300 hover:underline cursor-pointer bg-transparent border-none"
                      >
                        Panel Comercial
                      </button>
                    )}
                    {user.rol === "general" && (
                      <button
                        onClick={() => {
                          onNavView("admin-general");
                          setMobileMenuOpen(false);
                        }}
                        className="text-sm font-semibold text-emerald-400 hover:underline cursor-pointer bg-transparent border-none"
                      >
                        Panel General
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full px-6 py-2.5 text-sm transition-colors duration-300 cursor-pointer"
                    >
                      <SignOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onOpenAuth();
                      setMobileMenuOpen(false);
                    }}
                    className="bg-accent-blue hover:bg-accent-blue/90 text-white font-sans font-semibold rounded-full px-8 py-3 shadow-[0_4px_14px_rgba(37,99,235,0.4)] transition-all duration-300"
                  >
                    Ingresar
                  </button>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
