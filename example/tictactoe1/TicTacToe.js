import RoundRunner from "../../src/RoundRunner.js";

import ActionCreator from "./ActionCreator.js";
import GameFunction from "./GameFunction.js";
import Selector from "./Selector.js";

const TicTacToe = {};

TicTacToe.execute = (store) => {
  // Setup.
  const props = {
    actionCreator: ActionCreator,
    gameFunction: GameFunction,
    roundLimit: 5,
    selector: Selector,
  };

  // Run.
  return RoundRunner.execute(props, store);
};

Object.freeze(TicTacToe);

export default TicTacToe;
