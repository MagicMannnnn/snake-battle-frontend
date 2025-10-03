/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react'
import './App.css'
import SnakeGame from './snakeGame'
import Board from './Board';

function AIGame({restart, width, height, roundness, scoreHook, highscoreHook, aliveHook, speed, autoRestart}) {

    const maxMovesWithoutGrowth = 500;

    const gameRef = useRef(null);
    const wsRef = useRef(null);
    const aliveRef = useRef(false);
    const scoreRef = useRef(0);
    const lastateRef = useRef(0);
    const autoRestartRef = useRef(autoRestart);
    const snakeRef = useRef([[]]);
    const waitingRestartRef = useRef(false);

    const [snake, setSnake] = useState([[]]);
    const [apple, setApple] = useState([-1, -1]);
    const [score, setScore] = scoreHook;
    const [highscore, setHighscore] = highscoreHook;
    const setAlive = aliveHook[1];
    const [lastAte, setLastAte] = useState(0);

    aliveRef.current = aliveHook[0];
    scoreRef.current = score;
    lastateRef.current = lastAte;





    function connect(){
        const ws = new WebSocket("ws://localhost:5000/ws/");
        wsRef.current = ws;

        ws.onmessage = (event) => {
            if (aliveRef.current){
                const data = JSON.parse(event.data);

                if (data.snake.length > snakeRef.current.length) {
                    setLastAte(0);
                }

                setSnake(data.snake.map((seg) => [seg.x, seg.y]));
                setApple([data.apple.x, data.apple.y]);
                setScore(data.score);
                setAlive(!data.gameOver);
                
                if (data.score > highscore) {
                    localStorage.setItem("AIhighscore", data.score);
                    setHighscore(data.score);
                }
                
            }
            
        }
        
    }

    useEffect(() => {
        while (!wsRef.current){
            connect();
        }
        
    }, []);


    useEffect(() => {
        scoreRef.current = score;
    }, [score]);
    useEffect(() => {
        lastateRef.current = lastAte;
    }, [lastAte]);
    useEffect(() => {
        autoRestartRef.current = autoRestart;
    }, [autoRestart]);
    useEffect(() => {
        snakeRef.current = snake;
    }, [snake]);


    function restartFunction(){

        if (!waitingRestartRef.current){
            waitingRestartRef.current = true;
            setTimeout(() => {
                if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                    setAlive(true);
                    console.log("restarting");
                    gameRef.current.reset();          
                    wsRef.current.send("restart");
                }else{
                    connect();
                }
                setLastAte(0);
                waitingRestartRef.current = false;

            }, 1000);
        }   
    }




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
            if (!aliveRef.current) {
                if (autoRestartRef.current){
                    restartFunction();
                }
                return;
            } 
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN){
                setLastAte(e => e + 1);
                wsRef.current.send("getdata");
                if (lastateRef.current > maxMovesWithoutGrowth && aliveRef.current) {
                    setAlive(false);
                }
            }
            

        }, speed);

        return () => clearInterval(intervalID);

    }, [speed])

    //restart
    useEffect(() => {
        if (restart) {
           restartFunction();
        }

    }, [restart])


    return (
        <>
            <Board width={width} height={height} roundness={roundness} apple={apple} snake={snake} score={score} highscore={highscore} ai={true}/>
        </>
        
    )
}

export default AIGame;