import StepRunner from "./StepRunner.js";
import TurnRunner from "./TurnRunner.js";

const SinglePhaseRunner = {};

SinglePhaseRunner.execute = (
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
      store.dispatch(actionCreator.setCurrentPhase("phase"));
      turnRunner.execute(props, store, engine).then(() => {
        store.dispatch(actionCreator.setCurrentPhase(undefined));
        resolve();
      });
    }
  });

Object.freeze(SinglePhaseRunner);

export default SinglePhaseRunner;
