import { motion } from 'framer-motion';

export default function CommunityIllustration({ className = "w-full h-auto max-w-md" }) {
  return (
    <svg
      viewBox="0 0 500 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Base sutil */}
      <ellipse cx="250" cy="280" rx="200" ry="16" className="fill-snow dark:fill-slate-800/60" />

      {/* Red de conexiones (Líneas de nodos) */}
      <path d="M 140 180 L 250 110 L 360 180" stroke="#7E9BED" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
      <path d="M 250 110 L 250 220" stroke="#7E9BED" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />

      {/* Nodo Central (Soporte / Mentoría) */}
      <motion.g
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <circle cx="250" cy="110" r="36" fill="#080067" />
        {/* Icono de usuario / comunidad */}
        <path d="M 250 96 A 10 10 0 1 0 250 116 A 10 10 0 1 0 250 96 Z M 236 128 C 236 120 242 118 250 118 C 258 118 264 120 264 128 Z" fill="#F8F9F8" />
      </motion.g>

      {/* Nodo Izquierdo (Estudiantes) */}
      <motion.g
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      >
        <circle cx="140" cy="180" r="28" fill="#7E9BED" />
        <rect x="126" y="172" width="28" height="16" rx="4" fill="#F8F9F8" opacity="0.9" />
      </motion.g>

      {/* Nodo Derecho (Clasificación compartida) */}
      <motion.g
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
      >
        <circle cx="360" cy="180" r="28" fill="#DEE5FF" />
        <path d="M 352 174 L 368 174 L 368 188 L 352 188 Z" fill="#080067" opacity="0.8" />
      </motion.g>

      {/* 🌟 Estrellas flotantes de interacción */}
      <motion.path
        d="M 310 80 L 314 90 L 324 94 L 314 98 L 310 108 L 306 98 L 296 94 L 306 90 Z"
        fill="#FED139"
        animate={{ y: [0, -8, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  );
}