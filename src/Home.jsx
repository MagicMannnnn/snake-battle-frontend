/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import Settings from './Settings';
import HumanGame from './HumanGame';
import AIGame from './AIGame';
import Stats from './Stats';
import { UploadHandler } from './uploadHandler';

function speedToInterval(speed) {
  if (speed == 120){
    return 1;
  }
  const minInterval = 50;
  const maxInterval = 400;
  const t = (speed - 1) / 119;
  return Math.round(minInterval * Math.pow(maxInterval / minInterval, 1 - t));
}

function Home() {
  const width = 20;
  const height = 20; 

  const [roundness, setRoundness] = useState(localStorage.getItem("roundness") ?? 15);
  const [speed, setSpeed] = useState(localStorage.getItem("speed") ?? 35);
  const [AIspeed, AIsetSpeed] = useState(localStorage.getItem("AIspeed") ?? 35);
  const [restart, setRestart] = useState(false);

  const [username, setUsername] = useState(localStorage.getItem("username") ?? "");
  const [score, setScore] = useState(0);
  const [highscore, setHighscore] = useState(localStorage.getItem("highscore") ?? 0);
  const [alive, setAlive] = useState(false);

  const [AIscore, AIsetScore] = useState(0);
  const [AIhighscore, AIsetHighscore] = useState(localStorage.getItem("AIhighscore") ?? 0);
  const [AIalive, AIsetAlive] = useState(false);
  const [autoRestart, setAutoRestart] = useState(localStorage.getItem("autoRestart") === "true");

  const [shouldUploadScores, setShouldUploadScores] = useState(localStorage.getItem("shouldUploadScores") === "true");
  const [AIshouldUploadScores, AIsetShouldUploadScores] = useState(localStorage.getItem("AIshouldUploadScores") === "true");
  const [uploadedPreviousScore, setUploadedPreviousScore] = useState(false);
  const [uploadedPreviousAIScore, setUploadedPreviousAIScore] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);



  //handle uploading scores
  useEffect(() => {
    if (loggedIn && !alive && shouldUploadScores && !uploadedPreviousScore && score > 0){ //just died
      UploadHandler.uploadScore(score, username.trim(""));
      setUploadedPreviousScore(true);
    }else if (alive) {
      setUploadedPreviousScore(false);
    }
  }, [alive, shouldUploadScores, loggedIn])
  useEffect(() => {
    if (loggedIn && !AIalive && AIshouldUploadScores && !uploadedPreviousAIScore && AIscore > 0){ //just died
      UploadHandler.uploadScore(AIscore, "AI " + username.trim(""));
      setUploadedPreviousAIScore(true);
    }else if (AIalive) {
      setUploadedPreviousAIScore(false);
    }
  }, [AIalive, AIshouldUploadScores, loggedIn])


  //handle restarts
  function handleBattleClick() {
    setRestart(true);
  }

  useEffect(() => {
    setRestart(false);
  }, [restart])


  //update storage items
  useEffect(() => {
    localStorage.setItem("autoRestart", autoRestart);
  }, [autoRestart])
  useEffect(() => {
    localStorage.setItem("speed", speed);
  }, [speed])
  useEffect(() => {
    localStorage.setItem("AIspeed", AIspeed);
  }, [AIspeed])
  useEffect(() => {
    localStorage.setItem("roundness", roundness);
  }, [roundness])
  useEffect(() => {
    localStorage.setItem("shouldUploadScores", shouldUploadScores);
  }, [shouldUploadScores])
  useEffect(() => {
    localStorage.setItem("AIshouldUploadScores", AIshouldUploadScores);
  }, [AIshouldUploadScores])


  const navigate = useNavigate()


  const gotToLeaderboard = () => {
    navigate('/leaderboard')  // Navigate on button click
  }


  return (
    <>
    <div className='header-container'>
      <h3><button className='leaderboard-button' onClick={gotToLeaderboard}>Leaderboard</button></h3>
      <h1>Snake <button className="battle-button" onClick={handleBattleClick}>Battle</button></h1>
    </div>
      <div className='container'>
        <Settings roundness={roundness} setRoundness={setRoundness} speed={speed} setSpeed={setSpeed} AIspeed={AIspeed} AIsetSpeed={AIsetSpeed} autoRestart={autoRestart} setAutoRestart={setAutoRestart} shouldUploadScores={shouldUploadScores} setShouldUploadScores={setShouldUploadScores} AIshouldUploadScores={AIshouldUploadScores} AIsetShouldUploadScores={AIsetShouldUploadScores} username={username} setUsername={setUsername} highscore={highscore} AIhighscore={AIhighscore} setHighscore={setHighscore} setLoggedIn={setLoggedIn} AIsetHighscore={AIsetHighscore}/>
        <HumanGame restart={restart} width={width} height={height} roundness={roundness} scoreHook={[score, setScore]} highscoreHook={[highscore, setHighscore]} aliveHook={[alive, setAlive]} speed={speedToInterval(speed)}/>
        <AIGame restart={restart} width={width} height={height} roundness={roundness} scoreHook={[AIscore, AIsetScore]} highscoreHook={[AIhighscore, AIsetHighscore]} aliveHook={[AIalive, AIsetAlive]} speed={speedToInterval(AIspeed)} autoRestart={autoRestart}/>
        <Stats score={score} AIscore={AIscore} alive={alive} AIalive={AIalive}/>
      </div>
    </>
  )
}

export default Home;
