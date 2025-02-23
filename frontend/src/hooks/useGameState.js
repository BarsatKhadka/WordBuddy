import { useState, useRef } from 'react';

export const useGameState = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [greeting, setGreeting] = useState('');
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [gameState, setGameState] = useState('initial');
  const [loadingState, setLoadingState] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showMic, setShowMic] = useState(false);
  const [storyImage, setStoryImage] = useState('');
  const isFirstWord = useRef(true);
  const [phoneticBreakdown, setPhoneticBreakdown] = useState([]);
  const [showPhonetic, setShowPhonetic] = useState(false);
  const [failedFirstAttempt, setFailedFirstAttempt] = useState(false);
  const [translation, setTranslation] = useState('');
  const [rhyme, setRhyme] = useState('');

  return {
    isGameStarted,
    setIsGameStarted,
    currentWord,
    setCurrentWord,
    greeting,
    setGreeting,
    currentLetterIndex,
    setCurrentLetterIndex,
    gameState,
    setGameState,
    loadingState,
    setLoadingState,
    errorMessage,
    setErrorMessage,
    showMic,
    setShowMic,
    storyImage,
    setStoryImage,
    isFirstWord,
    phoneticBreakdown,
    setPhoneticBreakdown,
    showPhonetic,
    setShowPhonetic,
    failedFirstAttempt,
    setFailedFirstAttempt,
    translation,
    setTranslation,
    rhyme,
    setRhyme,
  };
}; 