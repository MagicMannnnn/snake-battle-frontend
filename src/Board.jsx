import {  } from 'react'
import './App.css'

function Board({width, height, roundness, apple, snake, score, highscore, ai=false}) {

    

    function getColour(i) {
        let appleIndex = apple[1] * width + apple[0];
        
        if (appleIndex == i) {
            return 'rgba(194, 31, 31, 1)';
        }

        var segmentCount = 0;
        for (let segment of snake) {
            if (segment[1] * width + segment[0] == i) {  
                return `hsl(${100 + segmentCount * 20}, 80%, 50%)`;
            }
            segmentCount++;
        }

        return 'rgb(59, 59, 59)';
    }

    const board = Array.from({length: width * height}, (v, k) => k);

    var cells = board.map((i) => (
        <div key={i} className='cell' style={
            {   borderRadius: `${roundness}%`,
                backgroundColor: `${getColour(i)}`
            }}>

    </div>
    ));

    return (
        <div className='board-container'>
             <div className='board' style={{
                gridTemplateColumns: `repeat(${width}, 1fr)`,
                gridTemplateRows: `repeat(${height}, 1fr)`,
            }}>
                {cells}

            </div>
            <h3>{ai ? "AI " : ""}Score: {score} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {ai ? "AI " : ""} High Score: {highscore}</h3>
        </div>

        
    )
}

export default Board;