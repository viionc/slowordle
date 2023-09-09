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
        const tempLetters = [];

        if (inputWordLowerCase.length != 5) return;
        if (inputWordLowerCase.match("[^a-zA-ZąćęłńóśźżĄĘŁŃÓŚŹŻ]")) return;

        for (let i = 0; i < 5; i++) {
            let letter = tempLetters.filter(e => e.letter == todaysWord[i]);
            if (letter.length) {
                letter[0].index.push(i);
            } else {
                letter = {letter: todaysWord[i], index: [i]};
            }
            tempLetters.push(letter);
        }

        let lettersDone = [];

        for (let i = 0; i < 5; i++) {
            let inputLetter = inputWordLowerCase[i];
            let inputHasLetter = tempLetters.filter(l => l.letter == inputLetter)[0];
            cells[i].textContent = inputLetter.toUpperCase();

            if (!inputHasLetter) continue;

            if (inputHasLetter.index.includes(i)) {
                cells[i].classList.add("correct");
                lettersDone.push(inputLetter);
            }
        }

        for (let i = 0; i < 5; i++) {
            let inputLetter = inputWordLowerCase[i];
            let inputHasLetter = tempLetters.filter(l => l.letter == inputLetter)[0];

            if (!inputHasLetter) continue;

            if (lettersDone.filter(e => e == inputLetter).length < inputHasLetter.index.length) {
                lettersDone.push(inputLetter);
                cells[i].classList.add("wrong-place");
            }
        }

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
