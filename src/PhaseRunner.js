import StepRunner from "./StepRunner.js";
import TurnRunner from "./TurnRunner.js";

const PhaseRunner = {};

const NULL_PROMISE = () => Promise.resolve();

PhaseRunner.execute = (
  props,
  store,
  engine = { turnRunner: TurnRunner, stepRunner: StepRunner }
) =>
  new Promise((resolve) => {
    const { actionCreator, gameFunction } = props;

    if (R.isNil(actionCreator)) {
      throw new Error("actionCreator undefined");
    }
    if (R.isNil(gameFunction)) {
      throw new Error("gameFunction undefined");
    }

    const phaseStart = gameFunction.phaseStart || NULL_PROMISE;
    const phaseEnd = gameFunction.phaseEnd || NULL_PROMISE;

    const { turnRunner } = engine;

    if (R.isNil(turnRunner)) {
      throw new Error("turnRunner undefined");
    }

    if (gameFunction.isGameOver(store)) {
      resolve();
    } else {
      const phaseKeys = gameFunction.phaseKeys(store.getState());
      const reduceFunction = (promise, phaseKey) =>
        promise.then(() => {
          store.dispatch(actionCreator.setCurrentPhase(phaseKey));
          return phaseStart(store)
            .then(() => turnRunner.execute(props, store, engine))
            .then(() => phaseEnd(store));
        });
      R.reduce(reduceFunction, Promise.resolve(), phaseKeys).then(() => {
        store.dispatch(actionCreator.setCurrentPhase(undefined));
        resolve();
      });
    }
  });

Object.freeze(PhaseRunner);

export default PhaseRunner;
