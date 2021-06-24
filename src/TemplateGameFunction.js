const GameFunction = {};

GameFunction.isGameOver = (/* store */) => {};

GameFunction.phaseKeys = (/* state */) => {};

GameFunction.phaseEnd = (/* store */) => Promise.resolve();

GameFunction.phaseStart = (/* store */) => Promise.resolve();

GameFunction.roundEnd = (/* store */) => Promise.resolve();

GameFunction.roundStart = (/* store */) => Promise.resolve();

GameFunction.stepFunction = (/* store */) => Promise.resolve();

GameFunction.stepKeys = (/* state */) => {};

GameFunction.turnEnd = (/* store */) => Promise.resolve();

GameFunction.turnStart = (/* store */) => Promise.resolve();

Object.freeze(GameFunction);

export default GameFunction;
