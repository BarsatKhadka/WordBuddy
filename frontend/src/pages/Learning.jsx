import { useState, useRef, useEffect } from 'react';

function Learning() {
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [currentWord, setCurrentWord] = useState('');
    const [translation, setTranslation] = useState('');
    const [greeting, setGreeting] = useState('');
    const [phoneticBreakdown, setPhoneticBreakdown] = useState([]);
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [gameState, setGameState] = useState('initial');
    const [rhyme, setRhyme] = useState('');
    const [loadingState, setLoadingState] = useState(false);
    const [failedFirstAttempt, setFailedFirstAttempt] = useState(false);
    const [showPhonetic, setShowPhonetic] = useState(false);
    const [showMic, setShowMic] = useState(false);
    const isFirstWord = useRef(true);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const [selectedLanguage, setSelectedLanguage] = useState('english');
    const [nativeLanguage, setNativeLanguage] = useState(null);
    

    // api endpoints sends a json with greeting, word, it's spanish translation, rhyme and phonetics
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
          
          setLoadingState(false);
    
          await speakText(data.greeting);
          
          const translationMessage = selectedLanguage === 'spanish' 
            ? `The word "${data.word}" means "${data.translation}" in English.`
            : `La palabra "${data.word}" significa "${data.translation}" en español.`;
          
          setTimeout(async () => {
            await speakText(translationMessage);
          }, 1500);
    
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

      // convert text into speech
      const speakText = async (text) => {
        try {
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
            })
          });
    
          if (!response.ok) {
            throw new Error('Failed to get audio response');
          }
    
          const audioBlob = await response.blob();
          const audio = new Audio(URL.createObjectURL(audioBlob));
          await audio.play();
          setErrorMessage(''); // Clear any existing error message
        } catch (error) {
          console.error('Error with text-to-speech:', error);
          setErrorMessage('Error with text-to-speech. Please try again.');
        }
      };

// takes the audio and changes it into text
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

  // Records the audio from user in web
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

  // Starts the actual game
  const startGame = async () => {
    setIsGameStarted(true);
    await getNewWord();
  };

  // handling the speaking and validating logic
  const handleSpeechResult = (spokenText) => {
    if (gameState === 'spelling') {
      if (showPhonetic) {
        const currentPhoneme = phoneticBreakdown[currentLetterIndex];
        if (spokenText.includes(currentPhoneme)) {
          if (currentLetterIndex === phoneticBreakdown.length - 1) {
            setGameState('wholeWord');
            const successMsg = selectedLanguage === 'spanish' 
              ? `¡Perfecto!` 
              : `Perfect! Now say the whole word: ${currentWord}`;
            speakText(successMsg);
          } else {
            setCurrentLetterIndex(prev => prev + 1);
            const nextMsg = selectedLanguage === 'spanish' 
              ? `¡Perfecto!` 
              : `Perfect! Try pronouncing the next sound: ${phoneticBreakdown[currentLetterIndex + 1]}`;
            speakText(nextMsg);
          }
        } else {
          const tryAgainMsg = selectedLanguage === 'spanish' 
            ? `¡Inténtalo!` 
            : `Try again! Say the sound ${currentPhoneme}`;
          speakText(tryAgainMsg);
        }
      } else {
        const currentLetter = currentWord[currentLetterIndex];
        if (spokenText.includes(currentLetter)) {
          if (currentLetterIndex === currentWord.length - 1) {
            setGameState('wholeWord');
            const successMsg = selectedLanguage === 'spanish' 
              ? `¡Perfecto!` 
              : `Perfect! Now say the whole word: ${currentWord}`;
            speakText(successMsg);
          } else {
            setCurrentLetterIndex(prev => prev + 1);
            const nextMsg = selectedLanguage === 'spanish' 
              ? `¡Perfecto!` 
              : `Perfect! Try pronouncing the next letter: ${currentWord[currentLetterIndex + 1]}`;
            speakText(nextMsg);
          }
        } else {
          const tryAgainMsg = selectedLanguage === 'spanish' 
            ? `¡Inténtalo!` 
            : `Try again! Say the letter ${currentLetter}`;
          speakText(tryAgainMsg);
        }
      }
    } else if (gameState === 'wholeWord') {
      if (spokenText.includes(currentWord)) {
        setGameState('success');
        
        // First congratulate
        const congratsMsg = selectedLanguage === 'spanish' 
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
          
          const phoneticGuideMsg = selectedLanguage === 'spanish'
            ? `Intentemos con los sonidos. Pronuncia este sonido: ${phoneticBreakdown[0]}`
            : `Let's try breaking it down by sounds. Say this sound: ${phoneticBreakdown[0]}`;
          speakText(phoneticGuideMsg);
        } else {
          // Second or later failure
          const tryAgainWordMsg = selectedLanguage === 'spanish' 
            ? `Inténtalo de nuevo. Di la palabra ${currentWord}` 
            : `Try again! Say the word ${currentWord}`;
          speakText(tryAgainWordMsg);
        }
      }
    }
  };

    return(
    <div>
        Learning page, coming soon....
    </div>
    )   
}
export default Learning;