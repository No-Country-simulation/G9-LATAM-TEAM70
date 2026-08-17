import { motion } from 'framer-motion';

export default function DecorativeDividerPattern() {
  return (
    <div className="w-full flex justify-center items-center py-4 opacity-70 pointer-events-none">
      <svg width="240" height="40" viewBox="0 0 240 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="20" x2="80" y2="20" stroke="#7E9BED" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
        
        {/* Estrella central flotante */}
        <motion.path
          d="M 120 10 L 123 17 L 130 20 L 123 23 L 120 30 L 117 23 L 110 20 L 117 17 Z"
          fill="#FED139"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        <line x1="160" y1="20" x2="220" y2="20" stroke="#7E9BED" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
      </svg>
    </div>
  );
}