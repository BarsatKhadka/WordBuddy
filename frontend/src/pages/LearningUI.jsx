import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Stars, Mic, SkipForward, FastForward, Globe, Trophy, Star, Sparkles, Zap, Hand } from 'lucide-react';
import BackgroundElements from '../components/Learning/BackgroundElements';


const LearningUI = ({
  isGameStarted,
  currentWord,
  greeting,
  currentLetterIndex,
  isRecording,
  loadingState,
  errorMessage,
  showMic,
  storyImage,
  selectedLanguage,
  dyslexicMode,
  getFontStyle,
  startGame,
  handleLanguageChange,
  startRecording,
  skipLetter,
  skipWord,
  showPhonetic,
  phoneticBreakdown,
  languageSelectionStep,
  handleNativeLanguageSelect,
  handleTargetLanguageSelect,
  nativeLanguage,
  translation,
  stats,
  rhyme,
  gameState,
}) => {
  const [showHandSignal, setShowHandSignal] = useState(false);

  const HandSignalModal = ({ letter, onClose }) => {
    return (
      <motion.div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-xl p-4 max-w-sm w-full m-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-purple-600">
              Hand Signal for Letter '{letter.toUpperCase()}'
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="flex justify-center">
            <img 
              src={`/src/assets/handSignals/${letter.toLowerCase()}.gif`}
              alt={`Hand signal for letter ${letter}`}
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const renderLanguageSelection = () => {
    if (languageSelectionStep === 1) {
      return (
        <div className="space-y-6">
          <h2 
            className="text-3xl text-purple-600 text-center mb-4" 
            style={{ 
              fontFamily: dyslexicMode ? "'OpenDyslexic', sans-serif" : "'Bubblegum Sans', cursive",
              textShadow: '2px 2px 0px #ff69b4'
            }}
          >
            What is your native language?
          </h2>
          <div className="space-y-4">
            <motion.button
              className="w-full py-4 px-6 rounded-lg font-bold text-lg flex items-center justify-center gap-2 bg-purple-600 text-white"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNativeLanguageSelect('english')}
            >
              <Globe className="w-5 h-5" />
              English
            </motion.button>
            <motion.button
              className="w-full py-4 px-6 rounded-lg font-bold text-lg flex items-center justify-center gap-2 bg-purple-600 text-white"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNativeLanguageSelect('spanish')}
            >
              <Globe className="w-5 h-5" />
              Español
            </motion.button>
          </div>
        </div>
      );
    } else if (languageSelectionStep === 2) {
      return (
        <div className="space-y-6">
          <h2 
            className="text-3xl text-purple-600 text-center mb-4" 
            style={{ 
              fontFamily: dyslexicMode ? "'OpenDyslexic', sans-serif" : "'Bubblegum Sans', cursive",
              textShadow: '2px 2px 0px #ff69b4'
            }}
          >
            Which language would you like to learn?
          </h2>
          <div className="space-y-4">
            {nativeLanguage !== 'english' && (
              <motion.button
                className="w-full py-4 px-6 rounded-lg font-bold text-lg flex items-center justify-center gap-2 bg-purple-600 text-white"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTargetLanguageSelect('english')}
              >
                <Globe className="w-5 h-5" />
                English
              </motion.button>
            )}
            {nativeLanguage !== 'spanish' && (
              <motion.button
                className="w-full py-4 px-6 rounded-lg font-bold text-lg flex items-center justify-center gap-2 bg-purple-600 text-white"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTargetLanguageSelect('spanish')}
              >
                <Globe className="w-5 h-5" />
                Español
              </motion.button>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const StatsBoard = () => {
    // Calculate level progress percentage
    const progressPercent = (stats.xp % 100);
    
    return (
      <motion.div
        className="fixed right-4 top-20 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-xl border-2 border-purple-300 w-64"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={getFontStyle()}
      >
        {/* Magic Level Section */}
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-purple-600 flex items-center justify-center gap-2">
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            Magic Level {stats.level}
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-purple-600 mb-1">
            <span>Magic Power</span>
            <span>{progressPercent}/100 XP</span>
          </div>
          <div className="w-full h-4 bg-purple-100 rounded-full overflow-hidden border border-purple-300">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-400 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Words Mastered */}
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Words</span>
            </div>
            <div className="text-xl font-bold text-purple-700">
              {stats.wordsCompleted}
            </div>
          </div>

          {/* Daily Streak */}
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
              <Zap className="w-4 h-4" />
              <span>Streak</span>
            </div>
            <div className="text-xl font-bold text-purple-700">
              {stats.streak} days
            </div>
          </div>
        </div>

        {/* Achievement Message */}
        {stats.wordsCompleted > 0 && stats.wordsCompleted % 5 === 0 && (
          <motion.div
            className="mt-4 text-center text-sm text-purple-600 bg-purple-50 rounded-lg p-2"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Trophy className="w-4 h-4 inline mr-1 text-yellow-500" />
            {`Wow! You've learned ${stats.wordsCompleted} words!`}
          </motion.div>
        )}
      </motion.div>
    );
  };

  const formatRhyme = (rhymeText) => {
    return rhymeText.split('\\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-sky-200 via-purple-100 to-pink-100 relative overflow-hidden p-8 ${dyslexicMode ? 'dyslexic-font' : ''}`}>
     <BackgroundElements />
      <motion.div 
        className="absolute top-10 left-10"
        animate={{ x: [0, 20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Cloud className="w-16 h-16 text-white" />
      </motion.div>

      <div className="container mx-auto max-w-2xl">
        <motion.div 
          className="text-center mb-8"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 
            className="text-5xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-yellow-500 to-cyan-500" 
            style={{ 
              fontFamily: dyslexicMode ? "'OpenDyslexic', sans-serif" : "'Bubblegum Sans', cursive",
              textShadow: '2px 2px 0px #ff69b4, 4px 4px 0px #4169e1'
            }}
          >
            {languageSelectionStep <= 2 ? 'Welcome to Language Learning! 🎈' :
             selectedLanguage === 'spanish' ? '¡Aprendamos Nuevas Palabras! 🎈' : 'Let\'s Learn New Words! 🎈'}
          </h1>
        </motion.div>

        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {languageSelectionStep <= 2 ? (
            renderLanguageSelection()
          ) : !isGameStarted ? (
            <div className="space-y-6">
              <h2 
                className="text-3xl text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500" 
                style={{ 
                  fontFamily: dyslexicMode ? "'OpenDyslexic', sans-serif" : "'Bubblegum Sans', cursive",
                  textShadow: '1px 1px 0px #ff69b4'
                }}
              >
                {selectedLanguage === 'spanish' ? 'Elige tu idioma' : 'Choose Your Language'}
              </h2>

              <div className="flex gap-4 justify-center mb-6">
                <motion.button
                  className={`px-6 py-3 rounded-lg font-bold text-lg flex items-center gap-2
                    ${selectedLanguage === 'english' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleLanguageChange('english')}
                  style={getFontStyle()}
                >
                  <Globe className="w-5 h-5" />
                  English
                </motion.button>

                <motion.button
                  className={`px-6 py-3 rounded-lg font-bold text-lg flex items-center gap-2
                    ${selectedLanguage === 'spanish' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleLanguageChange('spanish')}
                  style={getFontStyle()}
                >
                  <Globe className="w-5 h-5" />
                  Español
                </motion.button>
              </div>

              <motion.button
                className="w-full py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startGame}
                style={getFontStyle()}
              >
                {selectedLanguage === 'spanish' ? '¡Comenzar a Aprender!' : 'Start Learning!'}
              </motion.button>
            </div>
          ) : (
            <div className="space-y-6">
              {loadingState ? (
                <div className="text-center">
                  <div className="animate-spin h-12 w-12 mx-auto border-4 border-purple-500 border-t-transparent rounded-full"/>
                </div>
              ) : (
                <>
                  <motion.div 
                    className="text-lg space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={getFontStyle()}
                  >
                    {/* Adventure Story */}
                    <div 
                      className="text-2xl text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ 
                        fontFamily: dyslexicMode ? "'OpenDyslexic', sans-serif" : "'Bubblegum Sans', cursive",
                        textShadow: '1px 1px 0px #ff69b4'
                      }}
                    >
                      {greeting}
                    </div>

                    {/* Word and Translation Box */}
                    <motion.div 
                      className="bg-purple-100 p-4 rounded-lg shadow-md border-2 border-purple-300"
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-center space-y-2">
                        <div className="text-2xl font-bold text-purple-800">
                          {currentWord}
                        </div>
                        {/* Only show translation when native language is different from selected language */}
                        {nativeLanguage !== selectedLanguage && (
                          <div className="text-md text-purple-600">
                            {nativeLanguage === 'spanish' 
                              ? `Significa "${translation}" en español`
                              : `Means "${translation}" in English`
                            }
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Phonetic Instructions */}
                    {showPhonetic && (
                      <div className="mt-2 text-purple-600 font-medium text-center">
                        {selectedLanguage === 'spanish' 
                          ? 'Vamos a practicar los sonidos de esta palabra.' 
                          : "Let's practice the sounds of this word."}
                      </div>
                    )}
                  </motion.div>

                  <motion.div 
                    className="flex justify-center gap-4 flex-wrap mt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {showPhonetic ? (
                      // Phonetic breakdown
                      phoneticBreakdown.map((phoneme, index) => (
                        <motion.div
                          key={index}
                          className={`px-3 py-2 flex items-center justify-center rounded-lg text-xl font-bold
                            ${index === currentLetterIndex ? 'bg-yellow-200 border-2 border-yellow-400' : 
                            index < currentLetterIndex ? 'bg-green-200' : 'bg-gray-200'}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          style={getFontStyle()}
                        >
                          {phoneme}
                        </motion.div>
                      ))
                    ) : (
                      // Individual letters
                      currentWord.split('').map((letter, index) => (
                        <motion.div
                          key={index}
                          className="relative"
                        >
                          <motion.div
                            className={`w-12 h-12 flex items-center justify-center rounded-lg text-xl font-bold
                              ${index === currentLetterIndex ? 'bg-yellow-200' : 
                              index < currentLetterIndex ? 'bg-green-200' : 'bg-gray-200'}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            style={getFontStyle()}
                          >
                            {letter}
                          </motion.div>
                          {index === currentLetterIndex && (
                            <motion.button
                              className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                                         bg-purple-600 text-white p-2 rounded-full shadow-lg"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setShowHandSignal(letter)}
                            >
                              <Hand className="w-4 h-4" />
                            </motion.button>
                          )}
                        </motion.div>
                      ))
                    )}
                  </motion.div>

                  {/* Move the rhyme section to only show on success */}
                  {gameState === 'success' && rhyme && (
                    <motion.div
                      className="mt-6 p-4 bg-purple-100 rounded-lg shadow-md border-2 border-purple-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="text-center text-purple-800 whitespace-pre-line font-medium" style={getFontStyle()}>
                        {formatRhyme(rhyme)}
                      </div>
                    </motion.div>
                  )}

                  {storyImage && (
                    <motion.div
                      className="w-full space-y-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.5 }}
                    >
                      <img 
                        src={storyImage} 
                        alt="Story Illustration" 
                        className="rounded-lg shadow-lg max-w-full h-auto mx-auto"
                        style={{ maxHeight: '300px', objectFit: 'contain' }}
                      />
                    </motion.div>
                  )}

                  {errorMessage && (
                    <div className="text-red-500 text-center" style={getFontStyle()}>
                      {errorMessage}
                    </div>
                  )}

                  {showMic && (
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <motion.button
                        onClick={startRecording}
                        disabled={isRecording}
                        className={`w-full py-4 rounded-lg flex items-center justify-center gap-2
                          ${isRecording ? 'bg-red-500' : 'bg-purple-600'} text-white`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={getFontStyle()}
                      >
                        <Mic className={`w-6 h-6 ${isRecording ? 'animate-pulse' : ''}`} />
                        {isRecording 
                          ? (selectedLanguage === 'spanish' ? 'Escuchando...' : 'Listening...') 
                          : (selectedLanguage === 'spanish' ? 'Haz clic para hablar' : 'Click to Speak')}
                      </motion.button>

                      <motion.div className="flex justify-center gap-4 flex-wrap mt-6">
                        <motion.button
                          onClick={skipLetter}
                          className="flex-1 py-2 px-4 bg-orange-500 text-white rounded-lg flex items-center justify-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          style={getFontStyle()}
                        >
                          <SkipForward className="w-4 h-4" />
                          {showPhonetic
                            ? (selectedLanguage === 'spanish' ? 'Saltar Sonido' : 'Skip Sound')
                            : (selectedLanguage === 'spanish' ? 'Saltar Letra' : 'Skip Letter')}
                        </motion.button>

                        <motion.button
                          onClick={skipWord}
                          className="flex-1 py-2 px-4 bg-orange-500 text-white rounded-lg flex items-center justify-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          style={getFontStyle()}
                        >
                          <FastForward className="w-4 h-4" />
                          {selectedLanguage === 'spanish' ? 'Saltar Palabra' : 'Skip Word'}
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        >
          <Stars className="w-4 h-4 text-yellow-400" />
        </motion.div>
      ))}

      {isGameStarted && <StatsBoard />}

      <AnimatePresence>
        {showHandSignal && (
          <HandSignalModal 
            letter={showHandSignal} 
            onClose={() => setShowHandSignal(false)} 
          />
        )}
      </AnimatePresence>
      
      <></>
    </div>
  );
};

export default LearningUI;
