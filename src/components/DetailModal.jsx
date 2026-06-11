import React, { useState, useEffect } from "react";
import { X, Calendar, Users, CheckCircle, CaretLeft, CaretRight, MapPin, Check, ArrowRight } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

export default function DetailModal({ isOpen, onClose, item, user, onOpenAuth }) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [bookingStep, setBookingStep] = useState("details"); // "details" | "booking" | "success"
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const todayStr = new Date().toLocaleDateString("en-CA");

  // Reset states when modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      setBookingStep("details");
      setActiveImgIdx(0);
      setCheckIn("");
      setCheckOut("");
      setGuests("1");
      setNotes("");
      setError("");
    }
  }, [isOpen]);

  if (!item) return null;

  const hasDiscount = item.discount && item.discount > 0;
  const finalPrice = hasDiscount ? Math.round(item.price * (1 - item.discount / 100)) : item.price;

  const nextImage = () => {
    setActiveImgIdx((prev) => (prev + 1) % item.images.length);
  };

  const prevImage = () => {
    setActiveImgIdx((prev) => (prev - 1 + item.images.length) % item.images.length);
  };

  const handleBookingClick = () => {
    if (!user) {
      // Si el usuario no está logueado, abrimos el modal de login
      onOpenAuth();
    } else {
      // Si está logueado, pasamos al formulario de reserva
      setBookingStep("booking");
    }
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setError("");

    if (!checkIn || !checkOut) {
      setError("Por favor seleccioná las fechas de Check-In y Check-Out.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkInDate = new Date(checkIn + "T00:00:00");
    if (checkInDate < today) {
      setError("La fecha de check-in no puede ser anterior al día de hoy.");
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      setError("La fecha de salida debe ser posterior a la fecha de entrada.");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/reservas", {
        alojamiento_id: item.id,
        check_in: checkIn,
        check_out: checkOut,
        huespedes: parseInt(guests, 10),
        notes: notes
      });
      setBookingStep("success");
    } catch (err) {
      setError(err.response?.data?.error || "Error al procesar la reserva. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />

          {/* Drawer container (slides from the right) */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="relative z-10 w-full max-w-2xl bg-bg-dark border-l border-white/10 h-full flex flex-col shadow-2xl pointer-events-auto"
          >
            {/* Header / Top actions */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <MapPin className="w-4 h-4 text-accent-cyan" />
                <span>{item.location}, {item.province}</span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors duration-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="wait">
                
                {/* STEP 1: DETAILS */}
                {bookingStep === "details" && (
                  <motion.div
                    key="details-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-6 md:p-8 space-y-8"
                  >
                    {/* High-res Image Gallery Carousel */}
                    <div className="relative h-64 md:h-80 w-full rounded-3xl overflow-hidden group">
                      <img
                        src={item.images[activeImgIdx]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                      {/* Navigation arrows */}
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                      >
                        <CaretLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                      >
                        <CaretRight className="w-5 h-5" />
                      </button>

                      {/* Dots indicator */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {item.images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImgIdx(idx)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              idx === activeImgIdx ? "w-5 bg-white" : "bg-white/40"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Titles */}
                    <div className="space-y-3">
                      <div className="inline-flex bg-accent-blue/20 border border-accent-blue/30 rounded-full px-3 py-1 text-[10px] uppercase font-bold text-accent-cyan tracking-wider">
                        {item.experienceLabel}
                      </div>
                      <h2 className="text-3xl font-bold tracking-tight text-white">{item.title}</h2>
                      <div className="text-xl font-bold text-white">
                        USD {item.price} <span className="text-sm font-normal text-slate-500">/ noche</span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Sobre el alojamiento</h4>
                      <p className="text-slate-300 leading-relaxed text-sm font-sans">{item.description}</p>
                    </div>

                    {/* Custom Activities (Argentina/Mendoza Focused) */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Experiencias y Actividades Incluidas</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {item.activities.map((act, index) => (
                          <div key={index} className="flex gap-3 items-start bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                            <span className="w-5 h-5 rounded-full bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center text-accent-cyan text-xs font-bold shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-xs text-slate-300 font-sans leading-relaxed">{act}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Amenities list */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Servicios destacados</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.amenities.map((am) => (
                          <div key={am} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                            <Check className="w-3.5 h-3.5 text-accent-cyan" />
                            <span className="text-xs text-slate-300 font-sans">{am}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: BOOKING FORM */}
                {bookingStep === "booking" && (
                  <motion.div
                    key="booking-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-6 md:p-8 space-y-6"
                  >
                    <div className="border-b border-white/5 pb-4 mb-6">
                      <h3 className="text-2xl font-bold text-white tracking-tight">Confirmar tu Reserva</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Estás a un paso de reservar en <span className="text-accent-cyan font-bold">{item.title}</span>.
                      </p>
                    </div>

                    {error && (
                      <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                        <span>{error}</span>
                      </div>
                    )}

                    <form onSubmit={handleConfirmBooking} className="space-y-6">
                      {/* Dates Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-accent-cyan" />
                            Fecha Check-In
                          </label>
                          <input
                            type="date"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            disabled={isSubmitting}
                            min={todayStr}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/50 transition-colors cursor-pointer"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-accent-cyan" />
                            Fecha Check-Out
                          </label>
                          <input
                            type="date"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            disabled={isSubmitting}
                            min={checkIn || todayStr}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/50 transition-colors cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Guests selection */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-accent-cyan" />
                          Cantidad de Huéspedes
                        </label>
                        <select
                          value={guests}
                          onChange={(e) => setGuests(e.target.value)}
                          disabled={isSubmitting}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue/50 cursor-pointer"
                        >
                          <option value="1" className="bg-bg-dark text-white">1 Huésped</option>
                          <option value="2" className="bg-bg-dark text-white">2 Huéspedes</option>
                          <option value="3" className="bg-bg-dark text-white">3 Huéspedes</option>
                          <option value="4" className="bg-bg-dark text-white">4 Huéspedes o más</option>
                        </select>
                      </div>

                      {/* Custom requests */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          Notas o pedidos especiales
                        </label>
                        <textarea
                          rows="4"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          disabled={isSubmitting}
                          placeholder="Contanos si tenés requerimientos alimentarios, necesitás cuna, o querés programar un transfer."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/50 transition-colors resize-none font-sans"
                        />
                      </div>

                      {/* Summary of reservation */}
                      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3">
                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Resumen de tarifas</h4>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Tarifa por noche</span>
                          {hasDiscount ? (
                            <div className="flex items-center gap-2">
                              <span className="text-accent-cyan font-bold font-mono">USD {finalPrice}</span>
                              <span className="text-slate-500 line-through text-xs font-mono">USD {item.price}</span>
                            </div>
                          ) : (
                            <span className="text-white">USD {item.price}</span>
                          )}
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Tasas municipales & servicios</span>
                          <span className="text-white">USD 40</span>
                        </div>
                        <hr className="border-white/5" />
                        <div className="flex justify-between font-bold text-base">
                          <span className="text-white">Total Estimado</span>
                          <span className="text-accent-cyan">USD {finalPrice + 40}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-4">
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => setBookingStep("details")}
                          className="w-1/3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl py-3.5 font-semibold text-sm transition-colors duration-300"
                        >
                          Atrás
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-2/3 bg-accent-blue hover:bg-accent-blue/90 text-white font-sans font-semibold rounded-xl py-3.5 shadow-[0_4px_14px_rgba(37,99,235,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center gap-3">
                              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              <span>Enviando solicitud...</span>
                            </div>
                          ) : (
                            <span>Confirmar Solicitud</span>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* STEP 3: SUCCESS */}
                {bookingStep === "success" && (
                  <motion.div
                    key="success-view"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6 md:p-8 flex flex-col items-center justify-center h-full text-center space-y-6 pt-16"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
                      className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4"
                    >
                      <CheckCircle className="w-12 h-12" weight="light" />
                    </motion.div>

                    <h3 className="text-3xl font-bold text-white tracking-tight">¡Solicitud Recibida!</h3>
                    <p className="text-slate-400 max-w-[36ch] text-sm leading-relaxed font-sans">
                      Tu solicitud de alojamiento para <span className="text-white font-semibold">{item.title}</span> fue procesada con éxito.
                    </p>

                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-left w-full space-y-3 font-sans text-xs text-slate-300">
                      <p>• Un asesor se contactará al mail <span className="text-accent-cyan font-bold">{user?.email}</span> dentro de las próximas 2 horas.</p>
                      <p>• Recibirás el desglose formal de la reserva y las opciones de pago (Tarjetas, Transferencia Bancaria o Criptomonedas).</p>
                    </div>

                    <button
                      onClick={onClose}
                      className="bg-white text-black hover:bg-slate-100 font-sans font-semibold rounded-full px-8 py-3.5 shadow-lg transition-all duration-300 active:scale-[0.98] mt-6"
                    >
                      Cerrar Ventana
                    </button>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Footer containing primary CTA (Sticky at bottom, only in step 'details') */}
            {bookingStep === "details" && (
              <div className="p-6 border-t border-white/10 bg-card-dark flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Tarifa por Noche</span>
                  <div className="flex items-baseline gap-1">
                    {hasDiscount ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-accent-cyan">USD {finalPrice}</span>
                        <span className="text-xs text-slate-500 line-through">USD {item.price}</span>
                      </div>
                    ) : (
                      <span className="text-xl font-bold text-white">USD {item.price}</span>
                    )}
                  </div>
                </div>

                {/* Primary Booking Button */}
                <button
                  onClick={handleBookingClick}
                  className="group flex items-center bg-white text-black hover:bg-slate-100 font-sans font-semibold rounded-full pl-6 pr-2 py-2.5 transition-all duration-300 active:scale-[0.98] shadow-lg"
                >
                  {user ? "Solicitar Alojamiento" : "Ingresar para Solicitar"}
                  <div className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center ml-4 group-hover:translate-x-1 group-hover:-translate-y-[1px] transition-transform duration-300">
                    <ArrowRight className="w-3.5 h-3.5 text-black" />
                  </div>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
