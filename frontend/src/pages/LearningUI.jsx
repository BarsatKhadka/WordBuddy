
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
  };

}