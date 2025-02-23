
//this gets new words from OpenAI API
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
      
      handleWordResponse(data);
    } catch (error) {
      handleError(error);
    }
  };

//this process the audio of the user and sends it to api/process-speech
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
      handleError(error);
    }
  };

  //user's voice to text
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

      if (!response.ok) throw new Error('Failed to get audio response');
      const audioBlob = await response.blob();
      const audio = new Audio(URL.createObjectURL(audioBlob));
      await audio.play();
    } catch (error) {
      handleError(error);
    }
  };

  // to update the stats/level of user 
  const updateStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/update-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: 'user123', // You'll need to implement proper user identification
          ...stats,
          wordsCompleted: stats.wordsCompleted + 1,
          xp: stats.xp + 10
        })
      });
  
      if (!response.ok) throw new Error('Failed to update stats');
      const updatedStats = await response.json();
      setStats(updatedStats);
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };