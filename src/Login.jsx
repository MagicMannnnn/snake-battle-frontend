import { useState } from 'react';
import { UploadHandler } from './uploadHandler';
import './App.css';
import bycrpt from "bcryptjs";

// Ignoring if username exists at the moment

function Login({
  setUsername, loggedIn, setLoggedIn, highscore, AIhighscore, setHighscore, AIsetHighscore
}) {

    const [printingUsername, setPrintingUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(localStorage.getItem("message") ?? "Login/Singup to upload scores");



  async function Login() {
    const hashedPasswordForUser = await UploadHandler.getHashedPassword(printingUsername);
    var isMatch;
    if (typeof hashedPasswordForUser != "string"){
        isMatch = false;
    }else{
        isMatch = await bycrpt.compare(password, hashedPasswordForUser);
    } 
    setPassword("");
    if (isMatch) {
        setUsername(printingUsername);
        localStorage.setItem("username", printingUsername);
        setMessage("Login Successful");
        localStorage.setItem("message", "Login Successful");

        const score = await UploadHandler.getScoreFromUsername(printingUsername);

        if (score > highscore || loggedIn){
            setHighscore(score);
            localStorage.setItem("highscore", score);
        }

        const AIscore = await UploadHandler.getScoreFromUsername("AI " + printingUsername);

        if (AIscore > AIhighscore || loggedIn){
            AIsetHighscore(AIscore);
            localStorage.setItem("AIhighscore", AIscore);
        }

        setPrintingUsername("");
        setLoggedIn(true);

    }else {
        setLoggedIn(false);
        setUsername("");
        localStorage.setItem("username", "");
        setMessage("Invalid username or password");
        localStorage.setItem("message", "Login/Singup to upload scores");
        AIsetHighscore(0);
        localStorage.setItem("AIhighscore", 0);
        setHighscore(0);
        localStorage.setItem("highscore", 0);
    }
  }

  async function Signup() {
    if (loggedIn){
        await Login();
    }
    setMessage("Must be at least 3 characters");
    if (printingUsername.trim("").length >= 3 && password.length >= 3){
        const hash = await bycrpt.hash(password, 10);
        const response = await UploadHandler.Signup(printingUsername, hash);
        console.log("response: ");
        if (response.ok) {
            setUsername(printingUsername);
            localStorage.setItem("username", printingUsername);
            setMessage("Signup Successful");
            localStorage.setItem("message", "Signup Successful");
            setPrintingUsername("");   
            setPassword("");
            setLoggedIn(true);
            return; 
        }
        else if (response.status == 409) {
            setMessage("Username already exists");
        }
        else if (response.status == 500) {
            setMessage("Internal Server Error");
        }

        
    }
    setLoggedIn(false);
    setUsername("");
    localStorage.setItem("username", "");
    localStorage.setItem("message", "Login/Singup to upload scores");
    AIsetHighscore(0);
    localStorage.setItem("AIhighscore", 0);
    setHighscore(0);
    localStorage.setItem("highscore", 0);
    setPassword("");
    
    

    


  }


  return (
    <div className='login-box'>
        <label id='username'>
          Username: 
          <input
            className='username'
            type="text"
            value={printingUsername}
            onChange={(e) => {setPrintingUsername(e.target.value.trim("").substring(0, 16)); }}
            autoComplete="username"
          />
        </label>

        <label id='password'>
          Password (not that secure):
          <input
            className='username'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        <h6 className='message'>{message}</h6>

        <h4>
          <button className='login-button' onClick={Login}>
            Login
          </button>
                &nbsp; &nbsp; &nbsp; &nbsp;
          <button className='login-button' onClick={Signup}>
            Signup
          </button>
        </h4>

      </div>

  );
}

export default Login;
