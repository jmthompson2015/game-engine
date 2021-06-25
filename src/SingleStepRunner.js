const SingleStepRunner = {};

SingleStepRunner.execute = (props, store) =>
  new Promise((resolve) => {
    const { actionCreator, gameFunction } = props;

    if (R.isNil(actionCreator)) {
      throw new Error("actionCreator undefined");
    }
    if (R.isNil(gameFunction)) {
      throw new Error("gameFunction undefined");
    }

    if (gameFunction.isGameOver(store)) {
      resolve();
    } else {
      store.dispatch(actionCreator.setCurrentStep("step"));
      gameFunction.stepFunction(store).then(() => {
        store.dispatch(actionCreator.setCurrentStep(undefined));
        resolve();
      });
    }
  });

Object.freeze(SingleStepRunner);

export default SingleStepRunner;
