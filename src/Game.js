import React from "react";
import {useState, useEffect} from "react";
import words from "./words";

function Game({currentGameDay, todaysWord, gameSave, setGameSave}) {
    const [wordInput, setWordInput] = useState("");
    const [attempt, setAttempt] = useState(0);
    const [gameStatus, setGameStatus] = useState("started");

    const handleWordInput = event => {
        const input = event.target.value;
        setWordInput(input);
    };
    function resetTheGame() {
        const rows = document.querySelectorAll(".row");
        rows.forEach(row => {
            Array.from(row.children).forEach(cell => {
                cell.classList.remove("correct", "wrong-place", "incorrect");
                cell.textContent = "";
            });
        });
        setAttempt(0);
        setWordInput("");
        setGameStatus("started");
    }

    useEffect(() => {
        resetTheGame();
    }, [todaysWord]);

    function handleGameEnded(gameWon, attempts) {
        let index = words.indexOf(todaysWord) + 1;
        let checkIfPlayedThatGameAlready = gameSave.games.filter(game => game.day === index);
        if (checkIfPlayedThatGameAlready.length) return;
        let score = gameWon ? (6 - attempts) * 2 : 0;
        gameSave.games.push({day: index, attempt: attempts, score: score});
        gameSave.totalScore += score;
        setGameSave(gameSave);
        localStorage.setItem("gameSave", JSON.stringify(gameSave));
    }

    const checkWord = event => {
        event.preventDefault();
        const inputWordLowerCase = wordInput.toLowerCase();
        const rows = document.querySelectorAll(".row");
        const currentRow = rows[attempt];
        const cells = Array.from(currentRow.children);

        if (inputWordLowerCase.length != 5) return;
        if (inputWordLowerCase.match("[^a-zA-ZąćęłńóśźżĄĘŁŃÓŚŹŻ]")) return;

        cells.forEach((cell, i) => {
            let letter = inputWordLowerCase[i];
            cell.textContent = letter.toUpperCase();
            if (todaysWord[i] === letter) {
                cell.classList.add("correct");
            } else if (todaysWord.includes(letter)) {
                cell.classList.add("wrong-place");
            } else {
                cell.classList.add("incorrect");
            }
        });

        if (todaysWord === inputWordLowerCase) {
            setGameStatus("won");
            handleGameEnded(true, attempt);
            return;
        } else {
            setAttempt(attempt + 1);
            setWordInput("");
        }
        if (attempt === 5) {
            setGameStatus("lost");
            handleGameEnded(false, attempt);
        }
    };

    return (
        <div className="game">
            {[1, 2, 3, 4, 5, 6].map(x => {
                return (
                    <div className="row" id={`game-row-${x}`} key={`game-row-${x}`}>
                        {[1, 2, 3, 4, 5].map(y => {
                            return (
                                <div
                                    className="cell"
                                    id={`game-cell-${y}`}
                                    key={`game-cell-${y}`}
                                ></div>
                            );
                        })}
                    </div>
                );
            })}
            {gameStatus === "started" && (
                <form id="wordinput" onSubmit={checkWord}>
                    <input value={wordInput} onChange={handleWordInput}></input>
                </form>
            )}
            {gameStatus === "won" && <h2 id="won">Wygrałeś!</h2>}
            {gameStatus === "lost" && <h2 id="lost">Przegrałeś!</h2>}
        </div>
    );
}

export default Game;
