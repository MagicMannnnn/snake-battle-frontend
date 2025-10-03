import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './Home';
import Leaderboard from './Leaderboard';

function App() {

  const [username, setUsername] = useState(localStorage.getItem("username") ?? "");

  return (
    <Routes>
      <Route path="/" element={<Home username={username} setUsername={setUsername}/>} />
      <Route path="/leaderboard" element={<Leaderboard username={username}/>} />
    </Routes>
  )
}

export default App;
