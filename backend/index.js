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
app.get('/api/get-word', async (req, res) => {
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

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})