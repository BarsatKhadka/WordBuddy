import { motion } from 'framer-motion';

const BackgroundElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Palm Trees */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`palm-${i}`}
          className="absolute"
          style={{
            bottom: '0',
            left: `${(i * 15)}%`,
          }}
          animate={{
            y: [0, -10, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <span className="text-6xl">🌴</span>
        </motion.div>
      ))}

      {/* Clouds */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`cloud-${i}`}
          className="absolute"
          style={{
            top: `${(i * 20) + Math.random() * 10}%`,
            left: `-20%`,
          }}
          animate={{
            x: ['0vw', '120vw'],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        >
          <span className="text-6xl">☁️</span>
        </motion.div>
      ))}

      {/* Dolphins */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`dolphin-${i}`}
          className="absolute"
          style={{
            bottom: `${20 + (i * 15)}%`,
            left: `-10%`,
          }}
          animate={{
            x: ['0vw', '110vw'],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            delay: i * 4,
          }}
        >
          <span className="text-5xl">🐬</span>
        </motion.div>
      ))}
    </div>
  );
};

export default BackgroundElements; 