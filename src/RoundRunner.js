import PhaseRunner from "./PhaseRunner.js";
import StepRunner from "./StepRunner.js";
import TurnRunner from "./TurnRunner.js";

const RoundRunner = {};

const advanceRound = (props, store) => {
  const { actionCreator, selector } = props;

  if (!actionCreator) {
    throw new Error("actionCreator undefined");
  }
  if (!selector) {
    throw new Error("selector undefined");
  }

  const newRound = selector.currentRound(store.getState()) + 1;
  store.dispatch(actionCreator.setCurrentRound(newRound));
  store.dispatch(actionCreator.setCurrentPhase(null));

  const playerIds = selector.playersInOrder(store.getState());
  store.dispatch(actionCreator.setCurrentPlayerOrder(playerIds));
  store.dispatch(actionCreator.setCurrentPlayer(null));
};

RoundRunner.executeRounds = (props, store, engine, resolve) => {
  const { gameFunction, roundLimit, selector } = props;
  const { phaseRunner } = engine;

  if (!roundLimit) {
    throw new Error("roundLimit undefined");
  }
  if (!selector) {
    throw new Error("selector undefined");
  }
  if (!phaseRunner) {
    throw new Error("phaseRunner undefined");
  }

  const round = selector.currentRound(store.getState());

  if (gameFunction.isGameOver(store) || round > roundLimit) {
    resolve();
  } else {
    advanceRound(props, store);

    phaseRunner.execute(props, store, engine).then(() => {
      RoundRunner.executeRounds(props, store, engine, resolve);
    });
  }
};

RoundRunner.execute = (
  props,
  store,
  engine = {
    phaseRunner: PhaseRunner,
    turnRunner: TurnRunner,
    stepRunner: StepRunner,
  }
) =>
  new Promise((resolve) => {
    const { gameFunction } = props;

    if (!gameFunction) {
      throw new Error("gameFunction undefined");
    }

    if (gameFunction.isGameOver(store)) {
      resolve();
    } else {
      RoundRunner.executeRounds(props, store, engine, resolve);
    }
  });

Object.freeze(RoundRunner);

export default RoundRunner;
