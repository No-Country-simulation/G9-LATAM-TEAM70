import { motion } from 'framer-motion';

export default function HeroBackgroundPattern() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <svg
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-60 dark:opacity-20"
        fill="none"
        viewBox="0 0 1200 800"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="180" cy="150" r="280" fill="url(#hero-grad-wisteria)" />
        <circle cx="1020" cy="200" r="300" fill="url(#hero-grad-lavender)" />

        {/* Cuadrado Navy Flotante */}
        <motion.rect
          x="140"
          y="300"
          width="48"
          height="48"
          rx="14"
          fill="#080067"
          opacity="0.12"
          transform="rotate(15 140 300)"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Cuadrado Wisteria Flotante */}
        <motion.rect
          x="960"
          y="120"
          width="56"
          height="56"
          rx="16"
          fill="#7E9BED"
          opacity="0.25"
          transform="rotate(-12 960 120)"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />

        {/* Círculo Lavender */}
        <motion.circle
          cx="880"
          cy="400"
          r="16"
          fill="#DEE5FF"
          opacity="0.5"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        {/* Círculo Golden */}
        <motion.circle
          cx="260"
          cy="100"
          r="10"
          fill="#FED139"
          opacity="0.6"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        <defs>
          <radialGradient id="hero-grad-wisteria" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(180 150) rotate(90) scale(280)">
            <stop stopColor="#7E9BED" stopOpacity="0.3" />
            <stop offset="1" stopColor="#7E9BED" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hero-grad-lavender" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1020 200) rotate(90) scale(300)">
            <stop stopColor="#DEE5FF" stopOpacity="0.4" />
            <stop offset="1" stopColor="#DEE5FF" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}