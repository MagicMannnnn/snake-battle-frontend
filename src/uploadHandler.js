
const getScoresPath = "http://localhost:3000/scores";
const saveScorePath = "http://localhost:3000/saveScore";
const getEntriesPath = "http://localhost:3000/entries";
const getScoresFromUsernamePath = "http://localhost:3000/scoresFromUsername";
const getHashedPasswordPath = "http://localhost:3000/hashedPassword";
const signupPath = "http://localhost:3000/signup";
const getScoreFromUsernamePath = "http://localhost:3000/scoreFromUsername";

export class UploadHandler {
    static async uploadScore(score, name){
        console.log("uploading score");
        try{
            await fetch(saveScorePath, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: name, score: score})
            });
        } catch (err) {
            console.log(err.message);
        }
        
    }

    static async getScores(sortType, start, end) {
        try {
            const response = await fetch(getScoresPath + `?start=${start}&end=${end}&sortType=${Number(sortType)}`);
            const data = await response.json();
            return data;
        } catch (err) {
            console.error(err.message);
        }
    }

    static async getScoresFromUsername(username, itemsPerPage) {
        try {
            const response = await fetch(getScoresFromUsernamePath + `?itemsPerPage=${itemsPerPage}&username=${username}`);
            const data = await response.json();
            return data;
        } catch (err) {
            console.error(err.message);
        }
    }

    static async getNEntries() {
        try {
            const response = await fetch(getEntriesPath);
            const data = await response.json();
            return data;
        } catch (err) {
            console.error(err.message);
        }
    }

    static async getHashedPassword(username){
        try {
            const response = await fetch(getHashedPasswordPath + `?username=${username}`);
            const data = await response.json();
            return data;
        } catch (err) {
            console.error(err.message);
            return null;
        }
        
    }

    static async Signup(username, password){
        try{
            const response = await fetch(signupPath, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password})
            });
            console.log("returning response");
            return response;
        } catch (err) {
            console.log(err.message);
            return err;
        }
        
    }

    static async getScoreFromUsername(username) {
        try {
            const response = await fetch(getScoreFromUsernamePath + `?username=${username}`);
            const data = await response.json();
            return data;
        } catch (err) {
            console.error(err.message);
        }
        return 0;
    }
    
}