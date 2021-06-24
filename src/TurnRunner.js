import StepRunner from "./StepRunner.js";

const TurnRunner = {};

const NULL_PROMISE = () => Promise.resolve();

TurnRunner.execute = (props, store, engine = { stepRunner: StepRunner }) =>
  new Promise((resolve) => {
    const { actionCreator, gameFunction, selector } = props;

    if (R.isNil(actionCreator)) {
      throw new Error("actionCreator undefined");
    }
    if (R.isNil(gameFunction)) {
      throw new Error("gameFunction undefined");
    }
    if (R.isNil(selector)) {
      throw new Error("selector undefined");
    }

    const turnStart = gameFunction.turnStart || NULL_PROMISE;
    const turnEnd = gameFunction.turnEnd || NULL_PROMISE;

    const { stepRunner } = engine;

    if (R.isNil(stepRunner)) {
      throw new Error("stepRunner undefined");
    }

    if (gameFunction.isGameOver(store)) {
      resolve();
    } else {
      const playerIds = selector.currentPlayerOrder(store.getState());
      const reduceFunction = (promise, playerId) =>
        promise.then(() => {
          store.dispatch(actionCreator.setCurrentPlayer(playerId));
          return turnStart(store)
            .then(() => stepRunner.execute(props, store, engine))
            .then(() => turnEnd(store));
        });
      R.reduce(reduceFunction, Promise.resolve(), playerIds).then(() => {
        store.dispatch(actionCreator.setCurrentPlayer(undefined));
        resolve();
      });
    }
  });

Object.freeze(TurnRunner);

export default TurnRunner;
