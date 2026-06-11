import React, { useState } from "react";
import { X, EnvelopeSimple, Lock, User, Warning } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validaciones básicas
    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    
    if (!isLogin) {
      if (!name) {
        setError("Por favor ingresa tu nombre.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }
      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres.");
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await api.post("/autenticacion/ingreso", { email, password });
        const { token, usuario } = response.data;
        localStorage.setItem("travel_token", token);
        onLoginSuccess(usuario);
      } else {
        const response = await api.post("/autenticacion/registro", { nombre: name, email, password });
        const { token, usuario } = response.data;
        localStorage.setItem("travel_token", token);
        onLoginSuccess(usuario);
      }
      onClose();
      // Resetear campos
      setEmail("");
      setPassword("");
      setName("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.error || "Ocurrió un error. Por favor intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative z-10 w-full max-w-md double-bezel-outer pointer-events-auto"
          >
            <div className="double-bezel-inner p-8">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors duration-300"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title */}
              <div className="mb-8">
                <h3 className="font-sans font-bold text-2xl text-white tracking-tight">
                  {isLogin ? "Bienvenido de nuevo" : "Crear tu cuenta"}
                </h3>
                <p className="font-sans text-sm text-slate-400 mt-1">
                  {isLogin 
                    ? "Iniciá sesión para continuar con tu reserva" 
                    : "Registrate gratis para solicitar tu alojamiento"}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                  <Warning className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Input (Register Only) */}
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Nombre Completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej. Pedro Pérez"
                        disabled={isLoading}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/50 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Email Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <EnvelopeSimple className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="correo@ejemplo.com"
                      disabled={isLoading}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={isLoading}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Confirm Password (Register Only) */}
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Confirmar Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={isLoading}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/50 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative flex items-center justify-center bg-accent-blue hover:bg-accent-blue/90 text-white font-sans font-semibold rounded-xl py-3.5 shadow-[0_4px_14px_rgba(37,99,235,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] mt-2 overflow-hidden"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      {/* Custom Sleek Spinner */}
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Procesando...</span>
                    </div>
                  ) : (
                    <span>{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</span>
                  )}
                </button>
              </form>

              {/* Toggle Login/Register */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                  }}
                  className="text-xs text-slate-400 hover:text-white transition-colors duration-300 font-medium"
                >
                  {isLogin 
                    ? "¿No tenés una cuenta? Registrate gratis" 
                    : "¿Ya tenés una cuenta? Iniciá sesión"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
