import { useState, useRef, useEffect } from 'react';

function Learning() {

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
    const [selectedLanguage, setSelectedLanguage] = useState('english');
    const [nativeLanguage, setNativeLanguage] = useState(null);
    


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

    
    return(
    <div>
        learn page
    </div>
    )
    
}

export default Learning;