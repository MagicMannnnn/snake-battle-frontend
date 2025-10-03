/* eslint-disable no-constant-binary-expression */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import './App.css'

function Stats({score, AIscore, alive, AIalive}) {
    const [avgScore, setAvgScore] = useState(Number(localStorage.getItem("avgScore")) ?? 0);
    const [playCount, setPlayCount] = useState(Number(localStorage.getItem("playCount")) ?? 0);
    const [totalScore, setTotalScore] = useState(Number(localStorage.getItem("totalScore")) ?? 0);
    const [AIavgScore, AIsetAvgScore] = useState(Number(localStorage.getItem("AIavgScore")) ?? 0);
    const [AIplayCount, AIsetPlayCount] = useState(Number(localStorage.getItem("AIplayCount")) ?? 0);
    const [AItotalScore, AIsetTotalScore] = useState(Number(localStorage.getItem("AItotalScore")) ?? 0);

    // Sync avgScore
    useEffect(() => {
        localStorage.setItem("avgScore", avgScore);
    }, [avgScore]);

    // Sync playCount
    useEffect(() => {
        localStorage.setItem("playCount", playCount);
    }, [playCount]);

    // Sync totalScore
    useEffect(() => {
        localStorage.setItem("totalScore", totalScore);
    }, [totalScore]);

    // Sync AIavgScore
    useEffect(() => {
        localStorage.setItem("AIavgScore", AIavgScore);
    }, [AIavgScore]);

    // Sync AIplayCount
    useEffect(() => {
        localStorage.setItem("AIplayCount", AIplayCount);
    }, [AIplayCount]);

    // Sync AItotalScore
    useEffect(() => {
        localStorage.setItem("AItotalScore", AItotalScore);
    }, [AItotalScore]);


    useEffect(() => {
        if (!alive && score > 0) {
            setPlayCount(() => playCount + 1);
        }
        else if (score > 0){
            setTotalScore(() => totalScore + 1);
            setAvgScore(totalScore / (playCount == 0 ? 1 : playCount));
        }

    }, [score, alive]);

    useEffect(() => {
        if (!AIalive && AIscore > 0) {
            AIsetPlayCount(() => AIplayCount + 1);
        }
        else if (AIscore > 0){
            AIsetTotalScore(() => AItotalScore + 1);
            AIsetAvgScore(AItotalScore / (AIplayCount == 0 ? 1 : AIplayCount));
        }

    }, [AIscore, AIalive]);

    
    function reset(){
        setAvgScore(0);
        setPlayCount(0);
        setTotalScore(0);
        AIsetAvgScore(0);
        AIsetPlayCount(0);
        AIsetTotalScore(0);
    }


    return (
        <div className='sidebar'>
            <h2>Stats</h2>  
            <h3><button className='reset-button' onClick={reset}>Reset</button></h3>
            <h4>Average Score: {Math.round(avgScore * 10) / 10}</h4>
            <h4>AI Average Score: {Math.round(AIavgScore * 10) / 10}</h4>
        </div> 
    )
}

export default Stats;
