
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