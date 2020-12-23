const StepRunner = {};

StepRunner.execute = (props, store) =>
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
      const stepKeys = gameFunction.stepKeys(store.getState());
      const reduceFunction = (promise, stepKey) =>
        promise.then(() => {
          store.dispatch(actionCreator.setCurrentStep(stepKey));
          return gameFunction.stepFunction[stepKey](store);
        });
      R.reduce(reduceFunction, Promise.resolve(), stepKeys).then(() => {
        store.dispatch(actionCreator.setCurrentStep(undefined));
        resolve();
      });
    }
  });

Object.freeze(StepRunner);

export default StepRunner;
