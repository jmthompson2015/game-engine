/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint prefer-destructuring: ["error", {"array": false}] */

import ActionCreator from "./ActionCreator.js";
import Selector from "./Selector.js";

const printBoard = (board) => {
  let answer = "";

  for (let i = 0; i < 3; i += 1) {
    const ii = i * 3;
    const s0 = board[ii] ? board[ii] : " ";
    const s1 = board[ii + 1] ? board[ii + 1] : " ";
    const s2 = board[ii + 2] ? board[ii + 2] : " ";
    answer += `${s0}|${s1}|${s2}\n`;
  }

  console.log(answer);
};

const GameFunction = {};

GameFunction.isGameOver = (store) => {
  let answer = false;
  let winner;
  const { board } = store.getState();

  // Check rows.
  if (!answer && board[0] && board[0] === board[1] && board[1] === board[2]) {
    answer = true;
    winner = board[0];
  }
  if (!answer && board[3] && board[3] === board[4] && board[4] === board[5]) {
    answer = true;
    winner = board[3];
  }
  if (!answer && board[6] && board[6] === board[7] && board[7] === board[8]) {
    answer = true;
    winner = board[6];
  }

  // TODO: Check columns.

  // TODO: Check diagonals.

  if (winner) {
    console.log(`winner = ${winner} answer ? ${answer}`);
  }

  return answer;
};

GameFunction.stepFunction = (store) =>
  new Promise((resolve) => {
    const playerId = Selector.currentPlayerId(store.getState());
    const { board } = store.getState();

    if (playerId === 1) {
      if (board[0] === null) {
        store.dispatch(ActionCreator.placeTokenAt(0, "X"));
      } else if (board[1] === null) {
        store.dispatch(ActionCreator.placeTokenAt(1, "X"));
      } else if (board[2] === null) {
        store.dispatch(ActionCreator.placeTokenAt(2, "X"));
      }
    } else if (playerId === 2) {
      if (board[8] === null) {
        store.dispatch(ActionCreator.placeTokenAt(8, "O"));
      } else if (board[4] === null) {
        store.dispatch(ActionCreator.placeTokenAt(4, "O"));
      }
    }

    printBoard(store.getState().board);
    resolve();
  });

Object.freeze(GameFunction);

export default GameFunction;
