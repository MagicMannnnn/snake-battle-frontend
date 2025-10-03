/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react'
import './App.css'
import SnakeGame from './snakeGame'
import Board from './Board';

function HumanGame({restart, width, height, roundness, scoreHook, highscoreHook, aliveHook, speed}) {

    const gameRef = useRef(null);
    const waitingRestartRef = useRef(false);

    const [snake, setSnake] = useState([[]]);
    const [apple, setApple] = useState([-1, -1]);
    const [score, setScore] = scoreHook;
    const [highscore, setHighscore] = highscoreHook;
    const setAlive = aliveHook[1];

    //user input
    useEffect(() => {
    const handleKey = (e) => {
      if (!gameRef.current) return;
      switch (e.code) {
        case "KeyW":
        case "ArrowUp": gameRef.current.setDirection(0, -1); break;
        case "KeyS":
        case "ArrowDown": gameRef.current.setDirection(0, 1); break;
        case "KeyA":
        case "ArrowLeft": gameRef.current.setDirection(-1, 0); break;
        case "KeyD":
        case "ArrowRight": gameRef.current.setDirection(1, 0); break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    }, []);


    //game
    useEffect(() => {
        if (!gameRef.current){
            const game = new SnakeGame(width, height);
            gameRef.current = game;
            setSnake([...game.snake]);
            setApple([...game.food]);
            setAlive(game.alive);
        }
        

        const intervalID = setInterval(() => {
            let length = gameRef.current.snake.length;
            gameRef.current.step();
            setSnake([...gameRef.current.snake]);
            setApple([...gameRef.current.food]);

            if (gameRef.current.snake.length > length) {
            const newScore = Math.max(0, gameRef.current.snake.length - 3);
            setScore(newScore);
            if (newScore > highscore) {
                localStorage.setItem("highscore", newScore);
                setHighscore(newScore);
            }
            }

            setAlive(gameRef.current.alive);
        }, speed);  // speed is the delay in ms

        return () => clearInterval(intervalID);
    }, [speed]);


    //restart
    useEffect(() => {
        if (restart && !waitingRestartRef.current) {
            waitingRestartRef.current = true;

            setTimeout(() => {
                gameRef.current.reset();
                waitingRestartRef.current = false;
            }, 1000);

            
        }

    }, [restart])


    return (
        <>
            <Board width={width} height={height} roundness={roundness} apple={apple} snake={snake} score={score} highscore={highscore}/>
        </>
        
    )
}

export default HumanGame;