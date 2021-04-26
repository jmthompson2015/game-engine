/* eslint no-console: ["error", { allow: ["log","warn"] }] */

const TestData = {};

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

const Reducer = {
  root: (state, action) => {
    if (typeof state === "undefined") {
      return {
        currentRound: 0,
        currentPhaseKey: null,
        currentPlayerOrder: [],
        currentPlayerId: null,
        currentStepKey: null,
      };
    }

    if (action.type.startsWith("@@redux/INIT")) {
      // Nothing to do.
      return state;
    }

    let newPlayers;

    switch (action.type) {
      case "setCurrentPhase":
        console.log(`Reducer SET_CURRENT_PHASE phaseKey = ${action.phaseKey}`);
        return { ...state, currentPhaseKey: action.phaseKey };
      case "setCurrentPlayer":
        console.log(`Reducer SET_CURRENT_PLAYER playerId = ${action.playerId}`);
        return { ...state, currentPlayerId: action.playerId };
      case "setCurrentPlayerOrder":
        console.log(
          `Reducer SET_CURRENT_PLAYER_ORDER playerIds = ${JSON.stringify(
            action.playerIds
          )}`
        );
        return { ...state, currentPlayerOrder: action.playerIds };
      case "setCurrentRound":
        console.log(`Reducer SET_CURRENT_ROUND round = ${action.round}`);
        return { ...state, currentRound: action.round };
      case "setCurrentStep":
        console.log(`Reducer SET_CURRENT_STEP stepKey = ${action.stepKey}`);
        return { ...state, currentStepKey: action.stepKey };
      case "setPlayers":
        console.log(
          `Reducer SET_PLAYERS players.length = ${action.players.length}`
        );
        newPlayers = R.reduce(
          (accum, p) => ({ ...accum, [p.id]: p }),
          {},
          action.players
        );
        return { ...state, playerInstances: newPlayers };
      default:
        console.warn(`Reducer.root: Unhandled action type: ${action.type}`);
        return state;
    }
  },
};

// /////////////////////////////////////////////////////////////////////////////
// See https://redux.js.org/recipes/reducing-boilerplate
const makeActionCreator = (type, ...argNames) => (...args) => {
  const action = { type };
  argNames.forEach((arg, index) => {
    action[argNames[index]] = args[index];
  });
  return action;
};

TestData.actionCreator = {
  setCurrentPhase: makeActionCreator("setCurrentPhase", "phaseKey"),
  setCurrentPlayer: makeActionCreator("setCurrentPlayer", "playerId"),
  setCurrentPlayerOrder: makeActionCreator(
    "setCurrentPlayerOrder",
    "playerIds"
  ),
  setCurrentRound: makeActionCreator("setCurrentRound", "round"),
  setCurrentStep: makeActionCreator("setCurrentStep", "stepKey"),
  setPlayers: makeActionCreator("setPlayers", "players"),
};

// /////////////////////////////////////////////////////////////////////////////
TestData.gameFunction = {
  isGameOver: (/* store */) => false,
  phaseKeys: (/* state */) => ["a", "b"],
  stepKeys: (/* state */) => ["one", "two"],
  stepFunction: {
    one: (/* store */) => {
      console.log("execute step one");
    },
    two: (/* store */) => {
      console.log("execute step two");
    },
  },
};

// /////////////////////////////////////////////////////////////////////////////
TestData.selector = {
  currentRound: (state) => state.currentRound,
  currentPhaseKey: (state) => state.currentPhaseKey,
  currentPlayerId: (state) => state.currentPlayerId,
  currentPlayerOrder: (state) => state.currentPlayerOrder,
  currentStepKey: (state) => state.currentStepKey,
};

// /////////////////////////////////////////////////////////////////////////////
TestData.createStore = () => {
  const store = Redux.createStore(Reducer.root);
  const players = createPlayers();
  store.dispatch(TestData.actionCreator.setPlayers(players));
  store.dispatch(TestData.actionCreator.setCurrentPlayerOrder([1, 2]));

  return store;
};

Object.freeze(TestData);

export default TestData;
