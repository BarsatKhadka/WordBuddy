import React, { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Homepage() {
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({
      age: 7,
      location: { city: '', country: '' },
      dyslexicMode: false,
    });
  
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
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <h1 className="text-8xl md:text-9xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-yellow-500 to-cyan-500">
            WordBuddy
          </h1>
          <p className="text-4xl md:text-5xl font-bold text-white">
            Miami's Super Fun Word Adventure!
          </p>
        </div>
  
        
        <button
          className="absolute top-6 right-6 z-10 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          onClick={() => setShowSettings(true)}
        >
          <SettingsIcon className="w-6 h-6 text-indigo-600" />
        </button>
  
        
        <AnimatePresence>
          {showSettings && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
            >
              <motion.div
                className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8 w-full max-w-md m-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ type: 'spring', bounce: 0.4 }}
              >
                <h2 className="text-3xl font-bold mb-8">Settings</h2>
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
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }