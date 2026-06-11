import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Eye, EyeSlash, Tag, Spinner, Info, CheckCircle, ArrowLeft, House } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminComercialDashboard({ onLogout, onBack }) {
  const [alojamientos, setAlojamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null); // id del alojamiento que se está editando
  const [successToast, setSuccessToast] = useState("");

  const cargarAlojamientos = () => {
    setLoading(true);
    // Enviar token para que el backend detecte rol comercial/general y retorne inactivos también
    api.get("/alojamientos")
      .then((res) => {
        setAlojamientos(res.data);
      })
      .catch((err) => {
        console.error("Error al cargar alojamientos", err);
        setError("Error al cargar el catálogo para administración.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    cargarAlojamientos();
  }, []);

  const showToast = (message) => {
    setSuccessToast(message);
    setTimeout(() => setSuccessToast(""), 3000);
  };

  const handleToggleVisibilidad = async (id, estadoActual) => {
    setUpdatingId(id + "-vis");
    try {
      const res = await api.put(`/alojamientos/${id}/visibilidad`, { activo: !estadoActual });
      // Actualizar estado local
      setAlojamientos(prev => prev.map(al => al.id === id ? { ...al, active: !estadoActual } : al));
      showToast(res.data.mensaje || "Visibilidad actualizada");
    } catch (err) {
      console.error(err);
      setError("No se pudo cambiar la visibilidad.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCambiarDescuento = async (id, valorDescuento) => {
    setUpdatingId(id + "-desc");
    try {
      const res = await api.put(`/alojamientos/${id}/promocion`, { descuento: valorDescuento });
      setAlojamientos(prev => prev.map(al => al.id === id ? { ...al, discount: valorDescuento } : al));
      showToast(res.data.mensaje || "Promoción actualizada");
    } catch (err) {
      console.error(err);
      setError("No se pudo aplicar el descuento.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-28 min-h-[90vh] relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-8 left-1/2 z-50 px-6 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium text-xs shadow-[0_10px_30px_rgba(16,185,129,0.2)] flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header del Dashboard */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span className="text-[10px] uppercase tracking-[0.12em] font-semibold text-indigo-300">
              Panel Administrativo
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-none">
            Administrador Comercial
          </h2>
          <p className="text-slate-400 text-sm">
            Gestioná la disponibilidad del catálogo y las tarifas promocionales vigentes en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-sans text-xs font-semibold rounded-full px-5 py-2.5 border border-white/10 transition-all duration-300 cursor-pointer"
          >
            <House className="w-4 h-4" />
            Ver Catálogo
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-sans text-xs font-semibold rounded-full px-5 py-2.5 transition-all duration-300 cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Alertas */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-400 text-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError("")} className="text-xs font-semibold hover:underline bg-transparent border-none text-red-400 cursor-pointer">
            Ignorar
          </button>
        </div>
      )}

      {/* Grilla / Listado de Alojamientos */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Spinner className="w-8 h-8 text-accent-cyan animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Cargando catálogo comercial...</p>
        </div>
      ) : (
        <div className="bg-white/[0.01] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="py-5 px-6 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Destino / Ubicación</th>
                  <th className="py-5 px-6 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Precio Base</th>
                  <th className="py-5 px-6 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Visibilidad</th>
                  <th className="py-5 px-6 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Tarifa Promocional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {alojamientos.map((aloj) => (
                  <tr key={aloj.id} className="hover:bg-white/[0.01] transition-colors duration-200">
                    {/* Celda Destino */}
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={aloj.images[0] || "https://picsum.photos/seed/default/800/600"}
                          alt={aloj.title}
                          className="w-16 h-12 rounded-lg object-cover brightness-[0.9]"
                        />
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-bold text-white leading-snug">{aloj.title}</h4>
                          <p className="text-xs text-slate-400">{aloj.location}, {aloj.province}</p>
                        </div>
                      </div>
                    </td>

                    {/* Celda Precio */}
                    <td className="py-6 px-6 font-mono text-sm text-slate-200 font-medium">
                      USD ${aloj.price} / noche
                    </td>

                    {/* Celda Visibilidad (Activo/Inactivo) */}
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleVisibilidad(aloj.id, aloj.active)}
                          disabled={updatingId !== null}
                          className={`relative w-11 h-6 rounded-full transition-colors duration-300 outline-none border-none cursor-pointer flex items-center ${
                            aloj.active ? "bg-accent-blue" : "bg-white/10"
                          }`}
                        >
                          <span
                            className={`block w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                              aloj.active ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                        <span className="text-xs font-semibold flex items-center gap-1.5">
                          {aloj.active ? (
                            <>
                              <Eye className="w-3.5 h-3.5 text-accent-cyan" />
                              <span className="text-slate-300">Visible</span>
                            </>
                          ) : (
                            <>
                              <EyeSlash className="w-3.5 h-3.5 text-slate-500" />
                              <span className="text-slate-500">Oculto</span>
                            </>
                          )}
                        </span>
                      </div>
                    </td>

                    {/* Celda Promoción (Descuentos) */}
                    <td className="py-6 px-6">
                      <div className="flex flex-wrap gap-1.5">
                        {[0, 10, 25, 50].map((pct) => (
                          <button
                            key={pct}
                            onClick={() => handleCambiarDescuento(aloj.id, pct)}
                            disabled={updatingId !== null}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 border cursor-pointer ${
                              aloj.discount === pct
                                ? "bg-accent-blue/15 border-accent-blue text-accent-cyan shadow-[0_2px_10px_rgba(37,99,235,0.15)]"
                                : "bg-transparent border-white/5 text-slate-400 hover:border-white/15 hover:text-white"
                            }`}
                          >
                            {pct === 0 ? "Sin Desc." : `${pct}% OFF`}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
