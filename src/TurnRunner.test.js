/* eslint no-console: ["error", { allow: ["error"] }] */

import TestData from "./TestData.js";
import TurnRunner from "./TurnRunner.js";

QUnit.module("TurnRunner");

QUnit.test("execute()", (assert) => {
  // Setup.
  const props = {
    actionCreator: TestData.actionCreator,
    gameFunction: TestData.gameFunction,
    selector: TestData.selector,
  };
  const store = TestData.createStore();
  store.dispatch(TestData.actionCreator.setCurrentRound(1));
  store.dispatch(TestData.actionCreator.setCurrentPhase("a"));
  store.dispatch(TestData.actionCreator.setCurrentPlayerOrder([1, 2]));

  // Run.
  const done = assert.async();
  const callback = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    const state = store.getState();
    assert.equal(TestData.selector.currentRound(state), 1);
    assert.equal(TestData.selector.currentPhaseKey(state), "a");
    assert.equal(TestData.selector.currentPlayerId(state), undefined);
    assert.equal(TestData.selector.currentStepKey(state), undefined);
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
