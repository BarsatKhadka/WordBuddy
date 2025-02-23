import { useState, useRef, useEffect } from 'react';
import LearningUI from './LearningUI';

function Learning() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [greeting, setGreeting] = useState('');
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [gameState, setGameState] = useState('initial');
  const [loadingState, setLoadingState] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showMic, setShowMic] = useState(false);
  const [storyImage, setStoryImage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [nativeLanguage, setNativeLanguage] = useState(null); // New state
  const [languageSelectionStep, setLanguageSelectionStep] = useState(1); // New state
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const isFirstWord = useRef(true);
  const [dyslexicMode, setDyslexicMode] = useState(false);
  const [phoneticBreakdown, setPhoneticBreakdown] = useState([]);
  const [showPhonetic, setShowPhonetic] = useState(false);
  const [failedFirstAttempt, setFailedFirstAttempt] = useState(false);
  const [translation, setTranslation] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(true);
  
  const [stats, setStats] = useState(() => {
    const savedStats = localStorage.getItem('wordMagicStats');
    return savedStats ? JSON.parse(savedStats) : {
      wordsCompleted: 0,
      level: 1,
      xp: 0,
      streak: 0,
      lastPlayDate: null
    };
  });
  const [rhyme, setRhyme] = useState('');
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('wordMagicSettings');
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          setDyslexicMode(parsedSettings.dyslexicMode || false);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    if (dyslexicMode) {
      document.documentElement.style.fontFamily = "'OpenDyslexic', sans-serif";
    } else {
      document.documentElement.style.fontFamily = '';
    }
  }, [dyslexicMode]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const dyslexicParam = queryParams.get('dyslexic');
    if (dyslexicParam === 'true') {
      setDyslexicMode(true);
    }
  }, []);

  const getFontStyle = () => {
    return dyslexicMode ? 
      { fontFamily: "'OpenDyslexic', sans-serif" } : 
      { fontFamily: "'Fredoka', sans-serif" };
  };

  const getNewWord = async () => {
    setLoadingState(true);
    try {
      const response = await fetch('http://localhost:5000/api/get-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          teachingLanguage: nativeLanguage,
          learningLanguage: selectedLanguage,
          isFirstWord: isFirstWord.current
        })
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();
 

      setCurrentWord(data.word.toLowerCase());
      setTranslation(data.translation);
      setGreeting(data.greeting);
      setPhoneticBreakdown(data.phonetics ? data.phonetics.split('-') : data.word.split(''));
      setCurrentLetterIndex(0);
      setGameState('spelling');
      setShowMic(true);
      setShowPhonetic(false);
      setFailedFirstAttempt(false);
      isFirstWord.current = false;
      setRhyme(data.rhyme);
      generateImage(data.image);
      
      setLoadingState(false);

      await speakText(data.greeting);
      
      if (nativeLanguage !== selectedLanguage) {
        const translationMessage = selectedLanguage === 'spanish' 
          ? `The word "${data.word}" means "${data.translation}" in English.`
          : `La palabra "${data.word}" significa "${data.translation}" en español.`;
        
        setTimeout(async () => {
          await speakText(translationMessage);
        }, 1500);
      }

    } catch (error) {
      console.error('Error in getNewWord:', error);
      const errorMsg = nativeLanguage === 'spanish' 
        ? 'Lo siento, hubo un error al obtener una nueva palabra. Por favor, inténtalo de nuevo.' 
        : 'Sorry, there was an error getting a new word. Please try again.';
      setGreeting(errorMsg);
      setRhyme('');
      setLoadingState(false);
    }
  };

  const handleSpeechResult = (spokenText) => {
    if (gameState === 'spelling') {
      if (showPhonetic) {
        const currentPhoneme = phoneticBreakdown[currentLetterIndex];
        if (spokenText.includes(currentPhoneme)) {
          if (currentLetterIndex === phoneticBreakdown.length - 1) {
            setGameState('wholeWord');
            const successMsg = (selectedLanguage === 'spanish' && nativeLanguage === 'spanish') 
              ? `¡Perfecto!` 
              : `Perfect! Now say the whole word: ${currentWord}`;
            speakText(successMsg);
          } else {
            setCurrentLetterIndex(prev => prev + 1);
            const nextMsg = (selectedLanguage === 'spanish' && nativeLanguage === 'spanish')
              ? `¡Perfecto!` 
              : `Perfect! Try pronouncing the next sound: ${phoneticBreakdown[currentLetterIndex + 1]}`;
            speakText(nextMsg);
          }
        } else {
          const tryAgainMsg = (selectedLanguage === 'spanish' && nativeLanguage === 'spanish')
            ? `¡Inténtalo!` 
            : `Try again! Say the sound ${currentPhoneme}`;
          speakText(tryAgainMsg);
        }
      } else {
        const currentLetter = currentWord[currentLetterIndex];
        if (spokenText.includes(currentLetter)) {
          if (currentLetterIndex === currentWord.length - 1) {
            setGameState('wholeWord');
            const successMsg = (selectedLanguage === 'spanish' && nativeLanguage === 'spanish')
              ? `¡Perfecto!` 
              : `Perfect! Now say the whole word: ${currentWord}`;
            speakText(successMsg);
          } else {
            setCurrentLetterIndex(prev => prev + 1);
            const nextMsg = (selectedLanguage === 'spanish' && nativeLanguage === 'spanish') 
              ? `¡Perfecto!` 
              : `Perfect! Try pronouncing the next letter: ${currentWord[currentLetterIndex + 1]}`;
            speakText(nextMsg);
          }
        } else {
          const tryAgainMsg = (selectedLanguage === 'spanish' && nativeLanguage === 'spanish') 
            ? `¡Inténtalo!` 
            : `Try again! Say the letter ${currentLetter}`;
          speakText(tryAgainMsg);
        }
      }
    } else if (gameState === 'wholeWord') {
      if (spokenText.includes(currentWord)) {
        setGameState('success');
        
        // First congratulate
        const congratsMsg = (selectedLanguage === 'spanish' && nativeLanguage === 'spanish') 
          ? `¡Excelente! Has deletreado y dicho ${currentWord} correctamente.` 
          : `Excellent! You've spelled and said ${currentWord} correctly!`;
        
        // Speak congratulation and then the rhyme
        speakText(congratsMsg).then(() => {
          setTimeout(() => {
            // Speak the rhyme after showing success message
            speakText(rhyme).then(() => {
              // After rhyme is spoken, get new word
              setTimeout(getNewWord, 2000);
            });
          }, 1500);
        });
      } else {
        if (!failedFirstAttempt) {
          // First failed attempt at whole word - switch to phonetic mode
          setFailedFirstAttempt(true);
          setShowPhonetic(true);
          setCurrentLetterIndex(0);
          setGameState('spelling');
          
          const phoneticGuideMsg = (selectedLanguage === 'spanish' && nativeLanguage === 'spanish')
            ? `Intentemos con los sonidos. Pronuncia este sonido: ${phoneticBreakdown[0]}`
            : `Let's try breaking it down by sounds. Say this sound: ${phoneticBreakdown[0]}`;
          speakText(phoneticGuideMsg);
        } else {
          // Second or later failure
          const tryAgainWordMsg = (selectedLanguage === 'spanish' && nativeLanguage === 'spanish') 
            ? `Inténtalo de nuevo. Di la palabra ${currentWord}` 
            : `Try again! Say the word ${currentWord}`;
          speakText(tryAgainWordMsg);
        }
      }
    }
  };

  const startGame = async () => {
    setIsGameStarted(true);
    await getNewWord();
  };

  const skipLetter = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (showPhonetic) {
      // If we're in phonetic mode
      if (currentLetterIndex === phoneticBreakdown.length - 1) {
        setGameState('wholeWord');
        const promptText = nativeLanguage === 'spanish' 
          ? `Ahora di la palabra completa: ${currentWord}` 
          : `Now say the whole word: ${currentWord}`;
        speakText(promptText);
      } else {
        setCurrentLetterIndex(prev => prev + 1);
        const promptText = nativeLanguage === 'spanish' 
          ? `Pasando al siguiente sonido: ${phoneticBreakdown[currentLetterIndex + 1]}` 
          : `Moving to the next sound: ${phoneticBreakdown[currentLetterIndex + 1]}`;
        speakText(promptText);
      }
    } else {
      // Regular letter mode
      if (currentLetterIndex === currentWord.length - 1) {
        setGameState('wholeWord');
        const promptText = nativeLanguage === 'spanish' 
          ? `Ahora di la palabra completa: ${currentWord}` 
          : `Now say the whole word: ${currentWord}`;
        speakText(promptText);
      } else {
        setCurrentLetterIndex(prev => prev + 1);
        const promptText = nativeLanguage === 'spanish' 
          ? `Pasando a la siguiente letra: ${currentWord[currentLetterIndex + 1]}` 
          : `Moving to the next letter: ${currentWord[currentLetterIndex + 1]}`;
        speakText(promptText);
      }
    }
  };

  const skipWord = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const skipText = nativeLanguage === 'spanish' 
      ? "Vamos a intentar con una palabra diferente." 
      : "Let's try a different word.";
    speakText(skipText);
    setTimeout(getNewWord, 1500);
  };

  const handleNativeLanguageSelect = (language) => {
    setNativeLanguage(language);
    // Automatically set the target language as the opposite of native language
    const targetLanguage = language === 'english' ? 'spanish' : 'english';
    setSelectedLanguage(targetLanguage);
    setLanguageSelectionStep(3); // Skip step 2 and go directly to step 3
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    isFirstWord.current = true;
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setErrorMessage('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
          stream.getTracks().forEach(track => track.stop());
        }
      }, 2000);
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
      const errorMsg = nativeLanguage === 'spanish' 
        ? 'Error al acceder al micrófono. Por favor, verifica los permisos.' 
        : 'Error accessing microphone. Please check permissions.';
      setErrorMessage(errorMsg);
    }
  };

  const speakText = async (text) => {
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      const useSpanishVoice = 
        (text === currentWord && selectedLanguage === 'spanish') ||
        text === '¡Perfecto!' ||
        text.startsWith('¡') ||
        /[áéíóúñ¿]/i.test(text) ||
        (text.includes(currentWord) && selectedLanguage === 'spanish');

      const response = await fetch('http://localhost:5000/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          useSpanishVoice
        }),
        signal
      });

      if (!response.ok) {
        throw new Error('Failed to get audio response');
      }

      const audioBlob = await response.blob();
      const audio = new Audio(URL.createObjectURL(audioBlob));
      await audio.play();
      setErrorMessage(''); // Clear any existing error message
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error with text-to-speech:', error);
        setErrorMessage('Error with text-to-speech. Please try again.');
      }
    }
  };

  const processAudio = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.wav');
      formData.append('language', selectedLanguage);

      const response = await fetch('http://localhost:5000/api/process-speech', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to transcribe audio');
      const data = await response.json();
      handleSpeechResult(data.text.toLowerCase());
    } catch (error) {
      console.error('Error processing audio:', error);
      const errorMsg = nativeLanguage === 'spanish' 
        ? 'Error al procesar el habla. Por favor, inténtalo de nuevo.' 
        : 'Error processing speech. Please try again.';
      setErrorMessage(errorMsg);
    } finally {
      setIsRecording(false);
    }
  };

  const generateImage = async (story) => {
    try {
      setIsImageLoading(true);
      console.log(story);
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: `Create a child-friendly, colorful illustration of: ${story}. Make it whimsical and appropriate for young children, using bright colors and a storybook style.`,
          n: 1,
          size: "1024x1024"
        })
      });
  
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
  
      const data = await response.json();
      setStoryImage(data.data[0].url);
    } catch (error) {
      console.error('Error generating image:', error);
      setErrorMessage('Error generating story image.');
      setIsImageLoading(false);
    }
  };


  return (
    <LearningUI
      isGameStarted={isGameStarted}
      currentWord={currentWord}
      greeting={greeting}
      currentLetterIndex={currentLetterIndex}
      isRecording={isRecording}
      gameState={gameState}
      loadingState={loadingState}
      errorMessage={errorMessage}
      showMic={showMic}
      storyImage={storyImage}
      selectedLanguage={selectedLanguage}
      dyslexicMode={dyslexicMode}
      getFontStyle={getFontStyle}
      startGame={startGame}
      handleLanguageChange={handleLanguageChange}
      startRecording={startRecording}
      skipLetter={skipLetter}
      skipWord={skipWord}
      showPhonetic={showPhonetic}
      phoneticBreakdown={phoneticBreakdown}
      languageSelectionStep={languageSelectionStep}
      handleNativeLanguageSelect={handleNativeLanguageSelect}
      nativeLanguage={nativeLanguage}
      translation={translation}
      stats={stats}
      rhyme={rhyme}
      isImageLoading={isImageLoading}
    />
  );
}

export default Learning;
