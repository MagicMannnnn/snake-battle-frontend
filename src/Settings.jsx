import {  } from 'react';
import { UploadHandler } from './uploadHandler';
import './App.css';
import Login from './Login';

// Ignoring if username exists at the moment

function Settings({
  roundness, setRoundness,
  speed, setSpeed,
  AIspeed, AIsetSpeed,
  autoRestart, setAutoRestart,
  shouldUploadScores, setShouldUploadScores,
  AIshouldUploadScores, AIsetShouldUploadScores,
  username, setUsername,
  highscore, AIhighscore,
  setHighscore, AIsetHighscore,
  loggedIn, setLoggedIn
}) {
  

  const updateRoundness = (event) => {
    setRoundness(Number(event.target.value));
  };

  const updateSpeed = (event) => {
    const newSpeed = Number(event.target.value);
    setSpeed(newSpeed);
    AIsetSpeed(newSpeed);
  };

  const AIupdateSpeed = (event) => {
    AIsetSpeed(Number(event.target.value));
  };



  return (
    <div className='sidebar'>
      <h2>Settings</h2>

      <h3>Username: {username}</h3>

      <div className='slider'>
        <label htmlFor="roundness">Roundness</label>
        <input
          type="range"
          id="roundness"
          min="0"
          max="50"
          value={roundness}
          onChange={updateRoundness}
        />
      </div>

      <div className='slider'>
        <label htmlFor="speed">Speed</label>
        <input
          type="range"
          id="speed"
          min="1"
          max="100"
          value={speed}
          onChange={updateSpeed}
        />
      </div>

      <div className='slider'>
        <label htmlFor="AIspeed">AI Speed</label>
        <input
          className='ai-speed'
          type="range"
          id="AIspeed"
          min="1"
          max="120"
          value={AIspeed}
          onChange={AIupdateSpeed}
        />
      </div>

      <h4>
        <button className='reset-button' onClick={() => setAutoRestart(!autoRestart)}>
          AI Auto Restart: <br />{autoRestart ? "✔" : "X"}
        </button>
      </h4>

      <h4>
        <button className='reset-button' onClick={() => setShouldUploadScores(!shouldUploadScores)}>
          Upload Score: <br />{shouldUploadScores ? "✔" : "X"}
        </button>
      </h4>

      <h4>
        <button className='reset-button' onClick={() => AIsetShouldUploadScores(!AIshouldUploadScores)}>
          AI Upload Score: <br />{AIshouldUploadScores ? "✔" : "X"}
        </button>
      </h4>


      <Login setUsername={setUsername} loggedIn={loggedIn} setLoggedIn={setLoggedIn} highscore={highscore} AIhighscore={AIhighscore} setHighscore={setHighscore} AIsetHighscore={AIsetHighscore}/>


    </div>
  );
}

export default Settings;
