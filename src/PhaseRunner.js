import StepRunner from "./StepRunner.js";
import TurnRunner from "./TurnRunner.js";

const PhaseRunner = {};

PhaseRunner.execute = (
  props,
  store,
  engine = { turnRunner: TurnRunner, stepRunner: StepRunner }
) =>
  new Promise((resolve) => {
    const { actionCreator, gameFunction } = props;
    const { turnRunner } = engine;

    if (!actionCreator) {
      throw new Error("actionCreator undefined");
    }
    if (!gameFunction) {
      throw new Error("gameFunction undefined");
    }

    if (gameFunction.isGameOver(store)) {
      resolve();
    } else {
      const phaseKeys = gameFunction.phaseKeys(store.getState());
      const reduceFunction = (promise, phaseKey) =>
        promise.then(() => {
          store.dispatch(actionCreator.setCurrentPhase(phaseKey));
          return turnRunner.execute(props, store, engine);
        });
      R.reduce(reduceFunction, Promise.resolve(), phaseKeys).then(() => {
        store.dispatch(actionCreator.setCurrentPhase(undefined));
        resolve();
      });
    }
  });

Object.freeze(PhaseRunner);

export default PhaseRunner;
