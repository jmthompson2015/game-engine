import TurnRunner from "./TurnRunner.js";

const PhaseRunner = {};

PhaseRunner.execute = (props, store) =>
  new Promise((resolve) => {
    const { actionCreator, gameFunction } = props;

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
          return TurnRunner.execute(props, store);
        });
      R.reduce(reduceFunction, Promise.resolve(), phaseKeys).then(() => {
        store.dispatch(actionCreator.setCurrentPhase(undefined));
        resolve();
      });
    }
  });

Object.freeze(PhaseRunner);

export default PhaseRunner;
