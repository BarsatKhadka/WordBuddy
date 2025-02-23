import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/store';

const StartButton = () => {
  const { settings } = useStore();
  
  return (
        <div className="flex justify-center mt-16">
          <motion.div
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            whileTap={{ scale: 0.9 }}
          >
            <Link to="/learn" className="relative group block">
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-200 animate-pulse"></div>
              <div className="relative px-20 py-10 bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 rounded-full border-4 border-white">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">🎮</span>
                  <span className="text-4xl font-bold text-white" 
                    style={{ 
                      fontFamily: settings.dyslexicMode ? "'OpenDyslexic', cursive" : "'Comic Sans MS', cursive",
                      textShadow: '3px 3px 0px #ff1493'
                    }}>
                    Let's Play!
                  </span>
                  <span className="text-5xl">✨</span>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
  );
};

export default StartButton; 