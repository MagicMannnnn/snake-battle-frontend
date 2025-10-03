/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import { UploadHandler } from './uploadHandler'

function Leaderboard() {
    const itemsPerPage = 10;

    const navigate = useNavigate();

    const gotToHome = () => {
        navigate('/')  // Navigate on button click
    }

    //const scoresRef = useRef({});
    const [scores, setScores] = useState([]);
    const [sortType, setSortType] = useState(2); //1 username 2 score 3 date (- for reversed) : 0 to goto self
    const [page, setPage] = useState(0);
    const [entries, setEntries] = useState(0);


    async function goToUser(){
        const data = await UploadHandler.getScoresFromUsername("George", itemsPerPage);
        setPage(data);
        setSortType(2);
    }


    async function getNEntries() {
        const nPages = await UploadHandler.getNEntries();
        setEntries(nPages);
        return nPages;
    }


    async function incrementPage() {
        const nPages = await getNEntries();
        if ((page + 1) * itemsPerPage < nPages){
            setPage(() => page + 1);
            getData(); 
        }
    }
    function decrementPage() {
        if (page > 0){
            setPage(page - 1);
        }
    }


    function handleSortTypeChange(type) {
        setPage(0);
        if (type == Math.abs(sortType)){ //reversed
            setSortType(sortType * -1);
        }
        else {
            setSortType(type);
        }
    }


    async function getData(){
        const data = await UploadHandler.getScores(sortType, page * itemsPerPage, (page+1) * itemsPerPage);
        if (data){
            const finalData = data.map((i) => 
            <tr key={i.date}> 
                <td>{i.rank}</td>
                <td>{i.username}</td> 
                <td>{i.score}</td> 
                <td>{i.date.substring(0, 10)}</td> 
                <td>{i.date.substring(11, 16)}</td>
            </tr>);
            setScores(finalData);
        }
    }

    useEffect(() => {      
        getData(); 
    }, [sortType, page]);

    useEffect(() => {
        (async () => {
            await getNEntries();
        })();
    }, [scores]);

    return (
        <>
            <div className='header-container'>
                <h3><button className='leaderboard-button' onClick={gotToHome}>Battle</button></h3>
                <h1>Leaderboard</h1>
                <h3><button className='reload-button' onClick={getData}>Reload</button></h3>
            </div>

            <div className='leaderboard-container'>
                <h1><button className='page-button' onClick={decrementPage}>▲</button></h1>

                <div className='table-container'>
                    <table className='scores'>
                        <thead>
                            <tr>
                                <th><button className='table-header-button' onClick={() => handleSortTypeChange(2)}>Rank {sortType == 2 ? "▲" : sortType == -2 ? "▼" : ""}</button></th>
                                <th><button className='table-header-button' onClick={() => handleSortTypeChange(1)}>Username {sortType == 1 ? "▲" : sortType == -1 ? "▼" : ""}</button></th>
                                <th><button className='table-header-button' onClick={() => handleSortTypeChange(2)}>Score {sortType == 2 ? "▲" : sortType == -2 ? "▼" : ""}</button></th>
                                <th><button className='table-header-button' onClick={() => handleSortTypeChange(3)}>Date {sortType == 3 ? "▲" : sortType == -3 ? "▼" : ""}</button></th>
                                <th>Time <span style={{ fontSize: '0.8em' }}>(UTC)</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {scores}
                        </tbody>
                    </table>

                </div>

                
            </div>

            <div className='footer-container'>
                <h3><span  className='showing-pages'>Page {page + 1} of {Math.ceil(entries / itemsPerPage)}</span></h3>
                <h1><button className='page-button' onClick={incrementPage}>▼</button></h1>
                <h3><span  className='showing-entries'>Showing {page * itemsPerPage + 1}-{Math.min((page+1) * itemsPerPage, entries)} of {entries}</span></h3>
                <h3><button className='goto-user' onClick={goToUser}>My Rank</button></h3>
            </div>
            
            
        </>
    )
}

export default Leaderboard;
