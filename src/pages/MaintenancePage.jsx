import React from "react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] flex flex-col items-center justify-center p-6 text-center">
      {/* Icono animado */}
      <div className="mb-8 p-6 bg-white/5 rounded-full border border-white/10 shadow-lg shadow-black/20 animate-pulse">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-[var(--color-primary)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>

      {/* Contenido principal */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
        Estaremos fuera un tiempo
      </h1>

      <p className="text-lg text-slate-400 max-w-md mx-auto mb-10 leading-relaxed">
        Nos encontramos ajustando algunos detalles en el servicio para ofrecerte
        una mejor experiencia. Volveremos pronto.
      </p>

      {/* Botón de acción */}
      <button
        onClick={() => window.location.reload()}
        className="px-8 py-3 bg-[var(--color-primary)] hover:opacity-90 transition-opacity text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 active:scale-95"
      >
        Revisar de nuevo
      </button>

      {/* Fondo decorativo opcional (glow) */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
    </div>
  );
}
