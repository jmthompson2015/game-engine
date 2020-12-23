import RoundRunner from "./RoundRunner.js";
import TestData from "./TestData.js";

QUnit.module("RoundRunner");

QUnit.test("execute() ", (assert) => {
  // Setup.
  const props = {
    actionCreator: TestData.actionCreator,
    gameFunction: TestData.gameFunction,
    roundLimit: 2,
    selector: TestData.selector,
  };
  const store = TestData.createStore();

  // Run.
  const done = assert.async();
  const callback = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    const state = store.getState();
    assert.equal(TestData.selector.currentRound(state), 3);
    assert.equal(TestData.selector.currentPhaseKey(state), undefined);
    const currentPlayerOrder = TestData.selector.currentPlayerOrder(state);
    assert.ok(currentPlayerOrder);
    assert.equal(Array.isArray(currentPlayerOrder), true);
    assert.equal(currentPlayerOrder.length, 2);
    assert.equal(currentPlayerOrder.join(), "1,2");
    assert.equal(TestData.selector.currentPlayerId(state), undefined);
    assert.equal(TestData.selector.currentStepKey(state), undefined);
    done();
  };

  RoundRunner.execute(props, store)
    .then(callback)
    .catch((error) => {
      assert.ok(false, error.message);
      done();
    });
});

const RoundRunnerTest = {};
export default RoundRunnerTest;
