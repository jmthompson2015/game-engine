import PhaseRunner from "./PhaseRunner.js";
import StepRunner from "./StepRunner.js";
import TurnRunner from "./TurnRunner.js";

const RoundRunner = {};

const NULL_PROMISE = () => Promise.resolve();

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
  store.dispatch(actionCreator.setCurrentPlayer(null));
};

RoundRunner.executeRounds = (props, store, engine, resolve) => {
  const { gameFunction, roundLimit, selector } = props;

  if (R.isNil(gameFunction)) {
    throw new Error("gameFunction undefined");
  }
  if (R.isNil(roundLimit)) {
    throw new Error("roundLimit undefined");
  }
  if (R.isNil(selector)) {
    throw new Error("selector undefined");
  }

  const roundStart = gameFunction.roundStart || NULL_PROMISE;
  const roundEnd = gameFunction.roundEnd || NULL_PROMISE;

  const { phaseRunner } = engine;

  if (R.isNil(phaseRunner)) {
    throw new Error("phaseRunner undefined");
  }

  const round = selector.currentRound(store.getState());

  if (gameFunction.isGameOver(store) || round > roundLimit) {
    resolve();
  } else {
    advanceRound(props, store);

    roundStart(store)
      .then(() => phaseRunner.execute(props, store, engine))
      .then(() => roundEnd(store))
      .then(() => {
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
