// See https://redux.js.org/recipes/reducing-boilerplate
const makeActionCreator = (type, ...argNames) => (...args) => {
  const action = { type };
  argNames.forEach((arg, index) => {
    action[argNames[index]] = args[index];
  });
  return action;
};

const ActionCreator = {};

ActionCreator.placeTokenAt = makeActionCreator(
  "placeTokenAt",
  "index",
  "token"
);

ActionCreator.setCurrentPhase = makeActionCreator(
  "setCurrentPhase",
  "phaseKey"
);

ActionCreator.setCurrentPlayer = makeActionCreator(
  "setCurrentPlayer",
  "playerId"
);

ActionCreator.setCurrentPlayerOrder = makeActionCreator(
  "setCurrentPlayerOrder",
  "playerIds"
);

ActionCreator.setCurrentRound = makeActionCreator("setCurrentRound", "round");

ActionCreator.setCurrentStep = makeActionCreator("setCurrentStep", "stepKey");

ActionCreator.setPlayers = makeActionCreator("setPlayers", "players");

Object.freeze(ActionCreator);

export default ActionCreator;
