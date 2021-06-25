(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.GameEngine = factory());
}(this, (function () { 'use strict';

  const StepRunner = {};

  StepRunner.execute = (props, store) =>
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

  const TurnRunner = {};

  const NULL_PROMISE$3 = () => Promise.resolve();

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

      const turnStart = gameFunction.turnStart || NULL_PROMISE$3;
      const turnEnd = gameFunction.turnEnd || NULL_PROMISE$3;

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

  const PhaseRunner = {};

  const NULL_PROMISE$2 = () => Promise.resolve();

  PhaseRunner.execute = (
    props,
    store,
    engine = { turnRunner: TurnRunner, stepRunner: StepRunner }
  ) =>
    new Promise((resolve) => {
      const { actionCreator, gameFunction } = props;

      if (R.isNil(actionCreator)) {
        throw new Error("actionCreator undefined");
      }
      if (R.isNil(gameFunction)) {
        throw new Error("gameFunction undefined");
      }

      const phaseStart = gameFunction.phaseStart || NULL_PROMISE$2;
      const phaseEnd = gameFunction.phaseEnd || NULL_PROMISE$2;

      const { turnRunner } = engine;

      if (R.isNil(turnRunner)) {
        throw new Error("turnRunner undefined");
      }

      if (gameFunction.isGameOver(store)) {
        resolve();
      } else {
        const phaseKeys = gameFunction.phaseKeys(store.getState());
        const reduceFunction = (promise, phaseKey) =>
          promise.then(() => {
            store.dispatch(actionCreator.setCurrentPhase(phaseKey));
            return phaseStart(store)
              .then(() => turnRunner.execute(props, store, engine))
              .then(() => phaseEnd(store));
          });
        R.reduce(reduceFunction, Promise.resolve(), phaseKeys).then(() => {
          store.dispatch(actionCreator.setCurrentPhase(undefined));
          resolve();
        });
      }
    });

  Object.freeze(PhaseRunner);

  const RoundRunner = {};

  const NULL_PROMISE$1 = () => Promise.resolve();

  const advanceRound = (props, store) => {
    const { actionCreator, selector } = props;

    if (!actionCreator) {
      throw new Error("actionCreator undefined");
    }
    if (!selector) {
      throw new Error("selector undefined");
    }

    const newRound = selector.currentRound(store.getState()) + 1;
    store.dispatch(actionCreator.setCurrentRound(newRound));
    store.dispatch(actionCreator.setCurrentPhase(null));
    store.dispatch(actionCreator.setCurrentPlayer(null));
  };

  RoundRunner.executeRounds = (props, store, engine, resolve) => {
    const { gameFunction, roundLimit, selector } = props;

    if (R.isNil(gameFunction)) {
      throw new Error("gameFunction undefined");
    }
    if (R.isNil(roundLimit)) {
      throw new Error("roundLimit undefined");
    }
    if (R.isNil(selector)) {
      throw new Error("selector undefined");
    }

    const roundStart = gameFunction.roundStart || NULL_PROMISE$1;
    const roundEnd = gameFunction.roundEnd || NULL_PROMISE$1;

    const { phaseRunner } = engine;

    if (R.isNil(phaseRunner)) {
      throw new Error("phaseRunner undefined");
    }

    const round = selector.currentRound(store.getState());

    if (gameFunction.isGameOver(store) || round > roundLimit) {
      resolve();
    } else {
      advanceRound(props, store);

      roundStart(store)
        .then(() => phaseRunner.execute(props, store, engine))
        .then(() => roundEnd(store))
        .then(() => {
          RoundRunner.executeRounds(props, store, engine, resolve);
        });
    }
  };

  RoundRunner.execute = (
    props,
    store,
    engine = {
      phaseRunner: PhaseRunner,
      turnRunner: TurnRunner,
      stepRunner: StepRunner,
    }
  ) =>
    new Promise((resolve) => {
      const { gameFunction } = props;

      if (!gameFunction) {
        throw new Error("gameFunction undefined");
      }

      if (gameFunction.isGameOver(store)) {
        resolve();
      } else {
        RoundRunner.executeRounds(props, store, engine, resolve);
      }
    });

  Object.freeze(RoundRunner);

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

  const GameEngine = {};

  GameEngine.RoundRunner = RoundRunner;
  GameEngine.PhaseRunner = PhaseRunner;
  GameEngine.TurnRunner = TurnRunner;
  GameEngine.StepRunner = StepRunner;

  GameEngine.SinglePhaseRunner = SinglePhaseRunner;
  GameEngine.SingleStepRunner = SingleStepRunner;

  Object.freeze(GameEngine);

  return GameEngine;

})));
