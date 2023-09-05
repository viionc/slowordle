import "./App.css";
import Menu from "./Menu";
import Game from "./Game";
import React, {useEffect} from "react";
import {useState} from "react";
import words from "./words";

function App() {
    // const startingDate = Date.parse(
    //     "Mon Sep 01 2023 12:00:00 GMT+0200 (Central European Summer Time)"
    // );
    const startingDate = Date.parse(new Date(Date.UTC(2023, 8, 1, 0)).toUTCString());
    const currentDate = Date.now();
    const dayInMiliseconds = 24 * 60 * 60 * 1000;
    const currentGameDay = Math.floor((currentDate - startingDate) / dayInMiliseconds) + 1;

    const [todaysWord, setTodaysWord] = useState(words[currentGameDay - 1]);
    const [showMenu, setShowMenu] = useState(false);
    const [gameSave, setGameSave] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [seconds, setSeconds] = useState("");
    const [minutes, setMinutes] = useState("");
    const [hours, setHours] = useState("");

    function clickMenu() {
        let test = !showMenu;
        setShowMenu(test);
        if (test) document.querySelector(".menu").style.width = "250px";
        else document.querySelector(".menu").style.width = "0";
    }

    useEffect(() => {
        const interval = setInterval(() => {
            let date = new Date();
            let dateInMiliseconds =
                date.getUTCHours() * 60 * 60 * 1000 +
                date.getUTCMinutes() * 60 * 1000 +
                date.getUTCSeconds() * 1000;
            let remainingTime = dayInMiliseconds - dateInMiliseconds;
            setHours(Math.floor((remainingTime / (1000 * 60 * 60)) % 24));
            setMinutes(Math.floor((remainingTime / 1000 / 60) % 60));
            setSeconds(Math.floor((remainingTime / 1000) % 60));
        }, 1000);
        return () => clearInterval(interval);
    });

    useEffect(() => {
        let gameSave = localStorage.getItem("gameSave");
        if (gameSave) setGameSave(JSON.parse(gameSave));
        else
            setGameSave({
                games: [],
                totalScore: 0,
            });
        setLoaded(true);
    }, []);
    return (
        <div className="App">
            <img
                className="menu-icon"
                src="https://i.imgur.com/23AtfOp.png"
                onClick={clickMenu}
            ></img>
            <header className="App-header">
                <h1>Słowordle</h1>
            </header>
            <h2>
                Dzień {words.indexOf(todaysWord) + 1}{" "}
                {`${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${
                    seconds < 10 ? "0" + seconds : seconds
                }`}
            </h2>
            <Menu
                currentGameDay={currentGameDay}
                setTodaysWord={setTodaysWord}
                showMenu={showMenu}
                gameSave={gameSave}
                loaded={loaded}
            ></Menu>
            <section className="container">
                <Game
                    currentGameDay={currentGameDay}
                    todaysWord={todaysWord}
                    gameSave={gameSave}
                    setGameSave={setGameSave}
                ></Game>
            </section>
        </div>
    );
}

export default App;
