import RoundRunner from "../../src/RoundRunner.js";
import SinglePhaseRunner from "../../src/SinglePhaseRunner.js";
import SingleStepRunner from "../../src/SingleStepRunner.js";
import TurnRunner from "../../src/TurnRunner.js";

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
  const engine = {
    phaseRunner: SinglePhaseRunner,
    turnRunner: TurnRunner,
    stepRunner: SingleStepRunner,
  };

  // Run.
  return RoundRunner.execute(props, store, engine);
};

Object.freeze(TicTacToe);

export default TicTacToe;
