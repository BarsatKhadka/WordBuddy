import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Learning from './pages/Learning';
import Homepage from './pages/Hompage';

function App() {

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
