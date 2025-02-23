import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import fileUpload from 'express-fileupload';
import fetch from 'node-fetch';
import teacherPrompt from './utils/teacherPrompt.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB is the limit of fize size 
}));

// Initializing OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Geting current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Here are the Routes
app.post('/api/get-word', async (req, res) => {
  try {
    const { teachingLanguage, learningLanguage, isFirstWord } = req.body;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: teacherPrompt + 
                  `\nTeaching Configuration:
                   - Create magical adventure stories in ${teachingLanguage}
                   - Teach ${learningLanguage} words through storytelling
                   - Include word translation in ${teachingLanguage}
                   - Choose ${learningLanguage} words appropriate for beginners
                   - Make learning feel like an exciting journey`
        },
        {
          role: "user",
          content: isFirstWord ? 
                  (teachingLanguage === 'spanish' ? 
                   `Comienza una aventura mágica y enseña una palabra en ${learningLanguage === 'spanish' ? 'español' : 'inglés'}. Incluye la traducción.` : 
                   `Start a magical adventure and teach a ${learningLanguage} word. Include the translation.`) : 
                  (teachingLanguage === 'spanish' ? 
                   `Continúa la aventura con una nueva palabra en ${learningLanguage === 'spanish' ? 'español' : 'inglés'}. Incluye la traducción.` : 
                   `Continue the adventure with a new ${learningLanguage} word. Include the translation.`)
        }
      ]
    });

    console.log("OpenAI Response:", response.choices[0].message.content);

    res.json(JSON.parse(response.choices[0].message.content));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate word' });
  }
});

app.post('/api/process-speech', async (req, res) => {
  try {
    if (!req.files || !req.files.audio) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const audioFile = req.files.audio;
    const language = req.body.language;

    // Create temporary file
    const tempFilePath = path.join(__dirname, 'temp.wav');
    await audioFile.mv(tempFilePath);

    // Create a File object from the temporary file
    const file = fs.createReadStream(tempFilePath);

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      language: language === 'spanish' ? 'es' : 'en'
    });

    // Clean up temp file
    fs.unlinkSync(tempFilePath);

    res.json({ text: transcription.text });
  } catch (error) {
    console.error('Error processing speech:', error);
    res.status(500).json({ error: 'Failed to process speech' });
  }
});

// This is the Elevenlabs Text-to-Speech API call
app.post('/api/text-to-speech', async (req, res) => {
  try {
    const { text, useSpanishVoice } = req.body;
    const voiceId = useSpanishVoice ? 'gbTn1bmCvNgk0QEAVyfM' : 'EXAVITQu4vr4xnSDxMaL';

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: { stability: 0.5, similarity_boost: 0.5 }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('ElevenLabs API error:', errorData);
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    res.set('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error('Error generating speech:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
});

app.post('/api/settings', (req, res) => {
  try {
    const { age, city } = req.body;
    
    teacherPrompt.updateSettings(age, city);
    
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});


app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})