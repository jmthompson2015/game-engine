/* eslint no-console: ["error", { allow: ["log","warn"] }] */

const initialBoard = new Array(9);
initialBoard.fill(null);

const Reducer = {
  root: (state, action) => {
    if (typeof state === "undefined") {
      return {
        board: initialBoard,
        currentRound: 0,
        currentPhaseKey: null,
        currentPlayerOrder: null,
        currentPlayerId: null,
        currentStepKey: null,
      };
    }

    if (action.type.startsWith("@@redux/INIT")) {
      // Nothing to do.
      return state;
    }

    let newBoard;
    let newPlayers;

    switch (action.type) {
      case "placeTokenAt":
        console.log(
          `Reducer PLACE_TOKEN_AT index = ${action.index} token = ${action.token}`
        );
        newBoard = R.update(action.index, action.token, state.board);
        return { ...state, board: newBoard };
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

Object.freeze(Reducer);

export default Reducer;
