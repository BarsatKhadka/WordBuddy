
import { motion, AnimatePresence } from 'framer-motion';

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
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-sky-200 via-purple-100 to-pink-100 relative overflow-hidden p-8 ${dyslexicMode ? 'dyslexic-font' : ''}`}>
      <motion.div 
        className="absolute top-10 left-10"
        animate={{ x: [0, 20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Cloud className="w-16 h-16 text-white" />
      </motion.div>
      </div>
  )

}