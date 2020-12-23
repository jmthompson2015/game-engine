import StepRunner from "./StepRunner.js";

const TurnRunner = {};

TurnRunner.execute = (props, store) =>
  new Promise((resolve) => {
    const { actionCreator, gameFunction, selector } = props;

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
          return StepRunner.execute(props, store);
        });
      R.reduce(reduceFunction, Promise.resolve(), playerIds).then(() => {
        store.dispatch(actionCreator.setCurrentPlayer(undefined));
        resolve();
      });
    }
  });

Object.freeze(TurnRunner);

export default TurnRunner;
