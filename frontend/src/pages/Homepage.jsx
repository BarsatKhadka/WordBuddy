import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Homepage() {
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState(() => {
      const savedSettings = localStorage.getItem('wordMagicSettings');
      return savedSettings ? JSON.parse(savedSettings) : {
        age: 7,
        location: { city: '', country: '' },
        dyslexicMode: false
      };
    }); 

    useEffect(() => {
      localStorage.setItem('wordMagicSettings', JSON.stringify(settings));
    }, [settings.dyslexicMode, settings]);

    useEffect(() => {
        if (settings.dyslexicMode) {
          document.documentElement.classList.add('dyslexic-font');
          document.documentElement.style.setProperty(
            'font-family',
            "'OpenDyslexic', sans-serif",
            'important'
          );
        } else {
          document.documentElement.classList.remove('dyslexic-font');
          document.documentElement.style.removeProperty('font-family');
        }
      }, [settings.dyslexicMode]);
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      if (name === 'city' || name === 'country') {
        setSettings((prev) => ({
          ...prev,
          location: { ...prev.location, [name]: value },
        }));
      } else {
        setSettings((prev) => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value,
        }));
      }
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-400 via-pink-300 to-yellow-200 relative overflow-hidden">
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
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <h1 className="text-8xl md:text-9xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-yellow-500 to-cyan-500">
            WordBuddy
          </h1>
          <p className="text-4xl md:text-5xl font-bold text-white">
            Super Fun Word Adventure!
          </p>
        </div>
  
        
        <motion.button
        className="absolute top-6 right-6 z-10 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowSettings(true)}
      >
        <SettingsIcon className="w-6 h-6 text-indigo-600" />
      </motion.button>
  
        
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
                transition={{ type: 'spring', bounce: 0.4 }}
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
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    );
  }

  export default Homepage;