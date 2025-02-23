import React, { useState, useEffect } from 'react';
import { Sparkles, Stars, Cloud, Sun, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

function Homepage() {
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('wordMagicSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        if (parsedSettings.dyslexicMode) {
          document.documentElement.classList.add('dyslexic-font');
          document.documentElement.style.setProperty('font-family', "'OpenDyslexic', sans-serif", 'important');
        }
        return parsedSettings;
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    return {
      age: 7,
      location: { city: '', country: '' },
      dyslexicMode: false
    };
  });

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'city' || name === 'country') {
      setSettings(prev => ({
        ...prev,
        location: { ...prev.location, [name]: value }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-cyan-400 via-pink-300 to-yellow-200 relative overflow-hidden ${settings.dyslexicMode ? 'dyslexic-font' : ''}`}>
      {/* Miami-style Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Palm Trees */}
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

        {/* Fast-moving Clouds */}
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
              duration: 8 + Math.random() * 4, // Faster clouds!
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            <span className="text-6xl">☁️</span>
          </motion.div>
        ))}

        {/* Swimming Dolphins */}
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

      {/* Main Content */}
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
              Miami's Super Fun Word Adventure!
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

      {/* Settings Button */}
        <motion.button
          className="absolute top-6 right-6 z-10 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSettings(true)}
        >
          <SettingsIcon className="w-6 h-6 text-indigo-600" />
        </motion.button>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowSettings(false)}
          >
            <motion.div
              className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8 w-full max-w-md m-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.4 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                  style={{ fontFamily: settings.dyslexicMode ? "'OpenDyslexic', sans-serif" : "inherit" }}>
                  Magic Settings
                </h2>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-lg text-indigo-700 mb-3">
                    Your Age:
                  </label>
                  <input
                    type="range"
                    name="age"
                    min="4"
                    max="12"  
                    value={settings.age}
                    onChange={handleChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-center mt-2 text-lg font-semibold text-purple-600">
                    {settings.age} years old
                  </div>
                </div>

                <div>
                  <label className="block text-lg text-indigo-700 mb-3">
                    Your Location:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={settings.location.city}
                      onChange={handleChange}
                      className="border-2 border-indigo-100 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-300 transition-colors"
                    />
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      value={settings.location.country}
                      onChange={handleChange}
                      className="border-2 border-indigo-100 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-300 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center bg-indigo-50 p-4 rounded-xl">
                  <input
                    type="checkbox"
                    id="dyslexicMode"
                    name="dyslexicMode"
                    checked={settings.dyslexicMode}
                    onChange={handleChange}
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-400 border-gray-300 rounded"
                  />
                  <label htmlFor="dyslexicMode" className="ml-3 text-lg text-indigo-700">
                    Dyslexic-Friendly Mode
                  </label>
                </div>

                <motion.button
                  onClick={() => setShowSettings(false)}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:opacity-90 transition-opacity"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save Magic Settings ✨
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Homepage;