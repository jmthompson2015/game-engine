(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.GameEngine = factory());
}(this, (function () { 'use strict';

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

  const PhaseRunner = {};

  PhaseRunner.execute = (
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
        const phaseKeys = gameFunction.phaseKeys(store.getState());
        const reduceFunction = (promise, phaseKey) =>
          promise.then(() => {
            store.dispatch(actionCreator.setCurrentPhase(phaseKey));
            return turnRunner.execute(props, store, engine);
          });
        R.reduce(reduceFunction, Promise.resolve(), phaseKeys).then(() => {
          store.dispatch(actionCreator.setCurrentPhase(undefined));
          resolve();
        });
      }
    });

  Object.freeze(PhaseRunner);

  const RoundRunner = {};

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

    const playerIds = selector.playersInOrder(store.getState());
    store.dispatch(actionCreator.setCurrentPlayerOrder(playerIds));
    store.dispatch(actionCreator.setCurrentPlayer(null));
  };

  RoundRunner.executeRounds = (props, store, engine, resolve) => {
    const { gameFunction, roundLimit, selector } = props;
    const { phaseRunner } = engine;

    if (!roundLimit) {
      throw new Error("roundLimit undefined");
    }
    if (!selector) {
      throw new Error("selector undefined");
    }
    if (!phaseRunner) {
      throw new Error("phaseRunner undefined");
    }

    const round = selector.currentRound(store.getState());

    if (gameFunction.isGameOver(store) || round > roundLimit) {
      resolve();
    } else {
      advanceRound(props, store);

      phaseRunner.execute(props, store, engine).then(() => {
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
