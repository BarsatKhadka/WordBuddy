import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/store';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { useMemo } from 'react';

const SettingsModal = ({ showSettings, setShowSettings }) => {
  const { settings, setSettings } = useStore();
  
  const countryOptions = useMemo(() => countryList().getData(), []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newSettings = { ...settings };
    
    if (name === 'city' || name === 'country') {
      newSettings.location = { ...settings.location, [name]: value };
    } else {
      newSettings[name] = type === 'checkbox' ? checked : value;
    }
    
    setSettings(newSettings);
  };

  const handleCountryChange = (option) => {
    const newSettings = {
      ...settings,
      location: {
        ...settings.location,
        country: option ? option.label : ''
      }
    };
    setSettings(newSettings);
  };

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      border: '2px solid #E0E7FF',
      borderRadius: '0.75rem',
      padding: '0.5rem',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#A5B4FC'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#818CF8' : state.isFocused ? '#E0E7FF' : 'white',
      color: state.isSelected ? 'white' : '#1F2937',
      cursor: 'pointer',
      ':active': {
        backgroundColor: '#818CF8'
      }
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '0.75rem',
      overflow: 'hidden',
      backgroundColor: 'white'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9CA3AF'
    })
  };

  return (
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
                  <Select
                    options={countryOptions}
                    value={countryOptions.find(option => option.label === settings.location.country)}
                    onChange={handleCountryChange}
                    placeholder="Select Country"
                    styles={customSelectStyles}
                    className="rounded-xl"
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
  );
};

export default SettingsModal; 