import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/store';
import BackgroundElements from '../components/BackgroundElements';
import Header from '../components/Header';
import StartButton from '../components/StartButton';
import AchievementBadges from '../components/AchievementBadges';
import SettingsModal from '../components/SettingsModal';

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
        <Header />
        <StartButton />
        <AchievementBadges />
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