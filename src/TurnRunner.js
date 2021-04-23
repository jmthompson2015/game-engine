import StepRunner from "./StepRunner.js";

const TurnRunner = {};

TurnRunner.execute = (props, store, engine = { stepRunner: StepRunner }) =>
  new Promise((resolve) => {
    const { actionCreator, gameFunction, selector } = props;
    const { stepRunner } = engine;

    if (!actionCreator) {
      throw new Error("actionCreator undefined");
    }
    if (!gameFunction) {
      throw new Error("gameFunction undefined");
    }

    if (gameFunction.isGameOver(store)) {
      resolve();
    } else {
      const playerIds = selector.currentPlayerOrder(store.getState());
      const reduceFunction = (promise, playerId) =>
        promise.then(() => {
          store.dispatch(actionCreator.setCurrentPlayer(playerId));
          return stepRunner.execute(props, store, engine);
        });
      R.reduce(reduceFunction, Promise.resolve(), playerIds).then(() => {
        store.dispatch(actionCreator.setCurrentPlayer(undefined));
        resolve();
      });
    }
  });

Object.freeze(TurnRunner);

export default TurnRunner;
