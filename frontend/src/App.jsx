import { useState, useEffect } from 'react'
import Learning from './pages/Learning';
import Homepage from './pages/Homepage';
import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './styles/global.css';

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('wordMagicSettings');
      if (savedSettings) {
        const { dyslexicMode } = JSON.parse(savedSettings);
        if (dyslexicMode) {
          document.documentElement.classList.add('dyslexic-font');
          document.documentElement.style.setProperty('font-family', "OpenDyslexic", "sans-serif", 'important');
        } else {
          document.documentElement.classList.remove('dyslexic-font');
          document.documentElement.style.removeProperty('font-family');
        }
      }
    } catch (error) {
      console.error('Error loading settings in App:', error);
    }
  }, []);

  return (
    <>
    <Router>
      <Routes>
        <Route index element={<Homepage />}/>
        <Route path = '/learn' element = {<Learning />} />

      </Routes>
    </Router>
    </>
  )
}

export default App
