import { motion } from 'framer-motion';
import { useStore } from '../store/store';

const Header = () => {
  const { settings } = useStore();

  return (
    <motion.div
      className="text-center mb-12"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h1 
        className="text-8xl md:text-9xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-yellow-500 to-cyan-500"
        style={{ 
          fontFamily: settings.dyslexicMode ? "'OpenDyslexic', cursive" : "'Comic Sans MS', cursive",
          textShadow: '4px 4px 0px #ff69b4, 8px 8px 0px #4169e1'
        }}
      >
        WordBuddy
      </h1>
      <motion.div 
        className="flex justify-center items-center gap-4 text-4xl md:text-5xl font-bold text-white"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <span>🌺</span>
        <p style={{ 
          fontFamily: settings.dyslexicMode ? "'OpenDyslexic', cursive" : "'Comic Sans MS', cursive",
          textShadow: '3px 3px 0px #ff1493'
        }}>
          Miami's Super Fun Word Adventure!
        </p>
        <span>🌺</span>
      </motion.div>
    </motion.div>
  );
};

export default Header; 