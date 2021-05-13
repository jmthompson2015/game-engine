import SinglePhaseRunner from "./SinglePhaseRunner.js";
import TestData from "./TestData.js";

const { actionCreator, selector } = TestData;

QUnit.module("SinglePhaseRunner");

QUnit.test("execute()", (assert) => {
  // Setup.
  const gameFunction = { ...TestData.gameFunction, phaseKeys: undefined };
  const props = { actionCreator, gameFunction, selector };
  const store = TestData.createStore();
  store.dispatch(actionCreator.setCurrentRound(1));
  store.dispatch(actionCreator.setCurrentPlayerOrder([1, 2]));

  // Run.
  const done = assert.async();
  const callback = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    const state = store.getState();
    assert.equal(selector.currentRound(state), 1);
    assert.equal(selector.currentPhaseKey(state), undefined);
    assert.equal(selector.currentPlayerId(state), undefined);
    assert.equal(selector.currentStepKey(state), undefined);
    done();
  };

  SinglePhaseRunner.execute(props, store)
    .then(callback)
    .catch((error) => {
      assert.ok(false, error.message);
      done();
    });
});

const SinglePhaseRunnerTest = {};
export default SinglePhaseRunnerTest;
