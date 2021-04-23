const SingleStepRunner = {};

SingleStepRunner.execute = (props, store) =>
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
      store.dispatch(actionCreator.setCurrentStep("step"));
      gameFunction.stepFunction(store).then(() => {
        store.dispatch(actionCreator.setCurrentStep(undefined));
        resolve();
      });
    }
  });

Object.freeze(SingleStepRunner);

export default SingleStepRunner;
