import { useState } from 'react';

export const useLanguageSettings = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [nativeLanguage, setNativeLanguage] = useState(null);
  const [languageSelectionStep, setLanguageSelectionStep] = useState(1);

  const handleNativeLanguageSelect = (language) => {
    setNativeLanguage(language);
    const targetLanguage = language === 'english' ? 'spanish' : 'english';
    setSelectedLanguage(targetLanguage);
    setLanguageSelectionStep(3);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  return {
    selectedLanguage,
    nativeLanguage,
    languageSelectionStep,
    handleNativeLanguageSelect,
    handleLanguageChange,
  };
};

export const speakText = async (text) => {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = resolve;
    speechSynthesis.speak(utterance);
  });
};

export const processAudio = async (audioBlob, selectedLanguage) => {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'audio.wav');
  formData.append('language', selectedLanguage);

  const response = await fetch('http://localhost:5000/api/process-speech', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) throw new Error('Failed to transcribe audio');
  return await response.json();
}; 