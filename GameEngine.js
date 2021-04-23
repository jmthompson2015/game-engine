import PhaseRunner from "./src/PhaseRunner.js";
import RoundRunner from "./src/RoundRunner.js";
import SinglePhaseRunner from "./src/SinglePhaseRunner.js";
import SingleStepRunner from "./src/SingleStepRunner.js";
import StepRunner from "./src/StepRunner.js";
import TurnRunner from "./src/TurnRunner.js";

const GameEngine = {};

GameEngine.RoundRunner = RoundRunner;
GameEngine.PhaseRunner = PhaseRunner;
GameEngine.TurnRunner = TurnRunner;
GameEngine.StepRunner = StepRunner;

GameEngine.SinglePhaseRunner = SinglePhaseRunner;
GameEngine.SingleStepRunner = SingleStepRunner;

Object.freeze(GameEngine);

export default GameEngine;
