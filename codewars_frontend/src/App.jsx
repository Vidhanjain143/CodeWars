import './App.css'
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import Home from './components/Home'
import Workspace from './components/Workspace/Workspace'
import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/workspace/:id' element={<Workspace/>}/>
      </Routes>
    </Router>
  )
}

export default App
