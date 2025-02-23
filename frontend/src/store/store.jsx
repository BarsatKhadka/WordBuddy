import { create } from 'zustand'

export const useStore = create((set) => ({
  settings: {
    age: 7,
    location: { city: '', country: '' },
    dyslexicMode: false
  },
  setSettings: (newSettings) => set({ settings: newSettings }),
  
  initializeSettings: () => {
    try {
      const savedSettings = localStorage.getItem('wordMagicSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        set({ settings: parsedSettings });
        if (parsedSettings.dyslexicMode) {
          document.documentElement.classList.add('dyslexic-font');
          document.documentElement.style.setProperty('font-family', "'OpenDyslexic', sans-serif", 'important');
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }
}))