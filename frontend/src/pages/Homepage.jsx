import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/store';
import BackgroundElements from '../components/BackgroundElements';
import Header from '../components/Header';
import StartButton from '../components/StartButton';
import AchievementBadges from '../components/AchievementBadges';
import SettingsModal from '../components/SettingsModal';
import { Link } from 'react-router-dom';

function Homepage() {
  const [showSettings, setShowSettings] = useState(false);
  const { settings, initializeSettings } = useStore();

  useEffect(() => {
    initializeSettings();
  }, []);

  useEffect(() => {
    try {
      if (settings.dyslexicMode) {
        document.documentElement.classList.add('dyslexic-font');
        document.documentElement.style.setProperty('font-family', "'OpenDyslexic', sans-serif", 'important');
      } else {
        document.documentElement.classList.remove('dyslexic-font');
        document.documentElement.style.removeProperty('font-family');
      }
      localStorage.setItem('wordMagicSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error applying settings:', error);
    }
  }, [settings]);

  return (
    <div className={`min-h-screen bg-gradient-to-b from-cyan-400 via-pink-300 to-yellow-200 relative overflow-hidden ${settings.dyslexicMode ? 'dyslexic-font' : ''}`}>
      <BackgroundElements />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
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
              Super Fun Word Adventure!
            </p>
            <span>🌺</span>
          </motion.div>
        </motion.div>

        {/* Enhanced Start Button */}
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

        {/* Fun Achievement Badges */}
        <div className="flex justify-center gap-8 mt-16">
          {['🏆', '🌟', '🎨', '🎯'].map((emoji, i) => (
            <motion.div
              key={i}
              className="bg-white/30 p-4 rounded-full backdrop-blur-sm"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
            >
              <span className="text-4xl">{emoji}</span>
            </motion.div>
          ))}
        </div>

      </div>

      <motion.button
        className="absolute top-6 right-6 z-10 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowSettings(true)}
      >
        <SettingsIcon className="w-6 h-6 text-indigo-600" />
      </motion.button>

      <SettingsModal showSettings={showSettings} setShowSettings={setShowSettings} />
    </div>
  );
}

export default Homepage;