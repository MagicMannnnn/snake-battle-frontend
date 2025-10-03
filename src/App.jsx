import {  } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './Home';
import Leaderboard from './Leaderboard';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
    </Routes>
  )
}

export default App;
