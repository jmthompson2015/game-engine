import StepRunner from "./StepRunner.js";
import TestData from "./TestData.js";

QUnit.module("StepRunner");

QUnit.test("execute()", (assert) => {
  // Setup.
  const props = {
    actionCreator: TestData.actionCreator,
    gameFunction: TestData.gameFunction,
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

  StepRunner.execute(props, store)
    .then(callback)
    .catch((error) => {
      assert.ok(false, error.message);
      done();
    });
});

const StepRunnerTest = {};
export default StepRunnerTest;
