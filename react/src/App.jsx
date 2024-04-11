
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import { AuthProvider } from './context/AuthContext.jsx'

import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LandingLogged from './pages/LandingLogged.jsx'

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/signup" element={<RegisterPage/>}/>
          <Route path="/logged" element={<LandingLogged/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
