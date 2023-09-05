import words from "./words.js";
import {useEffect, useState} from "react";
function Menu({currentGameDay, setTodaysWord, gameSave, loaded}) {
    return (
        <>
            {loaded && (
                <div className="menu">
                    {[...Array(currentGameDay)].map((w, i) => {
                        let getDayScore = gameSave.games.filter(e => e.day == i + 1)[0];
                        let color = "white";
                        if (getDayScore && getDayScore.score) color = "green";
                        else if (getDayScore && getDayScore.score == 0) color = "red";
                        let squares = [];
                        for (let j = 0; j < 6; j++) {
                            let squareColor = "white";
                            if (getDayScore) {
                                if (j >= getDayScore.attempt) squareColor = "green";
                                else if (j < getDayScore.attempt) squareColor = "red";
                                if (getDayScore.score == 0) squareColor = "red";
                            }
                            squares.push(
                                <span
                                    className="menu-attempt"
                                    style={{backgroundColor: squareColor}}
                                    key={`${i}-square-${j}`}
                                ></span>
                            );
                        }
                        return (
                            <div
                                style={{color: color}}
                                onClick={() => {
                                    setTodaysWord(words[i]);
                                }}
                                key={i}
                            >
                                <span style={{paddingRight: "8px"}}>Dzień {i + 1}</span>
                                {squares.reverse().map(square => {
                                    return square;
                                })}
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}

export default Menu;
