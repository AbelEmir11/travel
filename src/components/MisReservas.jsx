import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Calendar, MapPin, Users, Receipt, ArrowLeft, Spinner, Info } from "@phosphor-icons/react";
import { motion } from "framer-motion";

export default function MisReservas({ onBack }) {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/reservas")
      .then((res) => {
        setReservas(res.data);
      })
      .catch((err) => {
        console.error("Error al obtener reservas", err);
        setError("No pudimos cargar tus reservas. Intentá de nuevo más tarde.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const formatFecha = (fechaStr) => {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(fechaStr + "T00:00:00");
    return date.toLocaleDateString('es-AR', opciones);
  };

  const getEstadoTag = (estado) => {
    switch (estado) {
      case "confirmed":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Confirmada
          </span>
        );
      case "cancelled":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-1.5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Cancelada
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center gap-1.5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Pendiente
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-28 min-h-[80vh]">
      {/* Botón de retorno */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-300 mb-8 bg-transparent border-none cursor-pointer text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al Catálogo
      </button>

      {/* Título de la sección */}
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-none">
          Mis Reservas
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          Consultá el estado y los detalles de tus solicitudes de hospedaje en los destinos más selectos de Argentina.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Spinner className="w-8 h-8 text-accent-cyan animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Cargando tu historial de viajes...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-400 text-sm flex items-center gap-3 max-w-xl">
          <Info className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      ) : reservas.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center space-y-4 max-w-md mx-auto"
        >
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 mb-2">
            <Calendar className="w-8 h-8" weight="light" />
          </div>
          <h4 className="text-xl font-bold text-white tracking-tight">No tenés reservas solicitadas</h4>
          <p className="text-sm text-slate-400 leading-relaxed font-sans">
            Aún no has solicitado ningún alojamiento. ¡Explorá nuestro catálogo de lujo y planeá tu próxima experiencia!
          </p>
          <button
            onClick={onBack}
            className="bg-accent-blue hover:bg-accent-blue/90 text-white font-sans text-xs font-semibold rounded-full px-6 py-2.5 shadow-[0_4px_14px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Explorar Catálogo
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reservas.map((reserva) => (
            <motion.div
              key={reserva.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 hover:bg-white/[0.03] transition-all duration-300 flex flex-col justify-between"
            >
              {/* Encabezado con foto y título */}
              <div>
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={reserva.alojamiento_imagen || "https://picsum.photos/seed/default/800/600"}
                    alt={reserva.alojamiento_titulo}
                    className="w-full h-full object-cover brightness-[0.85]"
                  />
                  <div className="absolute top-4 right-4">
                    {getEstadoTag(reserva.estado)}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-white leading-tight">
                      {reserva.alojamiento_titulo}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-accent-cyan" />
                      <span>{reserva.alojamiento_ubicacion}, {reserva.alojamiento_provincia}</span>
                    </div>
                  </div>

                  <div className="border-t border-b border-white/5 py-4 grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Check-in</span>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
                        <Calendar className="w-4 h-4 text-accent-cyan" />
                        <span>{formatFecha(reserva.check_in)}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Check-out</span>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
                        <Calendar className="w-4 h-4 text-accent-cyan" />
                        <span>{formatFecha(reserva.check_out)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-accent-cyan" />
                      <span>{reserva.huespedes} {reserva.huespedes === 1 ? "Huésped" : "Huéspedes"}</span>
                    </div>
                    {reserva.notes && (
                      <div className="italic text-[11px] truncate max-w-[200px]">
                        "{reserva.notes}"
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pie de la tarjeta con precio final */}
              <div className="p-6 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-slate-500" />
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Monto Abonado</span>
                </div>
                <div className="text-xl font-bold text-white font-mono">
                  USD ${reserva.precio_total}
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
