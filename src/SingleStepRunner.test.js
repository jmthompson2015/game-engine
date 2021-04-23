/* eslint no-console: ["error", { allow: ["log"] }] */

import SingleStepRunner from "./SingleStepRunner.js";
import TestData from "./TestData.js";

QUnit.module("SingleStepRunner");

QUnit.test("execute()", (assert) => {
  // Setup.
  const gameFunction = {
    ...TestData.gameFunction,
    stepFunction: (/* store */) =>
      new Promise((resolve) => {
        console.log("execute step");
        resolve();
      }),
  };
  const props = {
    actionCreator: TestData.actionCreator,
    gameFunction,
  };
  const store = TestData.createStore();
  store.dispatch(TestData.actionCreator.setCurrentRound(1));
  store.dispatch(TestData.actionCreator.setCurrentPhase("a"));
  store.dispatch(TestData.actionCreator.setCurrentPlayerOrder([1, 2]));
  store.dispatch(TestData.actionCreator.setCurrentPlayer(1));

  // Run.
  const done = assert.async();
  const callback = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    const state = store.getState();
    assert.equal(TestData.selector.currentRound(state), 1);
    assert.equal(TestData.selector.currentPhaseKey(state), "a");
    assert.equal(TestData.selector.currentPlayerId(state), 1);
    assert.equal(TestData.selector.currentStepKey(state), undefined);
    done();
  };

  SingleStepRunner.execute(props, store)
    .then(callback)
    .catch((error) => {
      assert.ok(false, error.message);
      done();
    });
});

const SingleStepRunnerTest = {};
export default SingleStepRunnerTest;
