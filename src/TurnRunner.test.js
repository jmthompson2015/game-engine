/* eslint no-console: ["error", { allow: ["error"] }] */

import TestData from "./TestData.js";
import TurnRunner from "./TurnRunner.js";

const { actionCreator, gameFunction, selector } = TestData;

QUnit.module("TurnRunner");

QUnit.test("execute()", (assert) => {
  // Setup.
  const props = { actionCreator, gameFunction, selector };
  const store = TestData.createStore();
  store.dispatch(actionCreator.setCurrentRound(1));
  store.dispatch(actionCreator.setCurrentPhase("a"));
  store.dispatch(actionCreator.setCurrentPlayerOrder([1, 2]));

  // Run.
  const done = assert.async();
  const callback = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    const state = store.getState();
    assert.equal(selector.currentRound(state), 1);
    assert.equal(selector.currentPhaseKey(state), "a");
    assert.equal(selector.currentPlayerId(state), undefined);
    assert.equal(selector.currentStepKey(state), undefined);
    done();
  };

  TurnRunner.execute(props, store)
    .then(callback)
    .catch((error) => {
      assert.ok(false, error.message);
      done();
    });
});

const TurnRunnerTest = {};
export default TurnRunnerTest;
