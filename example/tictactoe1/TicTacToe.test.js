import ActionCreator from "./ActionCreator.js";
import Reducer from "./Reducer.js";
import Selector from "./Selector.js";
import TicTacToe from "./TicTacToe.js";

QUnit.module("TicTacToe");

const createPlayers = () => {
  const player1 = {
    id: 1,
    name: "Alfred", // Pennyworth
  };
  const player2 = {
    id: 2,
    name: "Bruce", // Wayne
  };

  return [player1, player2];
};

const createStore = () => {
  const store = Redux.createStore(Reducer.root);
  const players = createPlayers();
  store.dispatch(ActionCreator.setPlayers(players));
  store.dispatch(ActionCreator.setCurrentPlayerOrder([1, 2]));

  return store;
};

QUnit.test("execute() ", (assert) => {
  // Setup.
  const store = createStore();

  // Run.
  const done = assert.async();
  const callback = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    const state = store.getState();
    assert.equal(Selector.currentRound(state), 3);
    assert.equal(Selector.currentPhaseKey(state), undefined);
    const currentPlayerOrder = Selector.currentPlayerOrder(state);
    assert.ok(currentPlayerOrder);
    assert.equal(Array.isArray(currentPlayerOrder), true);
    assert.equal(currentPlayerOrder.length, 2);
    assert.equal(currentPlayerOrder.join(), "1,2");
    assert.equal(Selector.currentPlayerId(state), undefined);
    assert.equal(Selector.currentStepKey(state), undefined);

    const { board } = state;
    assert.equal(board[0], "X");
    assert.equal(board[1], "X");
    assert.equal(board[2], "X");
    assert.equal(board[4], "O");
    assert.equal(board[8], "O");
    done();
  };

  TicTacToe.execute(store)
    .then(callback)
    .catch((error) => {
      assert.ok(false, error.message);
      done();
    });
});

const TicTacToeTest = {};
export default TicTacToeTest;
