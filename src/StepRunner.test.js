import StepRunner from "./StepRunner.js";
import TestData from "./TestData.js";

const { actionCreator, gameFunction, selector } = TestData;

QUnit.module("StepRunner");

QUnit.test("execute()", (assert) => {
  // Setup.
  const props = { actionCreator, gameFunction };
  const store = TestData.createStore();
  store.dispatch(actionCreator.setCurrentRound(1));
  store.dispatch(actionCreator.setCurrentPhase("a"));
  store.dispatch(actionCreator.setCurrentPlayerOrder([1, 2]));
  store.dispatch(actionCreator.setCurrentPlayer(1));

  // Run.
  const done = assert.async();
  const callback = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    const state = store.getState();
    assert.equal(selector.currentRound(state), 1);
    assert.equal(selector.currentPhaseKey(state), "a");
    assert.equal(selector.currentPlayerId(state), 1);
    assert.equal(selector.currentStepKey(state), undefined);
    done();
  };

  StepRunner.execute(props, store)
    .then(callback)
    .catch((error) => {
      assert.ok(false, error.message);
      done();
    });
});

const StepRunnerTest = {};
export default StepRunnerTest;
