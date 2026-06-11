import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Users, Receipt, Calendar, ArrowUp, ArrowDown, Spinner, Info, CheckCircle, House, ShieldCheck } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminGeneralDashboard({ onLogout, onBack }) {
  const [stats, setStats] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successToast, setSuccessToast] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState(null);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [statsRes, usuariosRes] = await Promise.all([
        api.get("/admin/estadisticas"),
        api.get("/admin/usuarios")
      ]);
      setStats(statsRes.data);
      setUsuarios(usuariosRes.data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los datos del panel general. Asegurate de tener permisos correspondientes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const showToast = (message) => {
    setSuccessToast(message);
    setTimeout(() => setSuccessToast(""), 3000);
  };

  const handleCambiarRol = async (userId, nuevoRol) => {
    setUpdatingUserId(userId);
    try {
      const res = await api.put(`/admin/usuarios/${userId}/rol`, { rol: nuevoRol });
      setUsuarios(prev => prev.map(u => u.id === userId ? { ...u, rol: nuevoRol } : u));
      showToast(res.data.mensaje || "Rol actualizado con éxito");
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar el rol del usuario.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Renderizar Gráfico de Barras SVG
  const renderGraficoBarras = () => {
    if (!stats || !stats.ingresos_mensuales) return null;
    const datos = stats.ingresos_mensuales;
    const maxVal = Math.max(...datos.map(d => d.monto), 1000);
    
    // Dimensiones SVG
    const width = 600;
    const height = 220;
    const paddingLeft = 50;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;
    
    const graphWidth = width - paddingLeft - paddingRight;
    const graphHeight = height - paddingTop - paddingBottom;
    const barWidth = (graphWidth / datos.length) * 0.6;
    const gap = (graphWidth / datos.length) * 0.4;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto text-slate-400">
        {/* Líneas de cuadrícula horizontal */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = paddingTop + graphHeight * (1 - ratio);
          const val = Math.round(maxVal * ratio);
          return (
            <g key={idx}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                className="stroke-white/5"
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 10}
                y={y + 4}
                textAnchor="end"
                className="fill-slate-500 font-mono text-[9px] font-semibold"
              >
                ${val}
              </text>
            </g>
          );
        })}

        {/* Barras animadas */}
        {datos.map((d, idx) => {
          const barHeight = (d.monto / maxVal) * graphHeight;
          const x = paddingLeft + idx * (barWidth + gap) + gap / 2;
          const y = paddingTop + graphHeight - barHeight;

          return (
            <g key={idx} className="group">
              <motion.rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={4}
                className="fill-accent-blue/80 hover:fill-accent-cyan transition-colors duration-300"
                initial={{ height: 0, y: paddingTop + graphHeight }}
                animate={{ height: barHeight, y: y }}
                transition={{ duration: 0.8, delay: idx * 0.05, ease: "easeOut" }}
              />
              {/* Tooltip simple en hover */}
              <title>{`${d.mes}: USD $${d.monto}`}</title>
              {/* Texto de etiquetas de meses */}
              <text
                x={x + barWidth / 2}
                y={paddingTop + graphHeight + 18}
                textAnchor="middle"
                className="fill-slate-400 text-[10px] font-semibold"
              >
                {d.mes}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  // Renderizar Gráfico Donut SVG
  const renderGraficoDonut = () => {
    if (!stats || !stats.reservas_por_provincia || stats.reservas_por_provincia.length === 0) {
      return (
        <div className="flex items-center justify-center h-48 text-slate-500 text-xs font-semibold">
          No hay reservas para mostrar.
        </div>
      );
    }
    const datos = stats.reservas_por_provincia;
    const total = datos.reduce((acc, d) => acc + d.cantidad, 0);
    
    // Configuración donut
    const size = 180;
    const strokeWidth = 24;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    // Colores pastel en degrade
    const colores = ["#818cf8", "#38bdf8", "#34d399", "#f43f5e", "#fbbf24"];

    let acumulado = 0;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
        {/* Gráfico circular */}
        <div className="relative w-40 h-40">
          <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
            <circle
              cx={center}
              cy={center}
              r={radius}
              className="fill-none stroke-white/5"
              strokeWidth={strokeWidth}
            />
            {datos.map((d, idx) => {
              const pct = d.cantidad / total;
              const dashArray = `${pct * circumference} ${circumference}`;
              const strokeOffset = circumference - (acumulado / total) * circumference;
              acumulado += d.cantidad;
              
              return (
                <motion.circle
                  key={idx}
                  cx={center}
                  cy={center}
                  r={radius}
                  className="fill-none"
                  stroke={colores[idx % colores.length]}
                  strokeWidth={strokeWidth}
                  strokeDasharray={dashArray}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: strokeOffset }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${center} ${center})`}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold text-white font-mono">{total}</span>
            <span className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">Reservas</span>
          </div>
        </div>

        {/* Leyenda */}
        <div className="space-y-2.5">
          {datos.map((d, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: colores[idx % colores.length] }}
              />
              <div className="text-xs space-y-0.5">
                <span className="font-semibold text-slate-200 block leading-none">{d.provincia}</span>
                <span className="text-slate-400 font-mono text-[10px]">
                  {d.cantidad} {d.cantidad === 1 ? "reserva" : "reservas"} ({Math.round((d.cantidad / total) * 100)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span className="text-[10px] uppercase tracking-[0.12em] font-semibold text-indigo-300">
              Panel de Control General
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-none">
            Administrador General
          </h2>
          <p className="text-slate-400 text-sm">
            Supervisión financiera integral, análisis de ventas y asignación de permisos de acceso del personal.
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

      {error && (
        <div className="mb-8 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-400 text-sm flex items-center gap-3">
          <Info className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Spinner className="w-8 h-8 text-accent-cyan animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Cargando base financiera y de personal...</p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Tarjetas de Métricas Clave */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Ingresos Totales */}
            <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Ingresos Totales</span>
                <div className="w-8 h-8 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-cyan">
                  <Receipt className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-white font-mono">USD ${stats.ingresos_totales}</h3>
                <p className="text-xs text-slate-500">Monto total facturado</p>
              </div>
            </div>

            {/* Comparación Mensual */}
            <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Desempeño Mensual</span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${stats.diferencia_porcentaje >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                  {stats.diferencia_porcentaje >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-white font-mono">
                  {stats.diferencia_porcentaje >= 0 ? "+" : ""}{stats.diferencia_porcentaje}%
                </h3>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <span>Junio vs Mayo (2026)</span>
                </div>
              </div>
            </div>

            {/* Reservas Confirmadas */}
            <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Total Reservas</span>
                <div className="w-8 h-8 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-cyan">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-white font-mono">{stats.total_reservas}</h3>
                <p className="text-xs text-slate-500">{stats.reservas_confirmadas} reservas confirmadas</p>
              </div>
            </div>

            {/* Tasa Conversión */}
            <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Conversión Comercial</span>
                <div className="w-8 h-8 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-cyan">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-white font-mono">{stats.tasa_conversion}%</h3>
                <p className="text-xs text-slate-500">Reservas / Visitas estimadas</p>
              </div>
            </div>

          </div>

          {/* Gráficos Estadísticos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ingresos Mensuales (Barras) */}
            <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 lg:col-span-2 space-y-6">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-white leading-none">Ingresos Mensuales (2026)</h3>
                <p className="text-xs text-slate-500">Facturación mensual consolidada en USD</p>
              </div>
              <div className="pt-2">{renderGraficoBarras()}</div>
            </div>

            {/* Distribución por Provincia (Donut) */}
            <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 space-y-6">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-white leading-none">Ventas por Provincia</h3>
                <p className="text-xs text-slate-500">Distribución porcentual de reservas</p>
              </div>
              <div className="pt-2 flex items-center justify-center h-full min-h-[220px]">
                {renderGraficoDonut()}
              </div>
            </div>
          </div>

          {/* Gestión de Personal */}
          <div className="bg-white/[0.01] border border-white/5 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-6">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-white leading-none">Gestión de Personal</h3>
              <p className="text-xs text-slate-500">Administración de credenciales de empleados y cambio de roles del personal.</p>
            </div>
            
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="py-4 px-5 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Usuario</th>
                    <th className="py-4 px-5 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Correo Electrónico</th>
                    <th className="py-4 px-5 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Nivel de Acceso (Rol)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {usuarios.map((usr) => (
                    <tr key={usr.id} className="hover:bg-white/[0.01] transition-colors duration-200">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-200">
                            {usr.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <span className="text-sm font-bold text-slate-200">{usr.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-sm text-slate-400 font-mono">
                        {usr.email}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <select
                            value={usr.rol}
                            onChange={(e) => handleCambiarRol(usr.id, e.target.value)}
                            disabled={updatingUserId === usr.id}
                            className="bg-black/40 border border-white/10 hover:border-white/20 text-xs font-semibold text-slate-200 rounded-xl px-3 py-1.5 outline-none cursor-pointer focus:border-accent-blue transition-colors duration-300"
                          >
                            <option value="cliente" className="bg-bg-dark text-slate-200">Cliente (Usuario Final)</option>
                            <option value="comercial" className="bg-bg-dark text-slate-200">Administrador Comercial</option>
                            <option value="general" className="bg-bg-dark text-slate-200">Administrador General</option>
                          </select>
                          
                          {updatingUserId === usr.id && (
                            <Spinner className="w-4 h-4 text-accent-cyan animate-spin" />
                          )}
                          
                          {usr.rol === "general" && (
                            <ShieldCheck className="w-4 h-4 text-emerald-400" title="Acceso total" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
