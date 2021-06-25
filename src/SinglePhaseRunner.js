import StepRunner from "./StepRunner.js";
import TurnRunner from "./TurnRunner.js";

const SinglePhaseRunner = {};

const NULL_PROMISE = () => Promise.resolve();

SinglePhaseRunner.execute = (
  props,
  store,
  engine = { turnRunner: TurnRunner, stepRunner: StepRunner }
) =>
  new Promise((resolve) => {
    const { actionCreator, gameFunction } = props;
    const { turnRunner } = engine;

    if (R.isNil(actionCreator)) {
      throw new Error("actionCreator undefined");
    }
    if (R.isNil(gameFunction)) {
      throw new Error("gameFunction undefined");
    }

    const phaseStart = gameFunction.phaseStart || NULL_PROMISE;
    const phaseEnd = gameFunction.phaseEnd || NULL_PROMISE;

    if (gameFunction.isGameOver(store)) {
      resolve();
    } else {
      store.dispatch(actionCreator.setCurrentPhase("phase"));
      phaseStart(store)
        .then(() => turnRunner.execute(props, store, engine))
        .then(() => phaseEnd(store))
        .then(() => {
          store.dispatch(actionCreator.setCurrentPhase(undefined));
          resolve();
        });
    }
  });

Object.freeze(SinglePhaseRunner);

export default SinglePhaseRunner;
