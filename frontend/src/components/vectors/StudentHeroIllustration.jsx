import { motion } from 'framer-motion';

export default function StudentHeroIllustration({ className = "w-full h-auto" }) {
  return (
    <svg
      viewBox="0 0 500 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Sombra de base */}
      <ellipse cx="250" cy="285" rx="210" ry="18" className="fill-slate-200/70 dark:fill-slate-800/80" />

      {/* Libros de Materias */}
      <rect x="90" y="240" width="120" height="24" rx="6" fill="#080067" />
      <rect x="95" y="245" width="110" height="14" rx="3" fill="#DEE5FF" opacity="0.3" />
      
      <rect x="100" y="214" width="105" height="24" rx="6" fill="#7E9BED" />
      <rect x="105" y="219" width="95" height="14" rx="3" fill="#F8F9F8" opacity="0.4" />

      <rect x="110" y="188" width="85" height="24" rx="6" fill="#FED139" />

      {/* Card Principal de Documentos (Flota suavemente) */}
      <motion.g
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect
          x="220"
          y="80"
          width="190"
          height="180"
          rx="16"
          strokeWidth="1.5"
          className="fill-white dark:fill-slate-800 stroke-slate-200 dark:stroke-slate-700 shadow-sm"
        />
        {/* Encabezado del documento */}
        <rect x="240" y="105" width="70" height="12" rx="6" fill="#080067" />
        <rect x="320" y="105" width="40" height="12" rx="6" fill="#7E9BED" />
        
        {/* Líneas de Apuntes */}
        <rect x="240" y="132" width="150" height="8" rx="4" fill="#64748B" opacity="0.3" />
        <rect x="240" y="148" width="130" height="8" rx="4" fill="#64748B" opacity="0.2" />
        <rect x="240" y="164" width="140" height="8" rx="4" fill="#64748B" opacity="0.2" />
        
        {/* Badges Pill-shape (#PDF, #Apuntes) */}
        <rect x="240" y="190" width="52" height="22" rx="11" fill="#DEE5FF" className="dark:fill-slate-700" />
        <text x="266" y="205" textAnchor="middle" fontSize="10" fontWeight="700" fill="#080067">#PDF</text>
        
        <rect x="300" y="190" width="68" height="22" rx="11" fill="#7E9BED" opacity="0.25" className="dark:fill-slate-700" />
        <text x="334" y="205" textAnchor="middle" fontSize="10" fontWeight="700" fill="#080067">#Apuntes</text>
      </motion.g>

      {/* 🌟 Estrella Golden (Movimiento Vertical + Brillo) */}
      <motion.path
        d="M 180 80 L 186 96 L 202 102 L 186 108 L 180 124 L 174 108 L 158 102 L 174 96 Z"
        fill="#FED139"
        animate={{ y: [0, -10, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 🌟 Estrella Wisteria (Movimiento Vertical Desfasado) */}
      <motion.path
        d="M 420 50 L 424 62 L 436 66 L 424 70 L 420 82 L 416 70 L 404 66 L 416 62 Z"
        fill="#7E9BED"
        animate={{ y: [0, 8, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      />

      {/* Círculo Lavender Flotante */}
      <motion.circle
        cx="210"
        cy="50"
        r="6"
        fill="#DEE5FF"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
      />
    </svg>
  );
}